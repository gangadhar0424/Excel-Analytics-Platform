import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../redux/authSlice';
import { useToast } from '../context/ToastContext';
import { ChartBarSquareIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      if (result && result.data && result.data.token) {
        showToast('Login successful!', 'success');
        navigate('/');
      }
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-95 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10 max-w-md w-full text-center transform scale-100 transition-all duration-300 ease-out border-4 border-blue-500">
        {/* Header */}
        <ChartBarSquareIcon className="h-20 w-20 text-blue-600 mx-auto mb-6 animate-pulse" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🚀 Welcome Back!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
          Sign in to continue your data analysis journey
        </p>

        {/* Login Form */}
        <form className="w-full space-y-6" onSubmit={handleSubmit} autoComplete="off">
          {/* Email Field */}
          <div className="relative">
            <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="email"
              autoComplete="off"
              placeholder="Enter your email"
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="password"
              autoComplete="off"
              placeholder="Enter your password"
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 text-xl shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 active:scale-95"
          >
            🔐 Sign In
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold hover:underline transition-colors duration-300"
            >
              Create one here
            </Link>
          </p>
        </div>

        {/* Back to Landing */}
        <div className="mt-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm transition-colors duration-300"
          >
            ← Back to Welcome
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
