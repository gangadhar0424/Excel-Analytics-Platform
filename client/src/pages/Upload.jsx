import React from 'react';
import FileUpload from '../components/FileUpload';

const Upload = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-lg flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-2 text-blue-700">Upload Excel File</h2>
        <p className="mb-6 text-gray-500 text-center">Upload your Excel file (.xlsx or .xls) to analyze and visualize your data.</p>
        <FileUpload />
      </div>
    </div>
  );
};

export default Upload; 