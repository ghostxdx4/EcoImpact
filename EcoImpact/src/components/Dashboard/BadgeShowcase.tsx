import React, { useEffect, useState } from 'react';
import { Award, Star, Zap, Users, Camera, Leaf } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface Badge {
  id: string;
  name: string;
  description: string;
  earned: boolean;
}

interface BadgeShowcaseProps {
  badges: string[]; // list of earned badge ids
}

const BadgeShowcase: React.FC<BadgeShowcaseProps> = ({ badges }) => {
  const { isDarkMode } = useStore();
  const [allBadges, setAllBadges] = useState<Badge[]>([]);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await fetch('/api/badges/conditions');
        const data = await res.json();

        // Map earned status here
        const badgeData = data.map((badge: any) => ({
          ...badge,
          earned: badges.includes(badge.id)
        }));

        setAllBadges(badgeData);
      } catch (err) {
        console.error('Failed to fetch badges', err);
      }
    };

    fetchBadges();
  }, [badges]);

  const getIcon = (iconName: string) => {
    const icons = {
      leaf: <Leaf className="h-6 w-6" />,
      zap: <Zap className="h-6 w-6" />,
      camera: <Camera className="h-6 w-6" />,
      users: <Users className="h-6 w-6" />,
      award: <Award className="h-6 w-6" />,
      star: <Star className="h-6 w-6" />
    };
    return icons[iconName as keyof typeof icons] || <Award className="h-6 w-6" />;
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
    <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
    Your Badges
    </h3>

    {badges.length === 0 ? (
      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>No badges earned yet</p>
    ) : null}

    <div className="grid grid-cols-3 gap-4">
    {allBadges.map((badge) => (
      <div
      key={badge.id}
      className={`flex flex-col items-center p-3 rounded-lg ${
        badge.earned
        ? 'bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20'
        : 'bg-gray-100 dark:bg-gray-700'
      }`}
      >
      <div className={`p-2 rounded-full ${
        badge.earned ? 'text-yellow-600' : 'text-gray-400'
      }`}>
      {getIcon(badge.id.split('-')[0])}
      </div>
      <span className={`text-xs text-center mt-1 ${
        badge.earned
        ? isDarkMode ? 'text-yellow-300' : 'text-yellow-700'
        : isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
      {badge.name}
      </span>
      {!badge.earned && (
        <span className="text-[10px] text-center text-gray-400 mt-1">
        {badge.description}
        </span>
      )}
      </div>
    ))}
    </div>
    </div>
  );
};

export default BadgeShowcase;
