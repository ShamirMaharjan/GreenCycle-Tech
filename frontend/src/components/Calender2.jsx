import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar2 = ({
    onSelectDate,
    selectedDate: propSelectedDate,
    events = []
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(propSelectedDate || new Date());

    // React to prop changes
    React.useEffect(() => {
        if (propSelectedDate) {
            setSelectedDate(propSelectedDate);
        }
    }, [propSelectedDate]);

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        if (onSelectDate) {
            onSelectDate(date);
        }
    };

    const handlePreviousMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
    };

    // Generate days for the current month view
    const getDaysInMonth = () => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        const dateRange = eachDayOfInterval({ start: monthStart, end: monthEnd });

        // Get the day of week for the first day (0-6, where 0 is Sunday)
        const startDay = monthStart.getDay();

        // Create empty slots before the first day of the month
        const emptyBefore = Array(startDay).fill(null);

        // Combine empty slots and actual dates
        return [...emptyBefore, ...dateRange];
    };

    // Check if a day has events
    const hasEvent = (day) => {
        if (!day) return false;
        return events.some(event => isSameDay(event.date, day));
    };

    // Get event label for a day
    const getEventLabel = (day) => {
        if (!day) return '';
        const event = events.find(event => isSameDay(event.date, day));
        return event ? event.label : '';
    };

    // Generate weeks for the calendar grid
    const getCalendarWeeks = () => {
        const allDays = getDaysInMonth();
        const weeks = [];

        for (let i = 0; i < allDays.length; i += 7) {
            weeks.push(allDays.slice(i, i + 7));
        }

        return weeks;
    };

    const weeks = getCalendarWeeks();

    return (
        <div className="bg-white rounded-lg shadow p-4 w-full">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={handlePreviousMonth}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
                <h2 className="text-xl font-bold">
                    {format(currentDate, 'MMMM yyyy')}
                </h2>
                <button
                    onClick={handleNextMonth}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            <div className="border rounded-lg overflow-hidden">
                {/* Day headers */}
                <div className="grid grid-cols-7 bg-gray-50">
                    {DAYS_OF_WEEK.map((day) => (
                        <div key={day} className="p-4 text-center font-semibold border-b">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="grid grid-cols-7">
                        {week.map((day, dayIndex) => {
                            const isCurrentDay = day ? isToday(day) : false;
                            const isSelected = day && selectedDate ? isSameDay(day, selectedDate) : false;
                            const isCurrentMonth = day ? isSameMonth(day, currentDate) : false;
                            const hasEventForDay = hasEvent(day);

                            return (
                                <div
                                    key={dayIndex}
                                    className={`
                    min-h-[120px] p-2 border relative
                    ${!day ? 'bg-gray-50' : ''}
                    ${!isCurrentMonth ? 'text-gray-400' : ''}
                    ${isCurrentDay ? 'ring-2 ring-inset ring-green-500' : ''}
                    ${isSelected ? 'bg-green-50' : ''}
                    ${hasEventForDay ? 'cursor-pointer' : ''}
                  `}
                                    onClick={() => day && handleDateSelect(day)}
                                >
                                    {day && (
                                        <>
                                            <div className={`
                        font-bold text-right
                        ${isCurrentDay ? 'text-green-600' : ''}
                      `}>
                                                {format(day, 'd')}
                                            </div>

                                            {hasEventForDay && (
                                                <div className="mt-2 p-2 bg-yellow-100 rounded text-sm">
                                                    {getEventLabel(day)}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar2;