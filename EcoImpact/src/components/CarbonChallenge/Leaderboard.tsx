import React from 'react';
import { Trophy, Medal, Award, Crown } from 'lucide-react';
import { useStore } from '../../store/useStore';

const Leaderboard: React.FC = () => {
  const { isDarkMode } = useStore();

  const individualLeaderboard = [
    { rank: 1, name: 'Rahul Sharma', co2: 245.8, points: 2458, avatar: '👨‍💻' },
    { rank: 2, name: 'Priya Singh', co2: 198.3, points: 1983, avatar: '👩‍🔬' },
    { rank: 3, name: 'Tanmay Gupta', co2: 187.6, points: 1876, avatar: '👨‍🎨' },
    { rank: 4, name: 'Binod Kumar', co2: 165.2, points: 1652, avatar: '👩‍💼' },
    { rank: 5, name: 'Umang Patel', co2: 159.7, points: 1597, avatar: '👨‍🏫' },
    { rank: 6, name: 'Sneha Joshi', co2: 148.9, points: 1489, avatar: '👩‍⚕️' },
    { rank: 7, name: 'Maxwell D\'Souza', co2: 142.3, points: 1423, avatar: '👨‍🔧' },
    { rank: 8, name: 'Dattaraj Rao', co2: 138.5, points: 1385, avatar: '👩‍🎓' }
  ];

  const teamLeaderboard = [
    { rank: 1, name: 'Delhi Green Warriors', co2: 1247.6, members: 12, avatar: '🌱' },
    { rank: 2, name: 'Mumbai Eco Champions', co2: 1098.3, members: 8, avatar: '🌿' },
    { rank: 3, name: 'Bangalore Planet Savers', co2: 987.2, members: 15, avatar: '🌍' },
    { rank: 4, name: 'Kolkata Carbon Crushers', co2: 856.7, members: 10, avatar: '⚡' },
    { rank: 5, name: 'Goa Nature Guardians', co2: 789.4, members: 7, avatar: '🌳' }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <Trophy className="h-5 w-5 text-gray-400" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-400';
      case 3:
        return 'bg-gradient-to-r from-amber-500 to-yellow-600';
      default:
        return isDarkMode ? 'bg-gray-700' : 'bg-gray-100';
    }
  };

  return (
    <div className="space-y-8">
      {/* Individual Leaderboard */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
        <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Individual Leaderboard
        </h3>
        <div className="space-y-3">
          {individualLeaderboard.map((user) => (
            <div
              key={user.rank}
              className={`flex items-center p-4 rounded-lg transition-all hover:scale-105 ${
                user.rank <= 3 
                  ? getRankColor(user.rank) + ' text-white shadow-lg'
                  : isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="flex items-center justify-center w-8 h-8">
                  {user.rank <= 3 ? (
                    getRankIcon(user.rank)
                  ) : (
                    <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {user.rank}
                    </span>
                  )}
                </div>
                <div className="text-2xl">{user.avatar}</div>
                <div className="flex-1">
                  <p className={`font-medium ${
                    user.rank <= 3 
                      ? 'text-white' 
                      : isDarkMode 
                        ? 'text-white' 
                        : 'text-gray-900'
                  }`}>
                    {user.name}
                  </p>
                  <p className={`text-sm ${
                    user.rank <= 3 
                      ? 'text-white opacity-90' 
                      : isDarkMode 
                        ? 'text-gray-400' 
                        : 'text-gray-600'
                  }`}>
                    {user.co2}kg CO₂ saved
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${
                  user.rank <= 3 
                    ? 'text-white' 
                    : isDarkMode 
                      ? 'text-white' 
                      : 'text-gray-900'
                }`}>
                  {user.points.toLocaleString()}
                </p>
                <p className={`text-sm ${
                  user.rank <= 3 
                    ? 'text-white opacity-90' 
                    : isDarkMode 
                      ? 'text-gray-400' 
                      : 'text-gray-600'
                }`}>
                  points
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Leaderboard */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
        <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Team Leaderboard
        </h3>
        <div className="space-y-3">
          {teamLeaderboard.map((team) => (
            <div
              key={team.rank}
              className={`flex items-center p-4 rounded-lg transition-all hover:scale-105 ${
                team.rank <= 3 
                  ? getRankColor(team.rank) + ' text-white shadow-lg'
                  : isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="flex items-center justify-center w-8 h-8">
                  {team.rank <= 3 ? (
                    getRankIcon(team.rank)
                  ) : (
                    <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {team.rank}
                    </span>
                  )}
                </div>
                <div className="text-2xl">{team.avatar}</div>
                <div className="flex-1">
                  <p className={`font-medium ${
                    team.rank <= 3 
                      ? 'text-white' 
                      : isDarkMode 
                        ? 'text-white' 
                        : 'text-gray-900'
                  }`}>
                    {team.name}
                  </p>
                  <p className={`text-sm ${
                    team.rank <= 3 
                      ? 'text-white opacity-90' 
                      : isDarkMode 
                        ? 'text-gray-400' 
                        : 'text-gray-600'
                  }`}>
                    {team.members} members • {team.co2}kg CO₂ saved
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;