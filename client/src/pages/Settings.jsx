import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import { logout } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { 
  UserCircleIcon, 
  Cog6ToothIcon, 
  BellIcon, 
  ShieldCheckIcon,
  KeyIcon,
  InformationCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  const { user } = useSelector(state => state.auth);
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const settingsSections = [
    {
      title: 'Appearance',
      icon: Cog6ToothIcon,
      items: [
        {
          label: 'Dark Mode',
          description: 'Switch between light and dark themes',
          component: <ThemeToggle />
        }
      ]
    },
    {
      title: 'Account',
      icon: UserCircleIcon,
      items: [
        {
          label: 'Username',
          value: user?.username || 'N/A',
          description: 'Your display name'
        },
        {
          label: 'Email',
          value: user?.email || 'N/A',
          description: 'Your email address'
        },
        {
          label: 'Role',
          value: user?.role || 'User',
          description: 'Your account role'
        },
        {
          label: 'Logout',
          description: 'Sign out of your account',
          action: 'logout'
        }
      ]
    },
    {
      title: 'Security',
      icon: ShieldCheckIcon,
      items: [
        {
          label: 'Change Password',
          description: 'Update your account password',
          action: 'button'
        },
        {
          label: 'Two-Factor Authentication',
          description: 'Add an extra layer of security',
          action: 'button'
        }
      ]
    },
    {
      title: 'Notifications',
      icon: BellIcon,
      items: [
        {
          label: 'Email Notifications',
          description: 'Receive email updates about your account',
          action: 'toggle'
        },
        {
          label: 'Push Notifications',
          description: 'Get real-time notifications in your browser',
          action: 'toggle'
        }
      ]
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Settings
          </h1>
          <p className={`text-lg ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Manage your account preferences and settings
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingsSections.map((section) => (
            <div key={section.title} className={`rounded-xl border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              {/* Section Header */}
              <div className="flex items-center space-x-3 p-6 border-b border-gray-200 dark:border-gray-700">
                <section.icon className="h-6 w-6 text-blue-600" />
                <h2 className={`text-xl font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {section.title}
                </h2>
              </div>

              {/* Section Items */}
              <div className="p-6 space-y-6">
                {section.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {item.label}
                      </h3>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {item.description}
                      </p>
                    </div>
                    
                    <div className="ml-4">
                      {item.component ? (
                        item.component
                      ) : item.value ? (
                        <span className={`text-sm ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {item.value}
                        </span>
                      ) : item.action === 'logout' ? (
                        <button 
                          onClick={handleLogout}
                          className="flex items-center space-x-2 px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        >
                          <ArrowRightOnRectangleIcon className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      ) : item.action === 'button' ? (
                        <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                          Configure
                        </button>
                      ) : item.action === 'toggle' ? (
                        <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                        }`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isDarkMode ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* About Section */}
          <div className={`rounded-xl border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center space-x-3 p-6 border-b border-gray-200 dark:border-gray-700">
              <InformationCircleIcon className="h-6 w-6 text-blue-600" />
              <h2 className={`text-xl font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                About
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Excel Analytics Platform
                  </h3>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Version 1.0.0
                  </p>
                </div>
                <div>
                  <h3 className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Features
                  </h3>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    • Excel file upload and analysis<br/>
                    • Interactive chart creation<br/>
                    • Data export and sharing<br/>
                    • Advanced analytics tools<br/>
                    • Dark mode support<br/>
                    • Mobile responsive design
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 