import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Plus, Search, Trophy, TrendingUp } from 'lucide-react';
import { useStore } from '../../store/useStore';

const Teams: React.FC = () => {
  const { isDarkMode } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateTeam, setShowCreateTeam] = useState(false);

  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [newTeamAvatar, setNewTeamAvatar] = useState('🌱');

  // Fetch teams from backend
  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/teams');
      setTeams(res.data);
    } catch (err) {
      console.error('Error fetching teams:', err);
    }
  };

  // Filtered teams based on search
  const filteredTeams = teams.filter(team =>
  team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  team.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle create team form submit
  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/teams', {
        name: newTeamName,
        description: newTeamDescription,
        avatar: newTeamAvatar
      });
      // Refresh team list
      fetchTeams();
      // Reset form and close modal
      setNewTeamName('');
      setNewTeamDescription('');
      setNewTeamAvatar('🌱');
      setShowCreateTeam(false);
    } catch (err) {
      console.error('Error creating team:', err);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    {/* Header */}
    <div className="flex justify-between items-center mb-8">
    <div>
    <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
    Teams
    </h1>
    <p className={`mt-2 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
    Join a team or create your own to amplify your impact
    </p>
    </div>
    <button
    onClick={() => setShowCreateTeam(true)}
    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
    >
    <Plus className="h-5 w-5" />
    <span>Create Team</span>
    </button>
    </div>

    {/* Search */}
    <div className="mb-8">
    <div className="relative">
    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
    <input
    type="text"
    placeholder="Search teams..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
      isDarkMode
      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
    }`}
    />
    </div>
    </div>

    {/* Teams Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {filteredTeams.map((team: any) => (
      <div
      key={team._id}
      className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow`}
      >
      <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
      <div className="text-3xl">{team.avatar}</div>
      <div>
      <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      {team.name}
      </h3>
      <div className="flex items-center space-x-2 text-sm text-gray-500">
      <Users className="h-4 w-4" />
      <span>{team.members} members</span>
      </div>
      </div>
      </div>
      {team.isJoined && (
        <span className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 px-2 py-1 rounded text-xs font-medium">
        Joined
        </span>
      )}
      </div>

      <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
      {team.description}
      </p>

      <div className="space-y-3 mb-4">
      <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
      <Trophy className="h-4 w-4 text-yellow-500" />
      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
      Green Karma
      </span>
      </div>
      <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      {team.greenKarma.toLocaleString()}
      </span>
      </div>
      <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
      <TrendingUp className="h-4 w-4 text-green-500" />
      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
      CO₂ Saved
      </span>
      </div>
      <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      {team.co2Saved}kg
      </span>
      </div>
      </div>

      <div className="flex space-x-3">
      {team.isJoined ? (
        <>
        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        View Team
        </button>
        <button className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        Leave Team
        </button>
        </>
      ) : (
        <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
        Join Team
        </button>
      )}
      </div>
      </div>
    ))}
    </div>

    {filteredTeams.length === 0 && (
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-12 text-center`}>
      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      No teams found
      </h3>
      <p className={`text-gray-500 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
      No teams match your search. Try a different search term or create your own team!
      </p>
      </div>
    )}

    {/* Create Team Modal */}
    {showCreateTeam && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl max-w-md w-full`}>
      <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      Create New Team
      </h3>
      <button
      onClick={() => setShowCreateTeam(false)}
      className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}
      >
      ×
      </button>
      </div>
      <form className="p-6" onSubmit={handleCreateTeam}>
      <div className="space-y-4">
      <div>
      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
      Team Name
      </label>
      <input
      type="text"
      value={newTeamName}
      onChange={(e) => setNewTeamName(e.target.value)}
      required
      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
        isDarkMode
        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
      }`}
      placeholder="Enter team name"
      />
      </div>
      <div>
      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
      Description
      </label>
      <textarea
      rows={3}
      value={newTeamDescription}
      onChange={(e) => setNewTeamDescription(e.target.value)}
      required
      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
        isDarkMode
        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
      }`}
      placeholder="Describe your team's mission and goals"
      />
      </div>
      <div>
      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
      Team Avatar
      </label>
      <div className="grid grid-cols-6 gap-2">
      {['🌱', '🌿', '🌍', '⚡', '🌳', '🍃', '🌊', '☀️', '🔥', '❄️', '🌈', '⭐'].map((emoji) => (
        <button
        key={emoji}
        type="button"
        onClick={() => setNewTeamAvatar(emoji)}
        className={`text-2xl p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
          newTeamAvatar === emoji ? 'ring-2 ring-green-500' : ''
        }`}
        >
        {emoji}
        </button>
      ))}
      </div>
      </div>
      </div>
      <div className="flex space-x-3 mt-6">
      <button
      type="button"
      onClick={() => setShowCreateTeam(false)}
      className={`flex-1 px-4 py-2 border rounded-lg font-medium transition-colors ${
        isDarkMode
        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
      }`}
      >
      Cancel
      </button>
      <button
      type="submit"
      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
      >
      Create Team
      </button>
      </div>
      </form>
      </div>
      </div>
    )}
    </div>
    </div>
  );
};

export default Teams;
