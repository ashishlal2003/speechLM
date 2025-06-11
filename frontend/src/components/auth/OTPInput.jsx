import { useState, useRef, useEffect } from 'react';

const OTPInput = ({ value, onChange, error, disabled = false }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  // Initialize refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  // Update internal state when value prop changes
  useEffect(() => {
    if (value) {
      const otpArray = value.split('').slice(0, 6);
      while (otpArray.length < 6) {
        otpArray.push('');
      }
      setOtp(otpArray);
    } else {
      setOtp(['', '', '', '', '', '']);
    }
  }, [value]);

  const handleChange = (index, inputValue) => {
    // Only allow numbers
    const numericValue = inputValue.replace(/[^0-9]/g, '');
    
    if (numericValue.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = numericValue;
      setOtp(newOtp);
      
      // Call parent onChange
      onChange(newOtp.join(''));
      
      // Auto-focus next input
      if (numericValue && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current input is empty, focus previous input
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        onChange(newOtp.join(''));
      }
    }
    
    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    
    if (pastedData) {
      const newOtp = pastedData.split('');
      while (newOtp.length < 6) {
        newOtp.push('');
      }
      setOtp(newOtp);
      onChange(newOtp.join(''));
      
      // Focus the next empty input or the last input
      const nextEmptyIndex = newOtp.findIndex(digit => !digit);
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : Math.min(pastedData.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        Enter OTP
      </label>
      <div className="flex justify-center gap-2 sm:gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={el => inputRefs.current[index] = el}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={`
              w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-semibold
              border-2 rounded-lg transition-all duration-200 outline-none
              ${error 
                ? 'border-red-300 bg-red-50 text-red-600 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                : 'border-slate-300 bg-white text-slate-800 focus:border-green-500 focus:ring-2 focus:ring-green-200'
              }
              ${disabled 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'hover:border-slate-400'
              }
              ${digit 
                ? 'border-green-400 bg-green-50' 
                : ''
              }
            `}
            aria-label={`OTP digit ${index + 1}`}
          />
        ))}
      </div>
      <p className="text-sm text-slate-500 text-center">
        Enter the 6-digit code sent to your email
      </p>
      {error && (
        <p className="text-sm text-red-600 text-center">
          {error}
        </p>
      )}
    </div>
  );
};

export default OTPInput;