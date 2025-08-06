import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, DocumentArrowUpIcon, FolderOpenIcon } from '@heroicons/react/24/outline';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import api from '../services/api';

const APP_NAME = 'DataVista';
const chartTypes = [
  { label: 'Bar Chart', value: 'bar' },
  { label: 'Pie Chart', value: 'pie' },
  { label: 'Line Chart', value: 'line' },
  { label: 'Donut Chart', value: 'donut' },
];

const dummyColumns = ['Category', 'Value1', 'Value2', 'Value3', 'Total'];
const dummyData = [
  { Category: 'Electronics', Value1: 1000, Value2: 300, Value3: 400, Total: 1700 },
  { Category: 'Fashion', Value1: 850, Value2: 220, Value3: 430, Total: 1500 },
  { Category: 'Home Decor', Value1: 970, Value2: 310, Value3: 470, Total: 1750 },
  { Category: 'Books', Value1: 450, Value2: 150, Value3: 300, Total: 900 },
  { Category: 'Groceries', Value1: 780, Value2: 280, Value3: 390, Total: 1450 },
];

const UploadFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [columns, setColumns] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [chartType, setChartType] = useState('bar');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const chartData = {
    labels: previewData.map(row => row[xAxis]),
    datasets: [
      {
        label: yAxis,
        data: previewData.map(row => row[yAxis]),
        backgroundColor: [
          '#7c3aed', '#a78bfa', '#c4b5fd', '#f472b6', '#fbbf24', '#34d399', '#60a5fa', '#f87171', '#facc15', '#4ade80'
        ],
        borderColor: '#7c3aed',
        borderWidth: 1,
      },
    ],
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      setLoading(true);
      setError('');
      setSelectedFile(e.target.files[0]);
      try {
        const formData = new FormData();
        formData.append('file', e.target.files[0]);
        const res = await api.post('/api/upload', formData, { headers: {} });
        const { headers, preview } = res.data;
        setColumns(headers);
        setPreviewData(preview.map(rowArr => {
          const obj = {};
          headers.forEach((col, idx) => {
            obj[col] = rowArr[idx];
          });
          return obj;
        }));
        setXAxis(headers[0] || '');
        setYAxis(headers[1] || '');
        setShowPreview(true);
      } catch (err) {
        setError(err.message || 'Failed to upload and parse file');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-purple-700 text-white flex flex-col py-6 px-4 min-h-screen">
        <div className="flex items-center mb-10">
          <span className="text-2xl font-extrabold tracking-wide">{APP_NAME}</span>
        </div>
        <nav className="flex flex-col gap-4">
          <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-purple-800 transition"><HomeIcon className="h-5 w-5" /> Dashboard</Link>
          <Link to="/upload" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-purple-800 transition"><DocumentArrowUpIcon className="h-5 w-5" /> Upload New File</Link>
          <Link to="#" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-purple-800 transition"><FolderOpenIcon className="h-5 w-5" /> Uploaded Files</Link>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-gray-50 px-8 py-12">
        <div className="bg-white rounded-lg shadow p-8 w-full max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Upload Excel File</h1>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            className="mb-4"
            onChange={handleFileChange}
          />
          {showPreview && (
            <>
             {error && <div className="text-red-500 mb-2">{error}</div>}
             {loading && <div className="text-gray-400 mb-2">Uploading and parsing file...</div>}
              <h3 className="text-lg font-semibold mb-2 mt-6">File Preview</h3>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border rounded">
                  <thead>
                    <tr>
                      {columns.map(col => (
                        <th key={col} className="px-3 py-2 border-b bg-purple-50 text-purple-700 font-semibold">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, idx) => (
                      <tr key={idx}>
                        {columns.map(col => (
                          <td key={col} className="px-3 py-2 border-b text-center">{row[col]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <h3 className="text-lg font-semibold mb-2">Chart Configuration</h3>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <label className="block mb-1 font-medium">Select X-Axis</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={xAxis}
                    onChange={e => setXAxis(e.target.value)}
                  >
                    {columns.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block mb-1 font-medium">Select Y-Axis</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={yAxis}
                    onChange={e => setYAxis(e.target.value)}
                  >
                    {columns.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block mb-1 font-medium">Chart Type</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={chartType}
                    onChange={e => setChartType(e.target.value)}
                  >
                    {chartTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="w-full min-h-[300px] flex items-center justify-center">
                {chartType === 'bar' && <Bar data={chartData} />}
                {chartType === 'pie' && <Pie data={chartData} />}
                {chartType === 'line' && <Line data={chartData} />}
                {chartType === 'donut' && <Doughnut data={chartData} />}
              </div>
            </>
          )}
        </div>
      </main>
      <footer className="fixed bottom-0 left-0 w-full text-center py-4 bg-white border-t text-gray-500 text-sm z-50">
        © 2025 DataVista. Designed & Developed By <span className="text-purple-700 font-semibold">Gangadhar Reddy</span>
      </footer>
    </div>
  );
};

export default UploadFile; 