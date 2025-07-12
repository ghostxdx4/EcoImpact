import React, { useState } from 'react';
import { X, Camera, MapPin, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface PhotoUploadProps {
  onClose: () => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onClose }) => {
  const { isDarkMode, addTrashReport } = useStore();
  const [step, setStep] = useState<'upload' | 'details' | 'confirm'>('upload');
  const [beforePhoto, setBeforePhoto] = useState<string | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [trashTypes, setTrashTypes] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const trashCategories = [
    { id: 'plastic', name: 'Plastic Bottles', icon: '🍼' },
    { id: 'bags', name: 'Plastic Bags', icon: '🛍️' },
    { id: 'cigarettes', name: 'Cigarette Butts', icon: '🚬' },
    { id: 'food', name: 'Food Waste', icon: '🍕' },
    { id: 'electronics', name: 'E-Waste', icon: '📱' },
    { id: 'glass', name: 'Glass', icon: '🍺' },
    { id: 'metal', name: 'Metal Cans', icon: '🥤' },
    { id: 'paper', name: 'Paper', icon: '📄' },
    { id: 'other', name: 'Other', icon: '🗑️' }
  ];

  const handleFileUpload = (file: File, type: 'before' | 'after') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'before') {
        setBeforePhoto(result);
      } else {
        setAfterPhoto(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setIsGettingLocation(false);
        // Mock location for demo
        setLocation({ lat: 40.7128, lng: -74.0060 });
      }
    );
  };

  const toggleTrashType = (type: string) => {
    setTrashTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleSubmit = async () => {
    if (!beforePhoto || !location || trashTypes.length === 0) return;

    const newReport = {
      userId: '1',
      location,
      beforePhoto,
      afterPhoto: afterPhoto || undefined,
      trashTypes,
      description,
      isCleaned: !!afterPhoto,
      points: afterPhoto ? 20 : 10,
      createdAt: new Date(),
    };

    try {
      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReport),
      });

      if (response.ok) {
        console.log('Report saved');
        onClose();
      } else {
        console.error('Failed to save report');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Report Trash
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 'upload' && (
            <div className="space-y-6">
              <div className="text-center">
                <Camera className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h4 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Upload Photos
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Take a photo of the trash area. You can also upload an "after" photo if you've cleaned it.
                </p>
              </div>

              {/* Before Photo */}
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Before Photo (Required)
                </label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  beforePhoto 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {beforePhoto ? (
                    <div className="space-y-2">
                      <img src={beforePhoto} alt="Before" className="max-w-full h-40 object-cover rounded-lg mx-auto" />
                      <CheckCircle className="h-6 w-6 text-green-600 mx-auto" />
                      <p className="text-sm text-green-600 font-medium">Photo uploaded</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Click to upload or drag and drop
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'before')}
                        className="hidden"
                        id="before-photo"
                      />
                      <label
                        htmlFor="before-photo"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                      >
                        Choose File
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* After Photo */}
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  After Photo (Optional)
                </label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  afterPhoto 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {afterPhoto ? (
                    <div className="space-y-2">
                      <img src={afterPhoto} alt="After" className="max-w-full h-40 object-cover rounded-lg mx-auto" />
                      <CheckCircle className="h-6 w-6 text-green-600 mx-auto" />
                      <p className="text-sm text-green-600 font-medium">Cleanup photo uploaded</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Upload if you've cleaned the area
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'after')}
                        className="hidden"
                        id="after-photo"
                      />
                      <label
                        htmlFor="after-photo"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                      >
                        Choose File
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={onClose}
                  className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep('details')}
                  disabled={!beforePhoto}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-6">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h4 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Add Details
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Help us categorize the trash and get the location
                </p>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Location
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    <MapPin className="h-4 w-4" />
                    <span>{isGettingLocation ? 'Getting...' : 'Get Current Location'}</span>
                  </button>
                  {location && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Location captured</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Trash Types */}
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Trash Types (Select all that apply)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {trashCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => toggleTrashType(category.id)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        trashTypes.includes(category.id)
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="text-2xl mb-1">{category.icon}</div>
                      <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {category.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Additional details about the trash area..."
                />
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep('upload')}
                  className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('confirm')}
                  disabled={!location || trashTypes.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 'confirm' && (
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h4 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Confirm Report
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Review your report before submitting
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Before Photo
                    </h5>
                    <img src={beforePhoto!} alt="Before" className="w-full h-32 object-cover rounded-lg" />
                  </div>
                  {afterPhoto && (
                    <div>
                      <h5 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        After Photo
                      </h5>
                      <img src={afterPhoto} alt="After" className="w-full h-32 object-cover rounded-lg" />
                    </div>
                  )}
                </div>

                <div>
                  <h5 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Trash Types
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {trashTypes.map((type) => {
                      const category = trashCategories.find(c => c.id === type);
                      return (
                        <span key={type} className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs rounded">
                          {category?.icon} {category?.name}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className={`font-medium ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>
                      You'll earn {afterPhoto ? 20 : 10} Green Karma points!
                    </span>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                    {afterPhoto 
                      ? 'Great job cleaning up! You get bonus points for the cleanup photo.'
                      : 'Thanks for reporting! You can earn more points by cleaning up and uploading an after photo.'
                    }
                  </p>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep('details')}
                  className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Submit Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;
