import React from 'react';

const StatCard = ({ title, value, unit, icon: Icon, colorClass }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4 hover:shadow-md transition-shadow">
      <div className={`p-4 rounded-full ${colorClass}`}>
        {Icon && <Icon size={24} />}
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <div className="flex items-baseline space-x-1">
          <h3 className="text-2xl font-bold text-gray-800">{value !== null ? value : '--'}</h3>
          {value !== null && <span className="text-sm text-gray-500">{unit}</span>}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
