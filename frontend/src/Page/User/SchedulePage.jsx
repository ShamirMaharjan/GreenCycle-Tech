import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Calendar2 from '@/components/Calender2';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';

const Schedule = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [reminders, setReminders] = useState([]);
    const [showDayView, setShowDayView] = useState(false);
    const [isPaymentComplete, setIsPaymentComplete] = useState(false);
    const [isCheckingPayment, setIsCheckingPayment] = useState(true);

    // Fetch reminders from backend
    useEffect(() => {
        const fetchReminders = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/scheduled-collection/reminders', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                
                const data = await res.json();
                
                if (Array.isArray(data)) {
                    setReminders(data);
                } else {
                    console.error("Reminders are not an array", data);
                    setReminders([]);
                }
            } catch (err) {
                console.error('Error fetching reminders:', err);
                setReminders([]);
            }
        };

        fetchReminders();
    }, []);

    useEffect(() => {
        let retries = 0;
        const checkPaymentStatus = async () => {
            try {
                const response = await axios.get('http://localhost:3000/payment-status');
                if (response.data.status === 'COMPLETE') {
                    setIsPaymentComplete(true);
                    setIsCheckingPayment(false);
                } else if (retries < 3) {
                    retries++;
                    setTimeout(checkPaymentStatus, 1000); // 1 second wait
                } else {
                    setIsPaymentComplete(false);
                    setIsCheckingPayment(false);
                }
            } catch (error) {
                setIsPaymentComplete(false);
                setIsCheckingPayment(false);
            }
        };
        checkPaymentStatus();
    }, []);

    const handleDateSelect = (date) => {
        setSelectedDate(date);

        const hasBooking = reminders.some(reminder => {
            const reminderDate = new Date(reminder.date);
            return reminderDate.toDateString() === date.toDateString();
        });

        setShowDayView(hasBooking);
    };

    const handleBackToMonth = () => {
        setShowDayView(false);
    };

    const events = reminders.map(reminder => ({
        date: new Date(reminder.date),
        label: 'Booked'
    }));

    const dayReminders = reminders.filter(reminder =>
        new Date(reminder.date).toDateString() === selectedDate.toDateString()
    );

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
                        <div className="text-lg font-semibold">
                            {format(selectedDate, 'dd MMMM')}
                        </div>
                    </div>

                    {!showDayView ? (
                        <div className="mb-6">
                            <Calendar2
                                selectedDate={selectedDate}
                                onSelectDate={handleDateSelect}
                                events={events}
                            />
                        </div>
                    ) : (
                        <div className="border rounded-lg overflow-hidden">
                            <div className="p-4 font-bold text-center bg-gray-100">
                                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                            </div>

                            <div className="p-4 space-y-4">
                                {dayReminders.map((reminder, index) => (
                                    <div
                                        key={index}
                                        className="bg-yellow-100 p-3 rounded"
                                    >
                                        <h3 className="font-semibold">Booked Collection</h3>
                                        <p className="text-sm">Time: {reminder.time || 'Not specified'}</p>
                                        <p className="text-sm">Location: {reminder.location}</p>
                                    </div>
                                ))}

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
