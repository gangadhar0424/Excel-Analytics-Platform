import React, { useState } from 'react';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
// import { Chart as ChartJS, ... } from 'chart.js'; // Chart.js registration if needed

const chartTypes = [
  { label: 'Bar Chart', value: 'bar' },
  { label: 'Line Chart', value: 'line' },
  { label: 'Pie Chart', value: 'pie' },
  { label: 'Scatter Plot', value: 'scatter' },
  // Add 3D chart options as needed
];

const ChartViewer = ({ columns = [], data = [] }) => {
  const [chartType, setChartType] = useState('bar');
  const [xAxis, setXAxis] = useState(columns[0] || '');
  const [yAxis, setYAxis] = useState(columns[1] || '');
  const [showChart, setShowChart] = useState(false);

  // Prepare chart.js data
  const chartData = {
    labels: data.map(row => row[xAxis]),
    datasets: [
      {
        label: yAxis,
        data: data.map(row => row[yAxis]),
        backgroundColor: 'rgba(59,130,246,0.6)',
        borderColor: 'rgba(59,130,246,1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 mt-8">
      {/* Chart Config */}
      <div className="bg-white rounded-lg shadow p-6 w-full md:w-1/2">
        <h3 className="font-semibold mb-4">Create a New Chart</h3>
        <div className="mb-4">
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
        <div className="mb-4">
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
        <div className="mb-4">
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
        <button
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          onClick={() => setShowChart(true)}
        >
          Show Analysis
        </button>
      </div>
      {/* Chart Display */}
      <div className="bg-white rounded-lg shadow p-6 w-full md:w-1/2 flex items-center justify-center min-h-[300px]">
        {showChart ? (
          chartType === 'bar' ? <Bar data={chartData} /> :
          chartType === 'line' ? <Line data={chartData} /> :
          chartType === 'pie' ? <Pie data={chartData} /> :
          chartType === 'scatter' ? <Scatter data={chartData} /> :
          <div className="text-gray-400">Chart type not supported yet.</div>
        ) : (
          <div className="text-gray-400">No Charts Yet</div>
        )}
      </div>
    </div>
  );
};

export default ChartViewer;
