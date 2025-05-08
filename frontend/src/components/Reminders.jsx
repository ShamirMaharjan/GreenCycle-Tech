import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const ReminderCard = ({ date, location }) => {
  const parsedDate = new Date(date);

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="font-medium text-lg">
        {format(parsedDate, 'EEEE, d MMMM yyyy')}
      </div>
      <div className="text-gray-600 mt-1">
        <span className="font-semibold">Location:</span> {location}
      </div>
    </div>
  );
};

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReminders = async () => {
      // Check for token in multiple possible locations
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');

      if (!token) {
        setError('Authentication required. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/api/collections/remainders', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include' // Important for cookies if using them
        });

        // Handle unauthorized (401) specifically
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('token');
          throw new Error('Session expired. Please login again.');
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // More robust data validation
        if (!data || !data.success) {
          throw new Error(data.message || 'Invalid response format');
        }

        if (Array.isArray(data.data)) {
          // Sort reminders by date and slice to get only the first two
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

    fetchReminders();
  }, [navigate]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    useEffect(() => { }, []); // This will re-run the effect
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
              date={reminder.date}
              location={reminder.location}
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
    </div>
  );
};

export default Reminders;
