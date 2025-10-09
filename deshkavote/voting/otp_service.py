import random
import logging
import requests
from django.utils import timezone
from django.conf import settings
from .models import OTPVerification, Voter

logger = logging.getLogger(__name__)

class OTPService:
    """Handle OTP generation and verification using Fast2SMS"""

    @staticmethod
    def generate_otp():
        """Generate 6-digit OTP"""
        return str(random.randint(100000, 999999))

    @staticmethod
    def send_otp(mobile):
        """
        Generate and send OTP to a mobile number using Fast2SMS.
        """
        try:
            # Check if mobile number already has 2 registered users
            if Voter.objects.filter(mobile=mobile).count() >= 2:
                return False, "This mobile number is already registered with 2 accounts.", None

            # Invalidate all previous OTPs for this mobile
            OTPVerification.objects.filter(mobile=mobile, verified=False).update(verified=True)

            # Generate new OTP
            otp_code = OTPService.generate_otp()

            # Create OTP record
            OTPVerification.objects.create(
                mobile=mobile,
                otp=otp_code,
            )

            # --- START: FAST2SMS INTEGRATION ---
            try:
                url = "https://www.fast2sms.com/dev/bulkV2"
                
                payload = {
                    'variables_values': otp_code,
                    'route': 'otp',
                    'numbers': mobile,
                }
                
                headers = {
                    'authorization': settings.FAST2SMS_API_KEY,
                    'Content-Type': "application/x-www-form-urlencoded",
                    'Cache-Control': "no-cache",
                }
                
                response = requests.post(url, data=payload, headers=headers)
                response_data = response.json()
                
                if response_data.get('return'):
                    logger.info(f"OTP sent successfully to {mobile} via Fast2SMS")
                    return True, "OTP sent successfully to your mobile number", otp_code
                else:
                    logger.error(f"Fast2SMS error: {response_data}")
                    # For development, still return success with OTP in console
                    logger.warning(f"DEVELOPMENT MODE - OTP for {mobile}: {otp_code}")
                    return True, "OTP sent successfully (dev mode)", otp_code
                    
            except Exception as e:
                logger.error(f"Failed to send OTP via Fast2SMS: {e}")
                # For development, print OTP to console
                logger.warning(f"DEVELOPMENT MODE - OTP for {mobile}: {otp_code}")
                print(f"\n{'='*50}")
                print(f"DEVELOPMENT MODE - OTP for {mobile}: {otp_code}")
                print(f"{'='*50}\n")
                return True, "OTP sent successfully (check console in dev mode)", otp_code
            # --- END: FAST2SMS INTEGRATION ---

        except Exception as e:
            logger.error(f"Error in send_otp service: {e}")
            return False, f"An unexpected error occurred: {str(e)}", None

    @staticmethod
    def verify_otp(mobile, otp_code):
        """
        Verify OTP for mobile number
        Returns: (success: bool, message: str)
        """
        try:
            # Get the latest unverified OTP for this mobile
            otp_record = OTPVerification.objects.filter(
                mobile=mobile,
                verified=False
            ).order_by('-created_at').first()

            if not otp_record:
                return False, "No valid OTP found. Please request a new one."

            # Check if OTP is still valid (not expired, not too many attempts)
            if not otp_record.is_valid():
                # Mark as verified to invalidate it
                otp_record.verified = True
                otp_record.save()
                return False, "OTP has expired or maximum attempts reached. Please request a new one."

            # Increment attempts
            otp_record.attempts += 1
            otp_record.save()

            # Verify OTP code
            if otp_record.otp == otp_code:
                otp_record.verified = True
                otp_record.save()
                return True, "OTP verified successfully"
            else:
                remaining_attempts = 3 - otp_record.attempts
                if remaining_attempts > 0:
                    return False, f"Invalid OTP. You have {remaining_attempts} attempt(s) remaining."
                else:
                    otp_record.verified = True  # Invalidate after max attempts
                    otp_record.save()
                    return False, "Invalid OTP. Maximum attempts reached. Please request a new OTP."

        except Exception as e:
            logger.error(f"Error verifying OTP: {e}")
            return False, f"An error occurred during OTP verification."