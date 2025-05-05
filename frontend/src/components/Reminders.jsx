import React from 'react';
import { format } from 'date-fns';

const ReminderCard = ({ date, location }) => {
    return (
        <div className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="font-medium">{format(date, 'd MMMM')}</div>
            <div className="text-gray-700">Location: {location}</div>
        </div>
    );
};

const Reminders = () => {
    // Example data with actual Date objects
    const reminders = [
        { date: new Date(2025, 2, 17), location: 'Naxal' }, // March 17
        { date: new Date(2025, 2, 17), location: 'Naxal' }  // March 17
    ];

    return (
        <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Reminders</h2>
            {reminders.map((reminder, index) => (
                <ReminderCard
                    key={index}
                    date={reminder.date}
                    location={reminder.location}
                />
            ))}
        </div>
    );
};

export default Reminders;