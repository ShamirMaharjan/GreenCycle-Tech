import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const ReminderCard = ({ date, location, onDelete, id, onClick, hasCollector, status }) => {
  const parsedDate = new Date(date);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'not arrived':
        return 'bg-yellow-100 text-yellow-800';
      case 'on the way':
        return 'bg-blue-100 text-blue-800';
      case 'picked up':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className="border border-gray-200 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow relative cursor-pointer"
      onClick={() => onClick(id)}
    >
      {hasCollector ? (
        <div className="absolute top-2 right-2 px-3 py-1 text-sm font-medium text-gray-500 bg-gray-100 rounded-md">
          Collector Assigned
        </div>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="absolute top-2 right-2 px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
          title="Cancel Schedule"
        >
          Cancel Schedule
        </button>
      )}
      <div className="font-medium text-lg">
        {format(parsedDate, 'EEEE, d MMMM yyyy')}
      </div>
      <div className="text-gray-600 mt-1">
        <span className="font-semibold">Location:</span> {location}
      </div>
      {status && (
        <div className="mt-2">
          <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(status)}`}>
            {status}
          </span>
        </div>
      )}
    </div>
  );
};

const ScheduleDetailsModal = ({ isOpen, onClose, schedule }) => {
  if (!isOpen || !schedule) return null;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'not arrived':
        return 'bg-yellow-100 text-yellow-800';
      case 'on the way':
        return 'bg-blue-100 text-blue-800';
      case 'picked up':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Schedule Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-700">Date & Time</h3>
              <p className="text-gray-600">{format(new Date(schedule.date), 'EEEE, d MMMM yyyy')}</p>
              {schedule.estimatedTime && (
                <p className="text-gray-600">Estimated Time: {schedule.estimatedTime}</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Status</h3>
              <p className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(schedule.status)}`}>
                {schedule.status}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700">Location</h3>
            <p className="text-gray-600">{schedule.location}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700">Description</h3>
            <p className="text-gray-600">{schedule.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* <div>
              <h3 className="font-semibold text-gray-700">Waste Type</h3>
              <p className="text-gray-600">{schedule.wasteType}</p>
            </div> */}
            {/* <div>
              <h3 className="font-semibold text-gray-700">Priority</h3>
              <p className={`inline-block px-3 py-1 rounded-full text-sm ${
                schedule.priority === 'High' ? 'bg-red-100 text-red-800' :
                schedule.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {schedule.priority}
              </p>
            </div> */}
          </div>

          {schedule.notes && (
            <div>
              <h3 className="font-semibold text-gray-700">Additional Notes</h3>
              <p className="text-gray-600">{schedule.notes}</p>
            </div>
          )}

          {schedule.collectorId && (
            <div>
              <h3 className="font-semibold text-gray-700">Assigned Collector</h3>
              <p className="text-gray-600">{schedule.collectorName || 'Collector assigned'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const navigate = useNavigate();

  const fetchReminders = async () => {
    // Check for token in multiple possible locations
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');

    if (!token) {
      setError('Authentication required. Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/scheduled-collection/reminders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data || !data.success) {
        throw new Error(data.message || 'Invalid response format');
      }

      if (Array.isArray(data.data)) {
        const sortedReminders = data.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setReminders(sortedReminders.slice(0, 2));
      } else {
        throw new Error('Unexpected data format');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      if (err.message.includes('expired') || err.message.includes('invalid')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [navigate]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    setDeleteError(null);

    try {
      const response = await fetch(`http://localhost:3000/api/scheduled-collection/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.status === 400) {
        const data = await response.json();
        throw new Error(data.message || 'Cannot delete schedule with assigned collector');
      }

      if (!response.ok) {
        throw new Error('Failed to delete reminder');
      }

      // Remove the deleted reminder from state
      setReminders(reminders.filter(reminder => reminder._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      setDeleteError(err.message);
    }
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    fetchReminders();
  };

  const handleScheduleClick = (id) => {
    const schedule = reminders.find(reminder => reminder._id === id);
    if (schedule) {
      setSelectedSchedule(schedule);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Reminders</h2>
        {reminders.length > 0 && (
          <span className="text-sm text-gray-500">
            {reminders.length} upcoming reminder{reminders.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {deleteError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{deleteError}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
                {error.includes('expired') && (
                  <button
                    onClick={() => navigate('/login')}
                    className="ml-2 text-sm font-medium text-red-600 hover:text-red-500"
                  >
                    Go to Login
                  </button>
                )}
                {!error.includes('expired') && (
                  <button
                    onClick={handleRetry}
                    className="ml-2 text-sm font-medium text-red-600 hover:text-red-500"
                  >
                    Try again
                  </button>
                )}
              </p>
            </div>
          </div>
        </div>
      ) : reminders.length > 0 ? (
        <div className="space-y-4">
          {reminders.map((reminder) => (
            <ReminderCard
              key={reminder._id}
              id={reminder._id}
              date={reminder.date}
              location={reminder.location}
              onDelete={handleDelete}
              onClick={handleScheduleClick}
              hasCollector={!!reminder.collectorId}
              status={reminder.status}
            />
          ))}
        </div>
      ) : (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                No reminders scheduled. Add one to get started!
              </p>
            </div>
          </div>
        </div>
      )}

      <ScheduleDetailsModal
        isOpen={!!selectedSchedule}
        onClose={() => setSelectedSchedule(null)}
        schedule={selectedSchedule}
      />
    </div>
  );
};

export default Reminders;
