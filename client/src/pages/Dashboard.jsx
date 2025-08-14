import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFiles, uploadFile } from '../redux/fileSlice';
import { HomeIcon, DocumentArrowUpIcon, FolderOpenIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';

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

const Dashboard = () => {
  const dispatch = useDispatch();
  const { files, loading } = useSelector(state => state.files);
  const [analyzeFile, setAnalyzeFile] = useState(null);
  const [fileColumns, setFileColumns] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [chartType, setChartType] = useState('bar');
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchFiles());
  }, [dispatch]);

  // Open file dialog when sidebar or upload card is clicked
  const handleUploadClick = (e) => {
    e.preventDefault();
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Handle file selection and upload
  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await dispatch(uploadFile(file)).unwrap();
      // Simulate analysis for demo (replace with real API call)
      setAnalyzeFile({ name: file.name });
      setFileColumns(dummyColumns);
      setFileData(dummyData);
      setXAxis(dummyColumns[0]);
      setYAxis(dummyColumns[1]);
      setChartType('bar');
    }
  };

  // Handle Analyze button for any file
  const handleAnalyze = (file) => {
    navigate(`/analyze/${file._id}`);
  };

  const chartData = {
    labels: fileData.map(row => row[xAxis]),
    datasets: [
      {
        label: yAxis,
        data: fileData.map(row => row[yAxis]),
        backgroundColor: [
          '#7c3aed', '#a78bfa', '#c4b5fd', '#f472b6', '#fbbf24', '#34d399', '#60a5fa', '#f87171', '#facc15', '#4ade80'
        ],
        borderColor: '#7c3aed',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Hamburger menu for mobile */}
      <button
        className="absolute top-4 left-4 z-50 md:hidden bg-white p-2 rounded shadow"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <Bars3Icon className="h-6 w-6 text-purple-700" />
      </button>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-purple-700 text-white flex flex-col py-6 px-4 min-h-screen transform transition-transform duration-200 md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Close button for mobile */}
        <button
          className="absolute top-4 right-4 md:hidden bg-white p-1 rounded"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <XMarkIcon className="h-5 w-5 text-purple-700" />
        </button>
        <div className="flex items-center mb-10">
          <span className="text-2xl font-extrabold tracking-wide">{APP_NAME}</span>
        </div>
        <nav className="flex flex-col gap-4">
          <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-purple-800 transition"><HomeIcon className="h-5 w-5" /> Dashboard</Link>
          <a href="#" onClick={handleUploadClick} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-purple-800 transition"><DocumentArrowUpIcon className="h-5 w-5" /> Upload New File</a>
          <Link to="/uploaded-files" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-purple-800 transition"><FolderOpenIcon className="h-5 w-5" /> Uploaded Files</Link>
        </nav>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </aside>
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-gray-50 px-8 py-12">
        {/* Upload Card */}
        <div className="bg-white rounded-lg shadow p-8 w-full max-w-3xl mx-auto mb-8 flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4">Upload Excel File</h3>
          <button
            className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition font-semibold mb-2"
            onClick={handleUploadClick}
          >
            Choose File
          </button>
          <span className="text-gray-500">Supported: .xlsx, .xls, .csv</span>
        </div>
        {/* Uploaded Files List */}
        <div className="w-full max-w-3xl bg-white rounded-lg shadow p-6 mb-8 mx-auto">
          <h3 className="text-lg font-semibold mb-4">Uploaded Files</h3>
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading...</div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-purple-400 mb-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0 0V8m0 4h4m-4 0H8m12 4.5V6.75A2.25 2.25 0 0017.75 4.5H6.25A2.25 2.25 0 004 6.75v10.5A2.25 2.25 0 006.25 19.5h11.5A2.25 2.25 0 0020 17.25V17" />
              </svg>
              <div className="font-semibold text-lg text-gray-500 mb-2">No Files Found</div>
              <div className="text-gray-400 mb-4 text-center">You haven't uploaded any files yet. Start by uploading a file to analyze.</div>
            </div>
          ) : (
            <ul className="space-y-3">
              {files.map(file => (
                <li key={file._id} className="flex items-center justify-between bg-purple-50 rounded px-4 py-2">
                  <span className="font-medium text-gray-700">{file.originalName || file.name}</span>
                  <button
                    className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition font-semibold"
                    onClick={() => handleAnalyze(file)}
                  >
                    Analyze
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Analysis Section */}
        {analyzeFile && (
          <div className="w-full max-w-4xl bg-white rounded-lg shadow p-8 mb-8 mx-auto">
            <h3 className="text-lg font-semibold mb-4">Analysis for: <span className="text-purple-700 font-bold">{analyzeFile.originalName || analyzeFile.name}</span></h3>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="block mb-1 font-medium">Select X-Axis</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={xAxis}
                  onChange={e => setXAxis(e.target.value)}
                >
                  {fileColumns.map(col => (
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
                  {fileColumns.map(col => (
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
          </div>
        )}
      </main>
      <footer className="fixed bottom-0 left-0 w-full text-center py-4 bg-white border-t text-gray-500 text-sm z-50">
        © 2025 DataVista. Designed & Developed By <span className="text-purple-700 font-semibold">Gangadhar Reddy</span>
      </footer>
    </div>
  );
};

export default Dashboard;
