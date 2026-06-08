import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

const StatusIndicator = ({ isOnline }) => {
  return (
    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-semibold border ${isOnline ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'}`}>
      {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
      <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
    </div>
  );
};

export default StatusIndicator;
