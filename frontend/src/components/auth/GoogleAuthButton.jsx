import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GoogleAuthButton = () => {
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const navigate = useNavigate();

   /**
   * Handles successful Google login credential response.
   * Sends the ID token to the backend for verification.
   * @param {object} credentialResponse - The credential response object from Google.
   */
   const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Send the Google ID token to your backend for verification
      const response = await axios.post('http://localhost:8000/google-login', {
        id_token: credentialResponse.credential,
      });

      localStorage.setItem('token', response.data.access_token);
      navigate('/tvara');
    } catch (error) {
      console.error("Google login failed on backend:", error);
      // Replace with a custom modal or toast notification
      alert("Google login failed. Please try again.");
    }
  };

  /**
   * Handles Google login failure.
   * @param {object} error - The error object from Google login.
   */
  const handleGoogleFailure = (error) => {
    console.log('Google Login Failed:', error);
    // Replace with a custom modal or toast notification
    alert("Google login failed. Please try again.");
  };


  return (
    <div className="flex justify-center w-full"> {/* Center the button and ensure full width */}
      {GOOGLE_CLIENT_ID ? (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            // Optional: Customize button theme and shape
            theme="filled_blue" // "outline" for white button with colored text/logo
            shape="circle" // "circle", "square", "pill"
            text="scontinue_with" // "signin_with", "signup_with", "continue_with", "signin"
            size="large" // "small", "medium", "large"
            width="100%" // Makes the button take the full width of its parent container
          />
        </GoogleOAuthProvider>
      ) : (
        <p className="text-red-500 text-sm text-center">Google Client ID not configured.</p>
      )}
    </div>
  );
};

export default GoogleAuthButton;
