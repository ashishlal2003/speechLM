import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import Button from "../../components/elements/Button";
import Divider from "../../components/elements/Divider";
import FormInput from "../../components/elements/FormInputs";
import { useForm } from "../../hooks/useForm";
import { loginValidationRules } from "../../validation-rules/validationRules"
import axios from 'axios'
import GoogleAuthButton from "../../components/auth/GoogleAuthButton"; 


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
      navigate('/dashboard');
    } catch (error) {
      // Using a more user-friendly message for errors
      console.error("Login failed:", error);
      // Replace with a custom modal or toast notification in a real app
      // For this example, I'll use a simple alert as per original request, but it's not ideal.
      alert("Incorrect email or password");
    }
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

        {/* Use the new reusable GoogleAuthButton component */}
        <GoogleAuthButton/>
      </div>
    </AuthLayout>
  );
};

export default Login;