import React, { useEffect, useState } from 'react';
import { Plus, Zap, Car, Home, Utensils, Trash2, BarChart3 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import CarbonLogger from './CarbonLogger';
import CarbonChart from './CarbonChart';
import Leaderboard from './Leaderboard';

interface CarbonLog {
  _id: string;
  userId: string;
  category: 'Transport' | 'Energy' | 'Food' | 'Waste';
  action: string;
  co2Saved: number;
  pointsEarned: number;
  createdAt: string;
}

const CarbonChallenge: React.FC = () => {
  const user = useStore((state) => state.user);
  const isDarkMode = useStore((state) => state.isDarkMode);
  const carbonLogs = useStore((state) => state.carbonLogs);
  const setCarbonLogs = useStore((state) => state.setCarbonLogs);

  const [showLogger, setShowLogger] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'chart' | 'leaderboard'>('overview');

  const [loading, setLoading] = useState(true);
  const [weeklyTotal, setWeeklyTotal] = useState(0);

  useEffect(() => {
    const fetchCarbonLogs = async () => {
      if (!user?.username) return;        // <- guard

      try {
        const res = await fetch(
          `http://localhost:5000/api/carbon-log/${encodeURIComponent(user.username)}`
        );

        if (!res.ok) {
          // Get plain text to see server‑side error in the console
          const message = await res.text();
          throw new Error(`Server ${res.status}: ${message}`);
        }

        const logs: CarbonLog[] = await res.json();
        const fixedLogs = logs.map((log) => ({
          ...log,
          createdAt: log.date, // map backend date to frontend createdAt field
        }));
        setCarbonLogs(fixedLogs);
        setWeeklyTotal(getWeeklyTotal(fixedLogs));

      } catch (err) {
        console.error('Failed to fetch carbon logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCarbonLogs();
  }, [user?.username, setCarbonLogs]);


  const getWeeklyTotal = (logs: CarbonLog[]) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return logs
    .filter((log) => new Date(log.date) >= oneWeekAgo)
    .reduce((sum, log) => sum + log.co2Saved, 0);
  };


  // Categorize logs
  const categorized = {
    transport: 0,
    energy: 0,
    food: 0,
    waste: 0,
  };

  let totalSaved = 0;

  (carbonLogs ?? []).forEach((log) => {
    if (categorized[log.category] !== undefined) {
      categorized[log.category] += log.co2Saved;
      totalSaved += log.co2Saved;
    }
  });


  const recentLogs = [...(carbonLogs ?? [])]
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 5);


  const challengeGoal = 50;
  const challengeProgress = Math.min((weeklyTotal / challengeGoal) * 100, 100);

  const categories = [
      { name: 'transport', icon: <Car className="h-6 w-6" />, color: 'blue', savings: categorized.transport },
      { name: 'energy', icon: <Home className="h-6 w-6" />, color: 'green', savings: categorized.energy },
      { name: 'food', icon: <Utensils className="h-6 w-6" />, color: 'orange', savings: categorized.food },
      { name: 'waste', icon: <Trash2 className="h-6 w-6" />, color: 'purple', savings: categorized.waste },
  ];

  if (loading) return <div className="text-center mt-10 text-gray-500">Loading challenge data...</div>;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Header */}
    <div className="flex justify-between items-center mb-8">
    <div>
    <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
    Carbon Challenge
    </h1>
    <p className={`mt-2 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
    Track your daily eco-actions and carbon savings
    </p>
    </div>
    <button
    onClick={() => setShowLogger(true)}
    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
    >
    <Plus className="h-5 w-5" />
    <span>Log Action</span>
    </button>
    </div>

    {/* Stats Overview */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 lg:col-span-1`}>
    <div className="flex items-center justify-between mb-4">
    <Zap className="h-8 w-8 text-yellow-500" />
    <span className="text-sm font-medium text-green-600 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded">
    This Month
    </span>
    </div>
    <div>
    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
    {totalSaved.toFixed(1)}kg
    </p>
    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
    CO₂ Saved
    </p>
    </div>
    </div>

    {categories.map((cat) => (
      <div key={cat.name} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
      <div className="flex items-center justify-between mb-4">
      <div className={`text-${cat.color}-600`}>{cat.icon}</div>
      <span className={`text-xs font-medium text-${cat.color}-600 bg-${cat.color}-100 dark:bg-${cat.color}-900/20 px-2 py-1 rounded`}>
      {cat.name}
      </span>
      </div>
      <div>
      <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      {cat.savings.toFixed(1)}kg
      </p>
      <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
      CO₂ Saved
      </p>
      </div>
      </div>
    ))}
    </div>

    {/* Tabs */}
    <div className="flex space-x-1 mb-8">
    {[
      { id: 'overview', label: 'Overview', icon: <Zap className="h-5 w-5" /> },
      { id: 'chart', label: 'Analytics', icon: <BarChart3 className="h-5 w-5" /> },
      { id: 'leaderboard', label: 'Leaderboard', icon: <Car className="h-5 w-5" /> },
    ].map((tab) => (
      <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id as any)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        activeTab === tab.id
        ? 'bg-green-600 text-white'
        : isDarkMode
        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        : 'bg-white text-gray-600 hover:bg-gray-100'
      }`}
      >
      {tab.icon}
      <span>{tab.label}</span>
      </button>
    ))}
    </div>

    {/* Tab Content */}
    {activeTab === 'overview' && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Recent Actions */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
      <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      Recent Actions
      </h3>
      <div className="space-y-4">
      {recentLogs.map((item, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div>
        <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {item.action}
        </p>
        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {new Date(item.createdAt).toLocaleString()}
        </p>
        </div>
        <div className="text-right">
        <p className="text-sm font-medium text-green-600">
        {item.co2Saved.toFixed(1)}kg CO₂
        </p>
        <p className="text-xs text-gray-500">
        +{item.pointsEarned} points
        </p>
        </div>
        </div>
      ))}
      </div>
      </div>

      {/* Weekly Challenge */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
      <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      Weekly Challenge
      </h3>
      <div className="text-center mb-6">
      <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
      <span className="text-white text-2xl font-bold">{Math.round(challengeProgress)}%</span>
      </div>
      <p className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      Save {challengeGoal}kg CO₂ this week
      </p>
      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
      {weeklyTotal.toFixed(1)}kg saved • {(challengeGoal - weeklyTotal).toFixed(1)}kg to go
      </p>
      </div>
      <div className="space-y-2">
      <div className="flex justify-between text-sm">
      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Progress</span>
      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
      {Math.round(challengeProgress)}%
      </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
      <div
      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
      style={{ width: `${challengeProgress}%` }}
      />
      </div>
      </div>
      </div>
      </div>
    )}

    {activeTab === 'chart' && <CarbonChart />}
    {activeTab === 'leaderboard' && <Leaderboard />}

    {/* Modal */}
    {showLogger && <CarbonLogger onClose={() => setShowLogger(false)} />}
    </div>
    </div>
  );
};

export default CarbonChallenge;
