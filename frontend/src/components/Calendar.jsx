import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date(2024, 0)); // January 2024 as seen in the design

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    const handlePreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const renderCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDayOfMonth = getFirstDayOfMonth(year, month);

        const days = [];

        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(
                <div
                    key={day}
                    className={`w-8 h-8 flex items-center justify-center rounded-full 
          ${day === 17 ? 'bg-green-500 text-white' : 'hover:bg-gray-100 cursor-pointer'}`}
                >
                    {day}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 w-full">
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePreviousMonth} className="p-1 rounded-full bg-gray-100">
                    <ChevronLeft size={16} />
                </button>
                <h2 className="font-medium">
                    {MONTHS[currentDate.getMonth()]}, {currentDate.getFullYear()}
                </h2>
                <button onClick={handleNextMonth} className="p-1 rounded-full bg-gray-100">
                    <ChevronRight size={16} />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {DAYS_OF_WEEK.map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500">
                        {day}
                    </div>
                ))}

                {/* Calendar days */}
                {renderCalendarDays()}
            </div>
        </div>
    );
};

export default Calendar;