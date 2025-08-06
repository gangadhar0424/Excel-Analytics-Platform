import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-200 via-blue-100 to-blue-300 overflow-hidden">
      {/* Decorative blurred circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full opacity-30 blur-3xl animate-pulse -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full opacity-30 blur-3xl animate-pulse -z-10" />
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-100 rounded-full opacity-20 blur-2xl -translate-x-1/2 -translate-y-1/2 -z-10" />
      <div className="bg-white/90 rounded-3xl shadow-2xl p-12 flex flex-col items-center max-w-2xl w-full border border-purple-100">
        <div className="flex items-center gap-3 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-purple-600 animate-bounce">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
            <rect x="3" y="3" width="18" height="18" rx="4" className="stroke-current text-blue-400" fill="none" />
          </svg>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-blue-600 to-purple-400 drop-shadow-lg">DataVista</h1>
        </div>
        <p className="text-xl text-gray-700 mb-8 text-center max-w-xl">
          <span className="font-semibold text-purple-600">Effortless Excel Analytics</span> — Upload, visualize, and gain insights from your data instantly. Transform your spreadsheets into beautiful, interactive charts with just a few clicks.
        </p>
        <button
          className="px-10 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl text-xl font-bold shadow-lg hover:from-purple-700 hover:to-blue-600 transition mb-4"
          onClick={() => navigate('/dashboard')}
        >
          Go to Dashboard
        </button>
        <div className="text-sm text-gray-400 mt-2">No account? Login or register to get started!</div>
      </div>
      {/* Subtle floating shapes */}
      <div className="absolute left-1/4 top-1/4 w-16 h-16 bg-blue-200 rounded-full opacity-40 blur-xl animate-float-slow -z-10" />
      <div className="absolute right-1/3 bottom-1/3 w-24 h-24 bg-purple-200 rounded-full opacity-30 blur-xl animate-float -z-10" />
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-slow { animation: float 10s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Home; 