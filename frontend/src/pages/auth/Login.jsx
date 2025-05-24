import AuthLayout from "../../components/auth/AuthLayout";
import Button from "../../components/elements/Button";
import Divider from "../../components/elements/Divider";
import FormInput from "../../components/elements/FormInputs";
import GoogleIcon from "../../components/elements/GoogleIcon";
import { useForm } from "../../hooks/useForm";
import {loginValidationRules} from "../../validation-rules/validationRules"

const Login = () => {
  const { formData, errors, isLoading, handleInputChange, handleSubmit } = useForm(
    { email: '', password: '' },
    loginValidationRules
  );

  const onSubmit = async (data) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Login submitted:', data);
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
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
            <a href="/create-account" className="text-orange-500 hover:text-orange-600 font-semibold transition-colors">
              Sign up
            </a>
          </p>
        </div>
        <Divider />

        <GoogleIcon onClick={handleGoogleLogin} />

      </div>
    </AuthLayout>
  );
};

export default Login;