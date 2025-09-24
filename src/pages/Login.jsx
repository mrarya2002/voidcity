import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

// TopHeader Component (unchanged)
const TopHeader = () => {
  return (
    <header className="bg-black text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-3xl font-bold">
        <span className="text-cyan-400">VOID</span>{' '}
        <span className="text-blue-500">CITY</span>
      </h1>
      <span className="text-gray-300 text-sm">A city that you have dreamed</span>
    </header>
  );
};

// InputField Component (unchanged)
const InputField = ({ 
  label, 
  type, 
  value, 
  onChange, 
  placeholder, 
  icon: Icon,
  showPassword,
  togglePasswordVisibility 
}) => {
  return (
    <div className="mb-6">
      <label className="block text-white text-sm font-medium mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
    </div>
  );
};

// LoginForm Component
const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check for valid token on component mount
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds
        if (decoded.exp > currentTime) {
          // Token is valid and not expired
          navigate('/admin');
        } else {
          // Token is expired, remove it
          localStorage.removeItem('jwtToken');
        }
      } catch (err) {
        // Invalid token, remove it
        localStorage.removeItem('jwtToken');
      }
    }
  }, [navigate]);

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('https://illegal-backend.vercel.app/api/auth/login', {
        username: formData.username,
        password: formData.password
      });

      const { token } = response.data;
      localStorage.setItem('jwtToken', token);
      navigate('/admin');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Login Card */}
        <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-800">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400">Sign in to your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <div>
            <InputField
              label="Username"
              type="text"
              value={formData.username}
              onChange={handleInputChange('username')}
              placeholder="Enter your username"
              icon={User}
            />

            <InputField
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleInputChange('password')}
              placeholder="Enter your password"
              icon={Lock}
              showPassword={showPassword}
              togglePasswordVisibility={togglePasswordVisibility}
            />

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !formData.username || !formData.password}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-xs">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

// Main Login Page Component
const Login = () => {
  return (
    <div className="min-h-screen bg-black">
      <TopHeader />
      <LoginForm />
    </div>
  );
};

export default Login;