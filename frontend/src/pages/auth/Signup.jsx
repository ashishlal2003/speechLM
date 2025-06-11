import { Link } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import Button from "../../components/elements/Button";
import Divider from "../../components/elements/Divider";
import FormInput from "../../components/elements/FormInputs";
// import GoogleIcon from "../../components/elements/GoogleIcon";
import { useForm } from "../../hooks/useForm";
import { createValidationRules } from "../../validation-rules/validationRules"
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import GoogleAuthButton from "../../components/auth/GoogleAuthButton";
import { useState } from "react";

const Signup = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState({ type: '', text: '' });

  const { formData, errors, isLoading, handleInputChange, handleSubmit } = useForm(
    { name: '', email: '', password: '', confirmPassword: '' },
    createValidationRules
  );

  const onSubmit = async (data) => {
    const payload = {
      username: data.name,
      email: data.email,
      password: data.password,
    };

    setMessage({ type: '', text: '' });

    try {
      // Register the user
      await axios.post('http://localhost:8000/register', payload);

      // Request OTP
      await axios.post('http://localhost:8000/request-otp', {
        email: data.email
      });

      // Navigate to OTP verification page
      navigate('/verify-otp', {
        state: { email: data.email }
      });

    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.detail || 'Registration failed. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
    }
  };


  return (
    <AuthLayout title="Create Your Account" subtitle="Create your account to get started">
      <div className="space-y-6">
        <FormInput
          label="Full name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter your full name"
          error={errors.name}
          focusColor="green"
        />
        <FormInput
          label="Email address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          error={errors.email}
          focusColor="green"
        />
        <FormInput
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Create a strong password"
          error={errors.password}
          focusColor="green"
        />
        <FormInput
          label="Confirm password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="Confirm your password"
          error={errors.confirmPassword}
          focusColor="green"
        />

        {message.text && (
          <div className={`p-4 rounded-lg text-center ${message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
            {message.text}
          </div>
        )}

        <Button
          variant="secondary"
          onClick={() => handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>

        <div className="text-center">
          <p className="text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="text-green-500 hover:text-green-600 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <Divider />
        <GoogleAuthButton />
      </div>
    </AuthLayout>
  );
};

export default Signup;