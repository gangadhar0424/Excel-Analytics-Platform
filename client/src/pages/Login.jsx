import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../redux/authSlice';
import { useToast } from '../context/ToastContext';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-2 text-blue-700">Excel Analytics</h2>
        <p className="mb-6 text-gray-500">Login to your account</p>
        <form className="w-full" onSubmit={handleSubmit} autoComplete="off">
          <input
            type="email"
            autoComplete="off"
            placeholder="Email"
            className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            autoComplete="off"
            placeholder="Password"
            className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-2 rounded hover:from-blue-600 hover:to-purple-600 transition"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
