import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useStore } from '../../store/useStore';

interface CarbonLog {
  _id: string;
  userId: string;
  category: 'Transport' | 'Energy' | 'Food' | 'Waste';
  action: string;
  co2Saved: number;
  pointsEarned: number;
  date: string;
}

const CarbonChart: React.FC = () => {
  const { isDarkMode, user } = useStore();
  const [carbonLogs, setCarbonLogs] = useState<CarbonLog[]>([]);
  const [loading, setLoading] = useState(true);

  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
    const fetchCarbonLogs = async () => {
      if (!user?.username) return;

      try {
        const res = await fetch(`http://localhost:5000/api/carbon-log/${encodeURIComponent(user.username)}`);

        if (!res.ok) {
          const message = await res.text();
          throw new Error(`Server ${res.status}: ${message}`);
        }

        const logs: CarbonLog[] = await res.json();
        setCarbonLogs(logs);

        // Process data
        processWeeklyData(logs);
        processMonthlyData(logs);
        processCategoryData(logs);
      } catch (err) {
        console.error('Failed to fetch carbon logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCarbonLogs();
  }, [user?.username]);

  const processWeeklyData = (logs: CarbonLog[]) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 6); // Last 7 days including today

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const weeklyMap: Record<string, { co2: number; actions: number }> = {};

    // Initialize with zero
    for (let i = 0; i < 7; i++) {
      const date = new Date(oneWeekAgo);
      date.setDate(oneWeekAgo.getDate() + i);
      const day = days[date.getDay()];
      weeklyMap[day] = { co2: 0, actions: 0 };
    }

    logs.forEach(log => {
      const logDate = new Date(log.date);
      if (logDate >= oneWeekAgo) {
        const day = days[logDate.getDay()];
        if (!weeklyMap[day]) {
          weeklyMap[day] = { co2: 0, actions: 0 };
        }
        weeklyMap[day].co2 += log.co2Saved;
        weeklyMap[day].actions += 1;
      }
    });

    const weeklyArr = Object.entries(weeklyMap).map(([day, value]) => ({
      day,
      co2: parseFloat(value.co2.toFixed(2)),
                                                                       actions: value.actions
    }));

    setWeeklyData(weeklyArr);
  };

  const processMonthlyData = (logs: CarbonLog[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyMap: Record<string, number> = {};

    logs.forEach(log => {
      const logDate = new Date(log.date);
      const month = months[logDate.getMonth()];
      if (!monthlyMap[month]) monthlyMap[month] = 0;
      monthlyMap[month] += log.co2Saved;
    });

    const monthlyArr = Object.entries(monthlyMap).map(([month, co2]) => ({
      month,
      co2: parseFloat(co2.toFixed(2))
    }));

    setMonthlyData(monthlyArr);
  };

  const processCategoryData = (logs: CarbonLog[]) => {
    const categoryMap: Record<string, number> = {};
    let total = 0;

    logs.forEach(log => {
      if (!categoryMap[log.category]) categoryMap[log.category] = 0;
      categoryMap[log.category] += log.co2Saved;
      total += log.co2Saved;
    });

    const categoryArr = Object.entries(categoryMap).map(([category, co2]) => ({
      category,
      co2: parseFloat(co2.toFixed(2)),
                                                                              percentage: total > 0 ? Math.round((co2 / total) * 100) : 0
    }));

    setCategoryData(categoryArr);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
      <span className="text-gray-500">Loading charts...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
    {/* Weekly Progress */}
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
    <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
    Weekly CO₂ Savings
    </h3>
    <div className="h-64">
    <ResponsiveContainer width="100%" height="100%">
    <LineChart data={weeklyData}>
    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
    <XAxis dataKey="day" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} fontSize={12} />
    <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} fontSize={12} />
    <Tooltip
    contentStyle={{
      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      color: isDarkMode ? '#ffffff' : '#000000'
    }}
    />
    <Line
    type="monotone"
    dataKey="co2"
    stroke="#10b981"
    strokeWidth={3}
    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
    activeDot={{ r: 6 }}
    />
    </LineChart>
    </ResponsiveContainer>
    </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    {/* Monthly Trend */}
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
    <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
    Monthly Trend
    </h3>
    <div className="h-64">
    <ResponsiveContainer width="100%" height="100%">
    <BarChart data={monthlyData}>
    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
    <XAxis dataKey="month" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} fontSize={12} />
    <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} fontSize={12} />
    <Tooltip
    contentStyle={{
      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      color: isDarkMode ? '#ffffff' : '#000000'
    }}
    />
    <Bar dataKey="co2" fill="#3b82f6" radius={[4, 4, 0, 0]} />
    </BarChart>
    </ResponsiveContainer>
    </div>
    </div>

    {/* Category Breakdown */}
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
    <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
    Savings by Category
    </h3>
    <div className="space-y-4">
    {categoryData.map((item, index) => (
      <div key={index} className="space-y-2">
      <div className="flex justify-between items-center">
      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
      {item.category}
      </span>
      <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      {item.co2}kg
      </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
      <div
      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
      style={{ width: `${item.percentage}%` }}
      ></div>
      </div>
      </div>
    ))}
    </div>
    </div>
    </div>
    </div>
  );
};

export default CarbonChart;
