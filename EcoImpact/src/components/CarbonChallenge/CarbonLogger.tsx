import React, { useState, useEffect, useContext } from 'react';
import { X, Car, Home, Utensils, Trash2, Plus } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface CarbonLoggerProps {
  onClose: () => void;
}

const CarbonLogger: React.FC<CarbonLoggerProps> = ({ onClose }) => {
  // Pull the logged‑in user from Zustand
  const { user, isDarkMode, addCarbonLog, setCarbonLogs } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [action, setAction] = useState('');
  const [customAction, setCustomAction] = useState('');
  const [co2Saved, setCo2Saved] = useState('');

  /* ----------------------------- Preset data ----------------------------- */
  const categories = [
    {
      id: 'transport',
      name: 'Transport',
      icon: <Car className="h-6 w-6" />,
      color: 'blue',
      actions: [
        { name: 'Cycled to work', co2: 2.5 },
        { name: 'Used public transport', co2: 1.8 },
        { name: 'Walked instead of driving', co2: 3.2 },
        { name: 'Carpooled', co2: 1.5 },
        { name: 'Worked from home', co2: 4.0 },
      ],
    },
    {
      id: 'energy',
      name: 'Energy',
      icon: <Home className="h-6 w-6" />,
      color: 'green',
      actions: [
        { name: 'Turned off lights', co2: 0.8 },
        { name: 'Used LED bulbs', co2: 1.2 },
        { name: 'Unplugged devices', co2: 0.5 },
        { name: 'Used natural light', co2: 0.6 },
        { name: 'Adjusted thermostat', co2: 2.1 },
      ],
    },
    {
      id: 'food',
      name: 'Food',
      icon: <Utensils className="h-6 w-6" />,
      color: 'orange',
      actions: [
        { name: 'Ate vegetarian meal', co2: 1.5 },
        { name: 'Bought local produce', co2: 0.8 },
        { name: 'Reduced food waste', co2: 1.2 },
        { name: 'Composted organic waste', co2: 0.9 },
        { name: 'Grew own herbs', co2: 0.3 },
      ],
    },
    {
      id: 'waste',
      name: 'Waste',
      icon: <Trash2 className="h-6 w-6" />,
      color: 'purple',
      actions: [
        { name: 'Used reusable bag', co2: 0.3 },
        { name: 'Recycled properly', co2: 0.7 },
        { name: 'Repaired instead of buying', co2: 2.5 },
        { name: 'Donated old items', co2: 1.1 },
        { name: 'Bought second‑hand', co2: 3.2 },
      ],
    },
  ];

  const selectedCategoryData = categories.find((cat) => cat.id === selectedCategory);
  const selectedActionData   = selectedCategoryData?.actions.find((a) => a.name === action);

  useEffect(() => {
    if (user?.username) {
      fetch(`http://localhost:5000/api/carbon-log/${user.username}`)
      .then((res) => res.json())
      .then((data) => setCarbonLogs(data.logs)) // use data.logs
      .catch((err) => console.error('Failed to fetch logs:', err));
    }
  }, [user?.username]);


  /* ------------------------------ Handlers ------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.username) return; // sanity check
    if (!selectedCategory || (!action && !customAction)) return;

    const finalAction = action || customAction;
    const finalCo2 = (selectedActionData?.co2 ?? parseFloat(co2Saved)) || 0;
    const points      = Math.round(finalCo2 * 10);

    // Payload matches your updated schema (uses username)
    const newLog = {
      username: user.username,
      action: finalAction,
      category: selectedCategory,      // 'transport' | 'energy' | ...
      co2Saved: finalCo2,
      points,
      date: new Date(),
      description: action === 'custom' ? customAction : undefined,
    };

    try {
      const res = await fetch('http://localhost:5000/api/carbon-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog),
      });

      if (res.ok) {
        const { log } = await res.json();
        addCarbonLog(log);             // update Zustand
        onClose();
      } else {
        console.error('Failed to save carbon log');
      }
    } catch (err) {
      console.error('Error saving carbon log:', err);
    }
  };

  /* ------------------------------- UI ------------------------------- */
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto`}>
    {/* Header */}
    <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Log Carbon Action</h3>
    <button
    onClick={onClose}
    className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}
    >
    <X className="h-5 w-5" />
    </button>
    </div>

    {/* Form */}
    <form onSubmit={handleSubmit} className="p-6">
    {/* Category Selection */}
    <div className="mb-6">
    <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
    Select Category
    </label>
    <div className="grid grid-cols-2 gap-3">
    {categories.map((cat) => (
      <button
      key={cat.id}
      type="button"
      onClick={() => {
        setSelectedCategory(cat.id);
        setAction('');
        setCustomAction('');
      }}
      className={`p-3 rounded-lg border-2 transition-all ${
        selectedCategory === cat.id
        ? `border-${cat.color}-500 bg-${cat.color}-50 dark:bg-${cat.color}-900/20`
        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
      }`}
      >
      <div className={`text-${cat.color}-600 mb-2`}>{cat.icon}</div>
      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
      {cat.name}
      </span>
      </button>
    ))}
    </div>
    </div>

    {/* Action Selection */}
    {selectedCategory && (
      <div className="mb-6">
      <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
      Select Action
      </label>
      <div className="space-y-2">
      {selectedCategoryData?.actions.map((item) => (
        <button
        key={item.name}
        type="button"
        onClick={() => {
          setAction(item.name);
          setCustomAction('');
        }}
        className={`w-full p-3 text-left rounded-lg border transition-all ${
          action === item.name
          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
        }`}
        >
        <div className="flex justify-between items-center">
        <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.name}</span>
        <span className="text-sm text-green-600 font-medium">{item.co2}kg CO₂</span>
        </div>
        </button>
      ))}

      {/* Custom Action */}
      <button
      type="button"
      onClick={() => {
        setAction('custom');
        setCustomAction('');
      }}
      className={`w-full p-3 text-left rounded-lg border transition-all ${
        action === 'custom'
        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
      }`}
      >
      <div className="flex items-center">
      <Plus className="h-5 w-5 text-green-600 mr-2" />
      <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Custom Action</span>
      </div>
      </button>
      </div>
      </div>
    )}

    {/* Custom Action Inputs */}
    {action === 'custom' && (
      <>
      <div className="mb-6">
      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
      Describe Your Action
      </label>
      <input
      type="text"
      value={customAction}
      onChange={(e) => setCustomAction(e.target.value)}
      placeholder="e.g., Used bamboo straws instead of plastic"
      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
        isDarkMode
        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
      }`}
      required
      />
      </div>

      <div className="mb-6">
      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
      Estimated CO₂ Saved (kg)
      </label>
      <input
      type="number"
      step="0.1"
      min="0"
      value={co2Saved}
      onChange={(e) => setCo2Saved(e.target.value)}
      placeholder="0.0"
      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
        isDarkMode
        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
      }`}
      required
      />
      </div>
      </>
    )}

    {/* Buttons */}
    <div className="flex space-x-3">
    <button
    type="button"
    onClick={onClose}
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
    disabled={!selectedCategory || (!action && !customAction)}
    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
    Log Action
    </button>
    </div>
    </form>
    </div>
    </div>
  );
};

export default CarbonLogger;
