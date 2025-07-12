import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Award, Settings, Edit, Camera, Trophy, Zap, Users } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface UserProfile {
  username: string;
  email: string;
  createdAt: string;
  greenKarma: number;
  ecoPoints: number;
  teamRank: string;
  badges: { name: string; desc: string; icon: string }[];
}

const Profile: React.FC = () => {
  const { isDarkMode } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'settings'>('overview');
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/user/profile');
        setUser(res.data);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };
    fetchUser();
  }, []);

  if (!user) return <div className="text-center py-10">Loading...</div>;

  const stats = [
    { label: 'Green Karma', value: user.greenKarma || 0, icon: Trophy, color: 'yellow' },
    { label: 'Eco Points', value: user.ecoPoints || 0, icon: Zap, color: 'green' },
    { label: 'Team Rank', value: user.teamRank || '', icon: Users, color: 'blue' },
    { label: 'Badges Earned', value: user.badges.length || 0, icon: Award, color: 'purple' },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Profile Header */}
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 mb-8`}>
    <div className="flex items-center space-x-6">
    <div className="relative">
    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
    <User className="h-12 w-12 text-white" />
    </div>
    <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
    <Camera className="h-4 w-4 text-white" />
    </button>
    </div>
    <div className="flex-1">
    <div className="flex items-center space-x-3 mb-2">
    <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
    {user.username}
    </h1>
    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
    <Edit className="h-4 w-4 text-gray-500" />
    </button>
    </div>
    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{user.email}</p>
    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
    Member since {new Date(user.createdAt).toLocaleDateString()}
    </p>
    </div>
    </div>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    {stats.map((stat) => (
      <div key={stat.label} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
      <div className="flex items-center justify-between">
      <div>
      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{stat.label}</p>
      <p className={`text-2xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      {stat.value}
      </p>
      </div>
      <div className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900/20 rounded-full flex items-center justify-center`}>
      <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
      </div>
      </div>
      </div>
    ))}
    </div>

    {/* Tabs */}
    <div className="flex space-x-1 mb-8">
    {[
      { id: 'overview', label: 'Overview', icon: User },
      { id: 'badges', label: 'Badges', icon: Award },
      { id: 'settings', label: 'Settings', icon: Settings },
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
      <tab.icon className="h-5 w-5" />
      <span>{tab.label}</span>
      </button>
    ))}
    </div>

    {/* Tab Content */}
    {activeTab === 'overview' && (
      <div className="space-y-8">
      {/* Recent Activity placeholder (fetch from your activities API if needed) */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
      <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      Recent Activity
      </h3>
      <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No recent activities yet.</p>
      </div>
      </div>
    )}

    {activeTab === 'badges' && (
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
      <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      Your Badges
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {user.badges.length > 0 ? (
        user.badges.map((badge, index) => (
          <div
          key={index}
          className="text-center p-4 rounded-lg bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20"
          >
          <div className="text-4xl mb-2">{badge.icon}</div>
          <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
          {badge.name}
          </h4>
          <p className={`text-xs ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>{badge.desc}</p>
          </div>
        ))
      ) : (
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No badges earned yet.</p>
      )}
      </div>
      </div>
    )}

    {activeTab === 'settings' && (
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
      <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      Account Settings
      </h3>
      <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
      Username
      </label>
      <input
      type="text"
      value={user.username}
      readOnly
      className={`w-full px-3 py-2 border rounded-lg ${
        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
      }`}
      />
      </div>
      <div>
      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
      Email
      </label>
      <input
      type="email"
      value={user.email}
      readOnly
      className={`w-full px-3 py-2 border rounded-lg ${
        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
      }`}
      />
      </div>
      </div>
      </div>
      </div>
    )}
    </div>
    </div>
  );
};

export default Profile;
