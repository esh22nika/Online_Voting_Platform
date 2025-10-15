import random
import logging
from django.utils import timezone
from django.conf import settings
from django.core.mail import send_mail
from .models import OTPVerification, Voter

logger = logging.getLogger(__name__)

class OTPService:
    """Handle OTP generation and verification using email."""

    @staticmethod
    def generate_otp():
        """Generate a 6-digit OTP"""
        return str(random.randint(100000, 999999))

    @staticmethod
    def send_otp(mobile):
        """
        Generate and send OTP to voter's email.
        Fallback: print OTP in console for dev mode.
        """
        try:
            # Fetch voter by mobile
            voter = Voter.objects.filter(mobile=mobile).first()
            if not voter or not voter.email:
                return False, "No email associated with this mobile number.", None

            # Invalidate all previous unverified OTPs for this voter
            OTPVerification.objects.filter(email=voter.email, verified=False).update(verified=True)

            # Generate new OTP
            otp_code = OTPService.generate_otp()

            # Create OTP record
            OTPVerification.objects.create(
                email=voter.email,
                mobile=mobile,
                otp=otp_code,
            )

            # Try sending email OTP
            try:
                send_mail(
                    subject='Your OTP for Desh Ka Vote',
                    message = (
                        f"Welcome to Desh Ka Vote, your secure platform for participating in elections.\n\n"
                        f"Your One-Time Password (OTP) is: {otp_code}\n\n"
                        f"This OTP is valid for 10 minutes and should be kept confidential. "
                        f"Never share it with anyone — not even your friends or family. "
                        f"It’s the key to accessing your account and casting your vote safely. \n\n"
                        f"Thank you for being a responsible voter and making your voice heard!"
                    ),
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[voter.email],
                    fail_silently=False,
                )
                logger.info(f"OTP email sent successfully to {voter.email}")
                return True, f"OTP sent successfully to {voter.email}", otp_code

            except Exception as e:
                logger.error(f"Failed to send OTP email: {e}")
                print(f"\n{'='*50}")
                print(f"DEVELOPMENT MODE - OTP for {mobile}: {otp_code}")
                print(f"{'='*50}\n")
                return True, "OTP sent successfully (check console in dev mode)", otp_code

        except Exception as e:
            logger.error(f"Error in send_otp service: {e}")
            return False, f"An unexpected error occurred: {str(e)}", None

    @staticmethod
    def verify_otp(mobile, otp_code):
        """
        Verify OTP for voter by mobile/email.
        Returns: (success: bool, message: str)
        """
        try:
            voter = Voter.objects.filter(mobile=mobile).first()
            if not voter or not voter.email:
                return False, "No email associated with this mobile number."

            # Get the latest unverified OTP for this email
            otp_record = OTPVerification.objects.filter(
                email=voter.email,
                verified=False
            ).order_by('-created_at').first()

            if not otp_record:
                return False, "No valid OTP found. Please request a new one."

            # Check validity
            if not otp_record.is_valid():
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
                    otp_record.verified = True
                    otp_record.save()
                    return False, "Invalid OTP. Maximum attempts reached. Please request a new OTP."

        except Exception as e:
            logger.error(f"Error verifying OTP: {e}")
            return False, "An error occurred during OTP verification."
