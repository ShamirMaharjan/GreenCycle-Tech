import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Calendar from '../../components/Calendar';
import Calendar2 from '@/components/Calender2';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';

const Schedule = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDayView, setShowDayView] = useState(false);

    // Example calendar events with actual Date objects
    const calendarEvents = [
        { date: new Date(2025, 4, 11), label: 'Booked' }, // May 11th, 2025
    ];

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        // Show day view if the selected date has bookings
        const hasBooking = calendarEvents.some(event =>
            event.date.getDate() === date.getDate() &&
            event.date.getMonth() === date.getMonth() &&
            event.date.getFullYear() === date.getFullYear()
        );

        setShowDayView(hasBooking);
    };

    const handleBackToMonth = () => {
        setShowDayView(false);
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
                        <div className="text-lg font-semibold">{format(selectedDate, 'dd MMMM')}</div>
                    </div>

                    {!showDayView ? (
                        <div className="mb-6">
                            <Calendar2
                                selectedDate={selectedDate}
                                onSelectDate={handleDateSelect}
                                events={calendarEvents}
                            />
                        </div>
                    ) : (
                        <div className="border rounded-lg overflow-hidden">
                            <div className="p-4 font-bold text-center bg-gray-100">
                                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                            </div>

                            <div className="p-4">
                                <div className="bg-yellow-100 p-3 rounded mb-4">
                                    <h3 className="font-semibold">Booked Collection</h3>
                                    <p className="text-sm">Time: 10:00 AM</p>
                                    <p className="text-sm">Location: Kalanki, Kathmandu</p>
                                </div>

                                <button
                                    className="bg-white border border-gray-300 rounded-full px-4 py-1 text-sm"
                                    onClick={handleBackToMonth}
                                >
                                    Back to Month View
                                </button>
                            </div>
                        </div>
                    )}


                </div>
            </div>
        </div>
    );
};

export default Schedule;