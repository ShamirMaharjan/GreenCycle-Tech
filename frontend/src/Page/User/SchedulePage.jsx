import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header";

import Sidebar from '../../components/Sidebar';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const SchedulePage = () => {
    const navigate = useNavigate();
    const [currentMonth, setCurrentMonth] = useState('January');
    const [currentDate, setCurrentDate] = useState('30 September');

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getDaysInMonth = () => {
        // Generate calendar data for January
        const calendarData = [
            [1, 2, 3, 4, 5, 6, 7],
            [8, 9, 10, 11, 12, 13, 14],
            [15, 16, 17, 18, 19, 20, 21],
            [22, 23, 24, 25, 26, 27, 28],
            [29, 30, 31, null, null, null, null]
        ];

        return calendarData;
    };

    const handlePrevMonth = () => {
        // In a real app, this would change the month
        console.log("Go to previous month");
    };

    const handleNextMonth = () => {
        // In a real app, this would change the month
        console.log("Go to next month");
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Header />

                <div className="p-6 bg-white m-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <button
                            className="flex items-center gap-2 bg-white rounded-full py-2 px-4 shadow-sm"
                            onClick={() => navigate('/schedule/new')}
                        >
                            <span>Schedule Collection</span>
                            <span className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-lg">
                                <Plus size={16} />
                            </span>
                        </button>
                        <div className="text-lg font-semibold">{currentDate}</div>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                        <button onClick={handlePrevMonth} className="bg-white rounded-full p-2 shadow-sm">
                            <ChevronLeft size={24} />
                        </button>
                        <h2 className="text-xl font-bold">{currentMonth}</h2>
                        <button onClick={handleNextMonth} className="bg-white rounded-full p-2 shadow-sm">
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                        <div className="grid grid-cols-7">
                            {days.map((day) => (
                                <div key={day} className="p-4 text-center font-semibold">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {getDaysInMonth().map((week, weekIndex) => (
                            <div key={weekIndex} className="grid grid-cols-7 border-t">
                                {week.map((day, dayIndex) => (
                                    <div
                                        key={dayIndex}
                                        className={`p-4 border-r last:border-r-0 min-h-[100px] ${day === 11 ? 'bg-yellow-100' : ''} ${day === null ? 'bg-gray-50' : ''}`}
                                    >
                                        {day !== null && (
                                            <>
                                                <div className="font-bold">{day}</div>
                                                {day === 11 && <div className="mt-2 text-sm">Booked</div>}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchedulePage;