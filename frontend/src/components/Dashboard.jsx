import React, { useEffect, useState } from 'react';
import { Activity, ArrowDownToLine, ArrowUpToLine, Calculator } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';
import StatCard from './StatCard';
import StatusIndicator from './StatusIndicator';

const Dashboard = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [readings, setReadings] = useState([]);
  const [latest, setLatest] = useState(null);
  const [stats, setStats] = useState({ average: null, minimum: null, maximum: null });

  const fetchData = async () => {
    try {
      // Fetch status (Health Check)
      await api.get('health/');
      setIsOnline(true);

      // Fetch Latest Reading
      const resLatest = await api.get('readings/latest/');
      if (resLatest.data.data) {
        setLatest(resLatest.data.data);
      }

      // Fetch Statistics
      const resStats = await api.get('readings/statistics/');
      if (resStats.data.data) {
        setStats(resStats.data.data);
      }

      // Fetch All Readings for the Chart and Table (getting latest 20 for chart)
      const resList = await api.get('readings/');
      if (resList.data.data && Array.isArray(resList.data.data)) {
        // Reverse array for chart so it goes from old -> new on X axis
        const dataReversed = [...resList.data.data].reverse().slice(-30);
        
        // Format time for Recharts
        const chartData = dataReversed.map(r => ({
          time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          value: r.value,
        }));
        
        setReadings(resList.data.data); // Keep original order (newest first) for table
        // We will pass chartData specifically to the Chart if we stored it in state, 
        // but for simplicity we will just map it inline below.
      }
    } catch (error) {
      console.error("Error fetching data from API:", error);
      setIsOnline(false);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch immediately
    const interval = setInterval(fetchData, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  // Format data for chart
  const chartData = [...readings].reverse().slice(-20).map(r => ({
    time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    value: r.value,
  }));

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">IoT Monitoring System</h1>
          <p className="text-gray-500">Real-time sensor dashboard</p>
        </div>
        <StatusIndicator isOnline={isOnline} />
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Latest Reading" 
          value={latest?.value} 
          unit="cm" 
          icon={Activity} 
          colorClass="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="Average" 
          value={stats.average} 
          unit="cm" 
          icon={Calculator} 
          colorClass="bg-purple-100 text-purple-600" 
        />
        <StatCard 
          title="Minimum" 
          value={stats.minimum} 
          unit="cm" 
          icon={ArrowDownToLine} 
          colorClass="bg-green-100 text-green-600" 
        />
        <StatCard 
          title="Maximum" 
          value={stats.maximum} 
          unit="cm" 
          icon={ArrowUpToLine} 
          colorClass="bg-orange-100 text-orange-600" 
        />
      </div>

      {/* Chart and Table Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real-time Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Real-Time Sensor Data</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#1d4ed8' }}
                  animationDuration={500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Readings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full overflow-hidden">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Readings</h2>
          <div className="flex-1 overflow-y-auto pr-2">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Sensor</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3 rounded-tr-lg">Time</th>
                </tr>
              </thead>
              <tbody>
                {readings.slice(0, 15).map((reading) => (
                  <tr key={reading.id} className="border-b last:border-0 border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-700">{reading.sensor_name || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded font-semibold">
                        {reading.value}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(reading.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
                {readings.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
                      No readings available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
