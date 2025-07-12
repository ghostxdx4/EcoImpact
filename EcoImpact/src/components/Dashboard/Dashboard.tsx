import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Award, Users, Zap, Camera, TrendingUp, Calendar, Leaf } from 'lucide-react';
import { useStore } from '../../store/useStore';
import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';
import BadgeShowcase from './BadgeShowcase';
import TeamCard from './TeamCard';

const Dashboard: React.FC = () => {
  const { user, team, carbonLogs, trashReports, isDarkMode } = useStore();
  const navigate = useNavigate();

  if (!user) return null;

  const totalCO2Saved = carbonLogs.reduce((sum, log) => sum + log.co2Saved, 0);
  const totalTrashReports = trashReports.length;
  const cleanedReports = trashReports.filter(report => report.isCleaned).length;

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const ecoTips = [
    "Switch to LED bulbs to reduce energy consumption by up to 80%.",
    "Carry a reusable water bottle to cut down on plastic waste.",
    "Use public transport or carpool to lower carbon footprint.",
    "Unplug chargers and devices when not in use to save energy.",
    "Compost your food waste to enrich soil and reduce methane emissions.",
    "Opt for plant-based meals a few times a week to save water and land.",
    "Collect rainwater for gardening to conserve tap water.",
    "Use cold water for laundry to save electricity.",
    "Switch to e-bills to reduce paper waste.",
    "Shop local and seasonal produce to cut transportation emissions."
  ];

  const randomTip = ecoTips[Math.floor(Math.random() * ecoTips.length)];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    {/* Header */}
    <div className="mb-8">
    <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
    नमस्ते {user.username}! Welcome back!
    </h1>
    <p className={`mt-2 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
    Your eco-impact dashboard
    </p>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <StatsCard
    title="Green Karma"
    value={user.greenKarma.toLocaleString()}
    icon={<Award className="h-6 w-6 text-green-600" />}
    trend="+12%"
    color="green"
    />
    <StatsCard
    title="CO₂ Saved"
    value={`${totalCO2Saved}kg`}
    icon={<Leaf className="h-6 w-6 text-blue-600" />}
    trend="+8%"
    color="blue"
    />
    <StatsCard
    title="Trash Reports"
    value={totalTrashReports.toString()}
    icon={<Camera className="h-6 w-6 text-orange-600" />}
    trend="+15%"
    color="orange"
    />
    <StatsCard
    title="Areas Cleaned"
    value={cleanedReports.toString()}
    icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
    trend="+20%"
    color="purple"
    />
    </div>

    {/* Main Content Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {/* Left Column */}
    <div className="lg:col-span-2 space-y-8">
    {/* Recent Activity */}
    <RecentActivity />

    {/* Quick Actions */}
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
    <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
    Quick Actions
    </h3>
    <div className="grid grid-cols-2 gap-4">
    <button
    onClick={() => handleNavigate('/carbon-challenge')}
    className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
    >
    <Zap className="h-6 w-6 text-green-600" />
    <span className={`font-medium ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
    Log Carbon Action
    </span>
    </button>

    <button
    onClick={() => handleNavigate('/trash-tagger')}
    className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
    >
    <Camera className="h-6 w-6 text-blue-600" />
    <span className={`font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
    Report Trash
    </span>
    </button>

    <button
    onClick={() => handleNavigate('/teams')}
    className="flex items-center space-x-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
    >
    <Users className="h-6 w-6 text-orange-600" />
    <span className={`font-medium ${isDarkMode ? 'text-orange-300' : 'text-orange-700'}`}>
    Join Team
    </span>
    </button>

    <button
    onClick={() => handleNavigate('/events')}
    className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
    >
    <Calendar className="h-6 w-6 text-purple-600" />
    <span className={`font-medium ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
    Find Events
    </span>
    </button>
    </div>
    </div>
    </div>

    {/* Right Column */}
    <div className="space-y-8">
    {/* Team Card */}
    {team && <TeamCard team={team} />}

    {/* Badge Showcase */}
    <BadgeShowcase badges={user.badges} />

    {/* Eco Tips */}
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
    <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
    Today's Eco Tip
    </h3>
    <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4">
    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
    💡 {randomTip}
    </p>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
  );
};

export default Dashboard;
