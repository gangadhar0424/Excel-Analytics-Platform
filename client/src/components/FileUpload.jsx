import React, { useRef, useState } from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { uploadFile, fetchFiles } from '../redux/fileSlice';
import { useToast } from '../context/ToastContext';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef();
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.files);
  const { showToast } = useToast();

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      try {
        await dispatch(uploadFile(file)).unwrap();
        showToast('File uploaded successfully!', 'success');
        setFile(null);
        dispatch(fetchFiles());
      } catch (err) {
        showToast(err.message || 'File upload failed', 'error');
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div
        className="border-2 border-dashed border-blue-400 rounded-lg p-8 w-full max-w-md flex flex-col items-center bg-blue-50 hover:bg-blue-100 transition cursor-pointer"
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => fileInputRef.current.click()}
      >
        <CloudArrowUpIcon className="h-12 w-12 text-blue-500 mb-2" />
        <p className="font-semibold text-blue-700 mb-1">Upload Excel File</p>
        <p className="text-gray-500 text-sm mb-2">Drag and drop your file here, or click to browse</p>
        <p className="text-xs text-gray-400">Supported: .xlsx, .xls, .csv</p>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          ref={fileInputRef}
          onChange={handleChange}
        />
      </div>
      {file && (
        <div className="mt-4 w-full max-w-md bg-white rounded shadow p-3 flex items-center justify-between">
          <span className="truncate text-gray-700">{file.name}</span>
          <button
            className="ml-4 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
