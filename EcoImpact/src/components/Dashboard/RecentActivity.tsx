import React from 'react';
import { Car, Home, Utensils, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';

const RecentActivity: React.FC = () => {
  const { isDarkMode, carbonLogs } = useStore();

  const recentLogs = [...(carbonLogs ?? [])]
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 5);

  const categoryIcon = (category: string) => {
    switch (category) {
      case 'Transport':
        return <Car className="h-5 w-5 text-blue-600" />;
      case 'Energy':
        return <Home className="h-5 w-5 text-green-600" />;
      case 'Food':
        return <Utensils className="h-5 w-5 text-orange-600" />;
      case 'Waste':
        return <Trash2 className="h-5 w-5 text-purple-600" />;
      default:
        return <Car className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
    <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
    Recent Activity
    </h3>
    <div className="space-y-4">
    {recentLogs.map((log) => (
      <div
      key={log._id}
      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
      <div className="flex-shrink-0">
      {categoryIcon(log.category)}
      </div>
      <div className="flex-1 min-w-0">
      <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      {log.action}
      </p>
      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
      {new Date(log.createdAt).toLocaleString()}
      </p>
      </div>
      <div className="flex items-center space-x-2">
      <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded">
      +{log.pointsEarned}
      </span>
      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
      {log.co2Saved.toFixed(1)}kg CO₂
      </span>
      </div>
      </div>
    ))}
    </div>
    </div>
  );
};

export default RecentActivity;
