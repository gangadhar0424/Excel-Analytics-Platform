import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../redux/authSlice';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const [username, setUsername] = useState('');
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
      const result = await dispatch(registerUser({ username, email, password })).unwrap();
      if (result && result.token) {
        showToast('Registration successful!', 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-blue-100 to-purple-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-2 text-purple-700">Excel Analytics</h2>
        <p className="mb-6 text-gray-500">Create your account</p>
        <form className="w-full" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 rounded hover:from-purple-600 hover:to-pink-600 transition"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-600 hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
