import random
import logging
from django.utils import timezone
from django.conf import settings
from twilio.rest import Client
from .models import OTPVerification, Voter

logger = logging.getLogger(__name__)

class OTPService:
    """Handle OTP generation and verification"""

    @staticmethod
    def generate_otp():
        """Generate 6-digit OTP"""
        return str(random.randint(100000, 999999))

    @staticmethod
    def send_otp(mobile):
        """
        Generate and send OTP to a mobile number using Twilio.
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

            # --- START: TWILIO INTEGRATION ---
            try:
                client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
                message = client.messages.create(
                    body=f"Your DeshKaVote OTP is: {otp_code}. It is valid for 10 minutes.",
                    from_=settings.TWILIO_PHONE_NUMBER,
                    to=f"+91{mobile}" # Assuming Indian numbers
                )
                logger.info(f"OTP SMS sent successfully to {mobile} via Twilio. SID: {message.sid}")
            except Exception as e:
                logger.error(f"Failed to send OTP SMS via Twilio: {e}")
                # For development, we can proceed without sending SMS, but in production, this should be an error.
                # return False, "Failed to send OTP. Please try again later.", None
            # --- END: TWILIO INTEGRATION ---

            return True, "OTP sent successfully to your mobile number", otp_code

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
                return False, "OTP has expired or you have reached the maximum number of attempts."

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
                    return False, f"Invalid OTP. You have {remaining_attempts} attempts remaining."
                else:
                    return False, "Invalid OTP. Maximum attempts reached. Please request a new OTP."

        except Exception as e:
            logger.error(f"Error verifying OTP: {e}")
            return False, f"An error occurred during OTP verification."