import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ChartViewer from '../components/ChartViewer';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';

const Analyze = () => {
  const { fileId } = useParams();
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFileData = async () => {
      setLoading(true);
      setError('');
      try {
        // Try to fetch from backend first
        const res = await api.get(`/api/upload/parsed/${fileId}`);
        setColumns(res.data?.columns || res.columns || []);
        setData(res.data?.data || res.data || []);
      } catch (err) {
        console.error('Failed to fetch from backend:', err);
        
        // Fallback to sample data for testing
        const sampleColumns = ['Category', 'Sales', 'Profit', 'Quantity'];
        const sampleData = [
          { Category: 'Electronics', Sales: 1200, Profit: 300, Quantity: 45 },
          { Category: 'Clothing', Sales: 800, Profit: 200, Quantity: 30 },
          { Category: 'Books', Sales: 600, Profit: 150, Quantity: 25 },
          { Category: 'Home', Sales: 900, Profit: 250, Quantity: 35 },
          { Category: 'Sports', Sales: 700, Profit: 180, Quantity: 28 }
        ];
        
        setColumns(sampleColumns);
        setData(sampleData);
        
        // Show warning that we're using sample data
        setError('Using sample data for demonstration. Backend connection failed.');
      } finally {
        setLoading(false);
      }
    };
    
    if (fileId) {
      fetchFileData();
    } else {
      // If no fileId, use sample data
      const sampleColumns = ['Category', 'Sales', 'Profit', 'Quantity'];
      const sampleData = [
        { Category: 'Electronics', Sales: 1200, Profit: 300, Quantity: 45 },
        { Category: 'Clothing', Sales: 800, Profit: 200, Quantity: 30 },
        { Category: 'Books', Sales: 600, Profit: 150, Quantity: 25 },
        { Category: 'Home', Sales: 900, Profit: 250, Quantity: 35 },
        { Category: 'Sports', Sales: 700, Profit: 180, Quantity: 28 }
      ];
      setColumns(sampleColumns);
      setData(sampleData);
      setLoading(false);
    }
  }, [fileId]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`rounded-xl shadow-lg p-8 ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <h2 className={`text-3xl font-bold mb-2 ${
            isDarkMode ? 'text-white' : 'text-blue-700'
          }`}>
            Analyze File
          </h2>
          {fileId && (
            <p className={`text-sm mb-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              File ID: {fileId}
            </p>
          )}
          
          {loading ? (
            <div className={`text-center py-8 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-500'
            }`}>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              Loading file data...
            </div>
          ) : error ? (
            <div className={`p-4 rounded-lg mb-6 ${
              isDarkMode ? 'bg-yellow-900 border border-yellow-700' : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <p className={`text-sm ${
                isDarkMode ? 'text-yellow-200' : 'text-yellow-800'
              }`}>
                ⚠️ {error}
              </p>
            </div>
          ) : (
            <ChartViewer columns={columns} data={data} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Analyze; 