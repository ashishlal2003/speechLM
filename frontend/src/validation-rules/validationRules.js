// Validation Rules
export const createValidationRules = {
  name: [
    { test: (value) => value?.trim(), message: 'Full name is required' },
    { test: (value) => value?.trim().length >= 2, message: 'Name must be at least 2 characters' }
  ],
  email: [
    { test: (value) => value, message: 'Email is required' },
    { test: (value) => /\S+@\S+\.\S+/.test(value), message: 'Please enter a valid email' }
  ],
  password: [
    { test: (value) => value, message: 'Password is required' },
    { test: (value) => value?.length >= 8, message: 'Password must be at least 8 characters' },
    { test: (value) => /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value), message: 'Password must contain uppercase, lowercase and number' }
  ],
  confirmPassword: [
    { test: (value) => value, message: 'Please confirm your password' },
    { test: (value, formData) => value === formData.password, message: 'Passwords do not match' }
  ]
};

export const loginValidationRules = {
  email: createValidationRules.email,
  password: [
    { test: (value) => value, message: 'Password is required' },
    { test: (value) => value?.length >= 6, message: 'Password must be at least 6 characters' }
  ]
};