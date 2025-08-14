import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ChartViewer from '../components/ChartViewer';
import api from '../services/api';

const Analyze = () => {
  const { fileId } = useParams();
  const location = useLocation();
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFileData = async () => {
      setLoading(true);
      setError('');
      try {
        // Option 1: If backend provides parsed data endpoint
        const res = await api.get(`/api/upload/parsed/${fileId}`);
        setColumns(res.columns || []);
        setData(res.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load file data');
      } finally {
        setLoading(false);
      }
    };
    if (fileId) fetchFileData();
  }, [fileId]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 py-8">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-5xl flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-2 text-blue-700">Analyze File</h2>
        {loading ? (
          <div className="text-gray-500">Loading file data...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <ChartViewer columns={columns} data={data} />
        )}
      </div>
    </div>
  );
};

export default Analyze; 