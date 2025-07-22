import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './redux/authSlice';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Upload from './pages/Upload.jsx';
import Analyze from './pages/Analyze.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <Link to={token ? "/dashboard" : "/login"} className="text-xl font-bold text-blue-600 hover:text-blue-800 transition-colors duration-200">
        Excel Analytics Platform
      </Link>
      <div className="flex items-center space-x-4">
        {token ? (
          <>
            <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Dashboard</Link>
            <Link to="/upload" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Upload</Link>
            <span className="font-semibold text-blue-600">{user?.name || 'User'}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Login</Link>
            <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Routes future={{ v7_relativeSplatPath: true }}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/analyze/:fileId" element={<Analyze />} />
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
