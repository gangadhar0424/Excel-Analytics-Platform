import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFiles, deleteFile } from '../redux/fileSlice';
import { HomeIcon, DocumentArrowUpIcon, FolderOpenIcon } from '@heroicons/react/24/outline';

const APP_NAME = 'DataVista';

const UploadedFiles = () => {
  const dispatch = useDispatch();
  const { files, loading, error } = useSelector(state => state.files);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchFiles());
  }, [dispatch]);

  const handleAnalyze = (file) => {
    navigate(`/analyze/${file._id}`);
  };

  const [deletingId, setDeletingId] = React.useState(null);
  const handleDelete = async (file) => {
    setDeletingId(file.fileName);
    await dispatch(deleteFile(file.fileName));
    setDeletingId(null);
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
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Monitor History</h1>
          {error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : loading ? (
            <div className="text-center text-gray-400 py-8">Loading...</div>
          ) : !Array.isArray(files) || files.length === 0 ? (
            <div className="flex flex-col items-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-purple-400 mb-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0 0V8m0 4h4m-4 0H8m12 4.5V6.75A2.25 2.25 0 0017.75 4.5H6.25A2.25 2.25 0 004 6.75v10.5A2.25 2.25 0 006.25 19.5h11.5A2.25 2.25 0 0020 17.25V17" />
              </svg>
              <div className="font-semibold text-lg text-gray-500 mb-2">No Files Found</div>
              <div className="text-gray-400 mb-4 text-center">You haven't uploaded any files yet, start by uploading a file to view insights, generate charts, or store your data.</div>
              <Link to="/upload" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition font-semibold">Upload First File</Link>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2">File Name</th>
                  <th className="py-2">Date Uploaded</th>
                  <th className="py-2">Size</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map(file => (
                  <tr key={file._id} className="border-b hover:bg-gray-50">
                    <td className="py-2">{file.originalName || file.name}</td>
                    <td className="py-2">{file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString() : '-'}</td>
                    <td className="py-2">{file.fileSize ? (file.fileSize / 1024).toFixed(2) + ' KB' : '-'}</td>
                    <td className="py-2 space-x-2">
                      <button className="text-purple-600 hover:underline" onClick={() => handleAnalyze(file)}>Analyze</button>
                      <button
                        className="text-red-500 hover:underline disabled:opacity-50"
                        onClick={() => handleDelete(file)}
                        disabled={deletingId === file.fileName}
                      >
                        {deletingId === file.fileName ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
      <footer className="fixed bottom-0 left-0 w-full text-center py-4 bg-white border-t text-gray-500 text-sm z-50">
        © 2025 DataVista. Designed & Developed By <span className="text-purple-700 font-semibold">Gangadhar Reddy</span>
      </footer>
    </div>
  );
};

export default UploadedFiles; 