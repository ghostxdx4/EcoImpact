import React from 'react';
import { MapPin, CheckCircle, AlertTriangle } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface TrashMapProps {
  filterType: 'all' | 'hotspots' | 'cleaned';
}

const TrashMap: React.FC<TrashMapProps> = ({ filterType }) => {
  const { isDarkMode } = useStore();

  // Mock data for demonstration
  const mockReports = [
    {
      id: '1',
      location: { lat: 40.7128, lng: -74.0060 },
      isCleaned: false,
      trashTypes: ['plastic', 'cigarettes'],
      createdAt: new Date('2024-01-10'),
      reportedBy: 'Rahul Sharma'
    },
    {
      id: '2',
      location: { lat: 40.7489, lng: -73.9857 },
      isCleaned: true,
      trashTypes: ['food', 'bags'],
      createdAt: new Date('2024-01-08'),
      reportedBy: 'Priya Singh'
    },
    {
      id: '3',
      location: { lat: 40.7831, lng: -73.9712 },
      isCleaned: false,
      trashTypes: ['electronics', 'metal'],
      createdAt: new Date('2024-01-12'),
      reportedBy: 'Tanmay Gupta'
    },
    {
      id: '4',
      location: { lat: 40.7282, lng: -73.7949 },
      isCleaned: true,
      trashTypes: ['glass', 'paper'],
      createdAt: new Date('2024-01-05'),
      reportedBy: 'Binod Kumar'
    },
    {
      id: '5',
      location: { lat: 40.6782, lng: -73.9442 },
      isCleaned: false,
      trashTypes: ['plastic', 'other'],
      createdAt: new Date('2024-01-14'),
      reportedBy: 'Umang Patel'
    }
  ];

  const filteredReports = mockReports.filter(report => {
    switch (filterType) {
      case 'hotspots':
        return !report.isCleaned;
      case 'cleaned':
        return report.isCleaned;
      default:
        return true;
    }
  });

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
      <div className="h-96 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/20 dark:to-green-900/20 relative">
        {/* Mock Map Background */}
        <div className="absolute inset-0 bg-opacity-20 bg-gray-500 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <p className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Interactive Map
            </p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Trash reports and cleanup locations
            </p>
          </div>
        </div>

        {/* Mock Map Markers */}
        <div className="absolute inset-0 pointer-events-none">
          {filteredReports.map((report, index) => (
            <div
              key={report.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
              style={{
                left: `${20 + index * 15}%`,
                top: `${30 + (index % 3) * 20}%`
              }}
            >
              <div className="relative group">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg cursor-pointer ${
                  report.isCleaned 
                    ? 'bg-green-600 text-white' 
                    : 'bg-red-600 text-white'
                }`}>
                  {report.isCleaned ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} px-3 py-2 rounded-lg shadow-lg border min-w-max`}>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {report.isCleaned ? 'Cleaned Area' : 'Trash Hotspot'}
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      By {report.reportedBy}
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {report.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h4 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Map Legend
          </h4>
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {filteredReports.length} locations shown
          </span>
        </div>
        <div className="flex items-center space-x-6 mt-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-2 w-2 text-white" />
            </div>
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Trash Hotspots
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
              <CheckCircle className="h-2 w-2 text-white" />
            </div>
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Cleaned Areas
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrashMap;