import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, MapPin, Upload, Map, List, Filter, AlertTriangle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import PhotoUpload from './PhotoUpload';
import TrashMap from './TrashMap';
import TrashList from './TrashList';

interface TrashReport {
  _id: string;
  isCleaned: boolean;
  reportedBy: string;
}

const TrashTagger: React.FC = () => {
  const { isDarkMode, user } = useStore(); // assuming you have `user` in your store
  const [showUpload, setShowUpload] = useState(false);
  const [activeTab, setActiveTab] = useState<'map' | 'list'>('map');
  const [filterType, setFilterType] = useState<'all' | 'hotspots' | 'cleaned'>('all');
  const [reports, setReports] = useState<TrashReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/trash');
        setReports(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load reports.');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const totalReports = reports.length;
  const hotspots = reports.filter(r => !r.isCleaned).length;
  const cleaned = reports.filter(r => r.isCleaned).length;
  const yourReports = reports.filter(r => r.reportedBy === user?.name).length; // adjust depending on your user data

  const stats = [
    { label: 'Total Reports', value: totalReports.toString(), color: 'blue' },
    { label: 'Hotspots', value: hotspots.toString(), color: 'red' },
    { label: 'Cleaned Areas', value: cleaned.toString(), color: 'green' },
    { label: 'Your Reports', value: yourReports.toString(), color: 'purple' }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Header */}
    <div className="flex justify-between items-center mb-8">
    <div>
    <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
    TrashTagger
    </h1>
    <p className={`mt-2 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
    Report and track trash hotspots in your community
    </p>
    </div>
    <button
    onClick={() => setShowUpload(true)}
    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
    >
    <Camera className="h-5 w-5" />
    <span>Report Trash</span>
    </button>
    </div>

    {/* Stats */}
    {loading ? (
      <div className="text-center py-12 text-gray-500">Loading stats...</div>
    ) : error ? (
      <div className="text-center py-12 text-red-500">
      <AlertTriangle className="mx-auto mb-2" />
      {error}
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.label} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
        <div className="flex items-center justify-between">
        <div>
        <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {stat.label}
        </p>
        <p className={`text-2xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {stat.value}
        </p>
        </div>
        <div className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900/20 rounded-full flex items-center justify-center`}>
        <MapPin className={`h-6 w-6 text-${stat.color}-600`} />
        </div>
        </div>
        </div>
      ))}
      </div>
    )}

    {/* Controls */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
    {/* Tab Navigation */}
    <div className="flex space-x-1">
    <button
    onClick={() => setActiveTab('map')}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
      activeTab === 'map'
      ? 'bg-blue-600 text-white'
      : isDarkMode
      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
      : 'bg-white text-gray-600 hover:bg-gray-100'
    }`}
    >
    <Map className="h-5 w-5" />
    <span>Map View</span>
    </button>
    <button
    onClick={() => setActiveTab('list')}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
      activeTab === 'list'
      ? 'bg-blue-600 text-white'
      : isDarkMode
      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
      : 'bg-white text-gray-600 hover:bg-gray-100'
    }`}
    >
    <List className="h-5 w-5" />
    <span>List View</span>
    </button>
    </div>

    {/* Filter */}
    <div className="flex items-center space-x-2">
    <Filter className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
    <select
    value={filterType}
    onChange={(e) => setFilterType(e.target.value as any)}
    className={`px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
      isDarkMode
      ? 'bg-gray-800 border-gray-600 text-white'
      : 'bg-white border-gray-300 text-gray-900'
    }`}
    >
    <option value="all">All Reports</option>
    <option value="hotspots">Hotspots Only</option>
    <option value="cleaned">Cleaned Areas</option>
    </select>
    </div>
    </div>

    {/* Content */}
    <div className="min-h-[600px]">
    {activeTab === 'map' ? (
      <TrashMap filterType={filterType} />
    ) : (
      <TrashList filterType={filterType} />
    )}
    </div>

    {/* Upload Modal */}
    {showUpload && (
      <PhotoUpload onClose={() => setShowUpload(false)} />
    )}
    </div>
    </div>
  );
};

export default TrashTagger;
