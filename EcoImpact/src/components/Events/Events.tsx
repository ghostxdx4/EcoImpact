import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Plus, Filter } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { format } from 'date-fns';
import axios from 'axios';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
  attendees: number;
  maxAttendees: number;
  type: string;
  isAttending?: boolean;
  image?: string;
  impact?: string;
}

const Events: React.FC = () => {
  const { isDarkMode } = useStore();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'cleanup',
    maxAttendees: 0
  });

  // Fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/events');
      setEvents(res.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const eventDateTime = new Date(`${formData.date}T${formData.time}`);
    try {
      await axios.post('http://localhost:5000/api/events', {
        ...formData,
        date: eventDateTime.toISOString(),
                       attendees: 0,
                       organizer: 'Your Organizer Name',
                       image: 'https://via.placeholder.com/400'
      });
      setShowCreateEvent(false);
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        type: 'cleanup',
        maxAttendees: 0
      });
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      cleanup: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      workshop: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      challenge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'cleanup':
        return '🧹';
      case 'workshop':
        return '📚';
      case 'challenge':
        return '🏆';
      default:
        return '📅';
    }
  };

  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date());
  const pastEvents = events.filter(e => new Date(e.date) < new Date());
  const eventsToShow = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    {/* Header */}
    <div className="flex justify-between items-center mb-8">
    <div>
    <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
    Community Events
    </h1>
    <p className={`mt-2 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
    Join eco-friendly events and challenges in your area
    </p>
    </div>
    <button
    onClick={() => setShowCreateEvent(true)}
    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
    >
    <Plus className="h-5 w-5" />
    <span>Create Event</span>
    </button>
    </div>

    {/* Tabs */}
    <div className="flex space-x-1 mb-8">
    <button
    onClick={() => setActiveTab('upcoming')}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
      activeTab === 'upcoming'
      ? 'bg-green-600 text-white'
      : isDarkMode
      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
      : 'bg-white text-gray-600 hover:bg-gray-100'
    }`}
    >
    <Calendar className="h-5 w-5" />
    <span>Upcoming Events</span>
    </button>
    <button
    onClick={() => setActiveTab('past')}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
      activeTab === 'past'
      ? 'bg-green-600 text-white'
      : isDarkMode
      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
      : 'bg-white text-gray-600 hover:bg-gray-100'
    }`}
    >
    <Filter className="h-5 w-5" />
    <span>Past Events</span>
    </button>
    </div>

    {/* Events Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {eventsToShow.map((event) => (
      <div
      key={event._id}
      className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow`}
      >
      <div className="relative">
      <img
      src={event.image || 'https://via.placeholder.com/400'}
      alt={event.title}
      className="w-full h-48 object-cover"
      />
      <div className="absolute top-4 left-4">
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getEventTypeColor(event.type)}`}>
      {getEventTypeIcon(event.type)} {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
      </span>
      </div>
      </div>

      <div className="p-6">
      <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      {event.title}
      </h3>
      <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
      {event.description}
      </p>

      <div className="space-y-2 mb-4">
      <div className="flex items-center space-x-2 text-sm text-gray-500">
      <Calendar className="h-4 w-4" />
      <span>{format(new Date(event.date), 'MMM d, yyyy • h:mm a')}</span>
      </div>
      <div className="flex items-center space-x-2 text-sm text-gray-500">
      <MapPin className="h-4 w-4" />
      <span>{event.location}</span>
      </div>
      <div className="flex items-center space-x-2 text-sm text-gray-500">
      <Users className="h-4 w-4" />
      <span>{event.attendees}/{event.maxAttendees} attending</span>
      </div>
      </div>

      {activeTab === 'past' && event.impact && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <h4 className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>
        Impact Achieved
        </h4>
        <p className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
        {event.impact}
        </p>
        </div>
      )}
      </div>
      </div>
    ))}
    </div>

    {/* Create Event Modal */}
    {showCreateEvent && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto`}>
      <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      Create New Event
      </h3>
      <button
      onClick={() => setShowCreateEvent(false)}
      className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}
      >
      ×
      </button>
      </div>
      <form onSubmit={handleCreateEvent} className="p-6">
      <div className="space-y-4">
      <input
      type="text"
      name="title"
      value={formData.title}
      onChange={handleInputChange}
      placeholder="Event Title"
      required
      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
      }`}
      />
      <textarea
      name="description"
      value={formData.description}
      onChange={handleInputChange}
      placeholder="Description"
      rows={3}
      required
      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
      }`}
      ></textarea>
      <input
      type="date"
      name="date"
      value={formData.date}
      onChange={handleInputChange}
      required
      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
      }`}
      />
      <input
      type="time"
      name="time"
      value={formData.time}
      onChange={handleInputChange}
      required
      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
      }`}
      />
      <input
      type="text"
      name="location"
      value={formData.location}
      onChange={handleInputChange}
      placeholder="Location"
      required
      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
      }`}
      />
      <select
      name="type"
      value={formData.type}
      onChange={handleInputChange}
      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
      }`}
      >
      <option value="cleanup">Cleanup</option>
      <option value="workshop">Workshop</option>
      <option value="challenge">Challenge</option>
      <option value="other">Other</option>
      </select>
      <input
      type="number"
      name="maxAttendees"
      value={formData.maxAttendees}
      onChange={handleInputChange}
      placeholder="Max Attendees"
      required
      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
      }`}
      />
      </div>
      <div className="flex space-x-3 mt-6">
      <button
      type="button"
      onClick={() => setShowCreateEvent(false)}
      className={`flex-1 px-4 py-2 border rounded-lg font-medium transition-colors ${
        isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
      }`}
      >
      Cancel
      </button>
      <button
      type="submit"
      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
      >
      Create Event
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

export default Events;
