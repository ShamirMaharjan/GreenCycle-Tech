import React from 'react';

const ReminderCard = ({ date, location }) => {
    return (
        <div className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="font-medium">{date}</div>
            <div className="text-gray-700">Location: {location}</div>
        </div>
    );
};

const Reminders = () => {
    const reminders = [
        { date: '17 March', location: 'Naxal' },
        { date: '17 March', location: 'Naxal' }
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