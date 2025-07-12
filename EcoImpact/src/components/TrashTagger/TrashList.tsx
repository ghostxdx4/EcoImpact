import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapPin, Clock, User, CheckCircle, AlertTriangle, Camera } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface TrashListProps {
  filterType: 'all' | 'hotspots' | 'cleaned';
}

interface TrashReport {
  _id: string;
  location: { lat: number; lng: number };
  address: string;
  isCleaned: boolean;
  trashTypes: string[];
  createdAt: string;
  reportedBy: string;
  description: string;
  beforePhoto: string;
  afterPhoto?: string;
}

const TrashList: React.FC<TrashListProps> = ({ filterType }) => {
  const { isDarkMode } = useStore();
  const [reports, setReports] = useState<TrashReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/trash');
        setReports(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch reports. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const filteredReports = reports.filter(report => {
    switch (filterType) {
      case 'hotspots':
        return !report.isCleaned;
      case 'cleaned':
        return report.isCleaned;
      default:
        return true;
    }
  });

  const getTrashTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      plastic: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      cigarettes: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      food: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      bags: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      electronics: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      metal: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      glass: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300',
      paper: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      other: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300'
    };
    return colors[type] || colors.other;
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
      <AlertTriangle className="mx-auto mb-2" />
      {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
    {filteredReports.map((report) => (
      <div
      key={report._id}
      className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow`}
      >
      <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
      <div className={`p-2 rounded-full ${
        report.isCleaned
        ? 'bg-green-100 dark:bg-green-900/20'
        : 'bg-red-100 dark:bg-red-900/20'
      }`}>
      {report.isCleaned ? (
        <CheckCircle className="h-5 w-5 text-green-600" />
      ) : (
        <AlertTriangle className="h-5 w-5 text-red-600" />
      )}
      </div>
      <div>
      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      {report.isCleaned ? 'Cleaned Area' : 'Trash Hotspot'}
      </h3>
      <div className="flex items-center space-x-4 text-sm text-gray-500">
      <div className="flex items-center space-x-1">
      <MapPin className="h-4 w-4" />
      <span>{report.address || 'Unknown Location'}</span>
      </div>
      <div className="flex items-center space-x-1">
      <Clock className="h-4 w-4" />
      <span>{new Date(report.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="flex items-center space-x-1">
      <User className="h-4 w-4" />
      <span>{report.reportedBy || 'Anonymous'}</span>
      </div>
      </div>
      </div>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        report.isCleaned
        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      }`}>
      {report.isCleaned ? 'Cleaned' : 'Needs Cleanup'}
      </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      {/* Photos */}
      <div className="md:col-span-1">
      <div className="space-y-2">
      {report.beforePhoto && (
        <div className="relative">
        <img
        src={report.beforePhoto}
        alt="Before"
        className="w-full h-32 object-cover rounded-lg"
        />
        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
        Before
        </div>
        </div>
      )}
      {report.afterPhoto && (
        <div className="relative">
        <img
        src={report.afterPhoto}
        alt="After"
        className="w-full h-32 object-cover rounded-lg"
        />
        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
        After
        </div>
        </div>
      )}
      </div>
      </div>

      {/* Details */}
      <div className="md:col-span-2">
      <div className="space-y-3">
      <div>
      <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
      Description
      </h4>
      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
      {report.description || 'No description provided.'}
      </p>
      </div>

      <div>
      <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
      Trash Types
      </h4>
      <div className="flex flex-wrap gap-2">
      {report.trashTypes.map((type) => (
        <span
        key={type}
        className={`px-2 py-1 rounded text-xs font-medium ${getTrashTypeColor(type)}`}
        >
        {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      ))}
      </div>
      </div>

      {!report.isCleaned && (
        <div className="flex items-center space-x-3 mt-4">
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        <Camera className="h-4 w-4" />
        <span>Claim This Spot</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <MapPin className="h-4 w-4" />
        <span>View on Map</span>
        </button>
        </div>
      )}
      </div>
      </div>
      </div>
      </div>
    ))}

    {filteredReports.length === 0 && (
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-12 text-center`}>
      <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      No reports found
      </h3>
      <p className={`text-gray-500 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
      No trash reports match your current filter. Try adjusting your filters or report new trash!
      </p>
      </div>
    )}
    </div>
  );
};

export default TrashList;
