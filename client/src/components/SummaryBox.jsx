import React from 'react';

const SummaryBox = ({ title, value, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    purple: 'text-purple-600 bg-purple-100',
    pink: 'text-pink-600 bg-pink-100',
    green: 'text-green-600 bg-green-100',
  };

  return (
    <div className={`flex flex-col items-center bg-white rounded-lg shadow p-6 w-full ${colorClasses[color] || colorClasses.blue}`}>
      {Icon && <Icon className={`h-8 w-8 mb-2 ${colorClasses[color]}`} />}
      <span className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</span>
      <span className="text-gray-500">{title}</span>
    </div>
  );
};

export default SummaryBox;
