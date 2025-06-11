import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import Button from "../../components/elements/Button";
import OTPInput from "../../components/auth/OTPInput";
import axios from 'axios';

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showSuccess, setShowSuccess] = useState(false);

  // Redirect if no email provided and start initial timer
  useEffect(() => {
    if (!email) {
      navigate('/signup');
    } else {
      // Start initial 2-minute timer when component loads
      setResendTimer(120);
    }
  }, [email, navigate]);

  // Timer for resend functionality
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleOtpChange = (value) => {
    setOtp(value);
    setMessage({ type: '', text: '' });
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setMessage({ type: 'error', text: 'Please enter a 6-digit OTP' });
      return;
    }

    setIsVerifying(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post('http://localhost:8000/verify-otp', {
        email,
        otp_code: otp
      });

      // Show success message
      setMessage({ type: 'success', text: 'Verification successful!' });
      setShowSuccess(true);

      // Wait 2 seconds, then redirect
      setTimeout(() => {
        navigate('/tvara');
      }, 2000);

    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Verification failed. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setMessage({ type: '', text: '' });

    try {
      await axios.post('http://localhost:8000/request-otp', {
        email
      });

      setMessage({ type: 'success', text: 'OTP sent successfully!' });
      setResendTimer(120); // 2 minutes
      setOtp(''); // Clear current OTP
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to send OTP. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds) => {
    return `${seconds} seconds`;
  };

  if (showSuccess) {
    return (
      <AuthLayout title="Verification Successful!" subtitle="Redirecting you to your dashboard...">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-slate-600">Your account has been verified successfully!</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Verify Your Email" 
      subtitle={`We've sent a 6-digit code to ${email}`}
    >
      <form onSubmit={handleVerifyOtp} className="space-y-6">
        <OTPInput
          value={otp}
          onChange={handleOtpChange}
          error={message.type === 'error' && message.text.includes('OTP') ? message.text : ''}
          disabled={isVerifying}
        />

        {message.text && (
          <div className={`p-4 rounded-lg text-center ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <Button
          type="submit"
          variant="secondary"
          loading={isVerifying}
          disabled={isVerifying || otp.length !== 6}
        >
          {isVerifying ? 'Verifying...' : 'Verify OTP'}
        </Button>

        <div className="text-center space-y-4">
          <p className="text-slate-600">
            Didn't receive the code?
          </p>
          
          {resendTimer > 0 ? (
            <p className="text-slate-500">
              Resend OTP in {formatTime(resendTimer)}
            </p>
          ) : (
            <Button
              variant="outline"
              onClick={handleResendOtp}
              loading={isResending}
              disabled={isResending}
            >
              {isResending ? 'Sending...' : 'Resend OTP'}
            </Button>
          )}
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-green-500 hover:text-green-600 font-semibold transition-colors"
          >
            ← Back to Sign Up
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default OTPVerification;