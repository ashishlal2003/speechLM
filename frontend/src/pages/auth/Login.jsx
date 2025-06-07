import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import Button from "../../components/elements/Button";
import Divider from "../../components/elements/Divider";
import FormInput from "../../components/elements/FormInputs";
import GoogleIcon from "../../components/elements/GoogleIcon";
import { useForm } from "../../hooks/useForm";
import { loginValidationRules } from "../../validation-rules/validationRules"
import axios from 'axios'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';


const Login = () => {
  const navigate = useNavigate();

  const { formData, errors, isLoading, handleInputChange, handleSubmit } = useForm(
    { email: '', password: '' },
    loginValidationRules
  );

  const onSubmit = async (data) => {
    const payload = {
      email: data.email,
      password: data.password,
    };

    try {
      const response = await axios.post('http://localhost:8000/login', payload);
      localStorage.setItem('token', response.data.access_token);
      navigate('/tvara');
    } catch (error) {
      alert("Incorrect email or password");
    }
  };

  // const handleGoogleLogin = () => {
  //   console.log('Google login clicked');
  // };


  const handleGoogleSuccess = async (credentialResponse) => {
    console.log("Google Login Success:", credentialResponse);
  //   try {
  //     // Send the Google ID token to your backend for verification
  //     const response = await axios.post('http://localhost:8000/google-login', {
  //       id_token: credentialResponse.credential,
  //     });

  //     localStorage.setItem('token', response.data.access_token);
  //     navigate('/tvara');
  //   } catch (error) {
  //     console.error("Google login failed on backend:", error);
  //     alert("Google login failed. Please try again.");
  //   }
  };

  const handleGoogleFailure = (error) => {
    console.log('Google Login Failed:', error);
    alert("Google login failed. Please try again.");
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue your journey">
      <div className="space-y-6">
        <FormInput
          label="Email address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          error={errors.email}
          focusColor="orange"
        />

        <FormInput
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Enter your password"
          error={errors.password}
          focusColor="orange"
        />

        {/* <div className="text-right">
          <button className="text-sm text-orange-500 hover:text-orange-600 transition-colors font-medium">
            Forgot password?
          </button>
        </div> */}

        <Button
          variant="primary"
          onClick={() => handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>


        <div className="text-center">
          <p className="text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-orange-500 hover:text-orange-600 font-semibold transition-colors">
              Sign up
            </Link>
          </p>
        </div>
        <Divider />

        {/* <GoogleIcon onClick={handleGoogleLogin} /> */}

        <GoogleOAuthProvider clientId="">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            // Optional: Customize button theme and shape
            theme="filled_blue"
            shape="rectangular"
            text="signin_with"
            size="large"
            width="100%"
          />
        </GoogleOAuthProvider>

      </div>
    </AuthLayout>
  );
};

export default Login;