import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header";
import Sidebar from '../../components/Sidebar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, Calendar, MapPin, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';
import FormCalendar from '@/components/FormCalendar';
import { format } from 'date-fns';

const ScheduleAfterPayment = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please login to schedule a collection.");
            navigate('/login');
        }
    }, []);

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setShowCalendar(false);
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/scheduled-collection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    date: selectedDate.toISOString(),
                    location,
                    description
                })
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('Collection scheduled successfully!', {
                    duration: 3000,
                    position: 'top-right',
                    style: {
                        background: '#34D399',
                        color: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }
                });
                navigate('/schedule');
            } else {
                toast.error(result.message || "Failed to schedule collection.", {
                    duration: 3000,
                    position: 'top-right',
                    style: {
                        background: '#F87171',
                        color: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }
                });
            }
        } catch (error) {
            toast.error(error.message || "Something went wrong.", {
                duration: 3000,
                position: 'top-right',
                style: {
                    background: '#F87171',
                    color: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-green-100">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="rounded-3xl bg-white shadow-xl max-w-4xl w-full p-10">
                        <div className="flex items-center mb-10">
                            <button onClick={() => navigate('/schedule')} className="p-2 bg-green-100 rounded-full hover:bg-green-200 transition-colors">
                                <ChevronLeft size={28} className="text-green-600" />
                            </button>
                            <h1 className="text-4xl font-semibold ml-4 text-green-800">Schedule Collection</h1>
                        </div>

                        <div className="space-y-8">
                            {/* Date Selection */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <Calendar className="text-green-500" size={22} />
                                </div>
                                <input
                                    type="text"
                                    readOnly
                                    value={format(selectedDate, 'dd MMMM yyyy')}
                                    onClick={() => setShowCalendar(!showCalendar)}
                                    className="text-lg w-full pl-12 pr-4 py-4 border border-green-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-300 transition-shadow"
                                    placeholder="Select Collection Date"
                                />
                                {showCalendar && (
                                    <div className="absolute z-10 mt-2 w-full">
                                        <FormCalendar
                                            selectedDate={selectedDate}
                                            onSelectDate={handleDateSelect}
                                            className="border border-green-200 rounded-xl shadow-lg"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Location Input */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <MapPin className="text-green-500" size={22} />
                                </div>
                                <input
                                    type="text"
                                    className="text-lg w-full pl-12 pr-4 py-4 border border-green-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-300 transition-shadow"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Enter collection location"
                                />
                            </div>

                            {/* Description Input */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <Info className="text-green-500" size={22} />
                                </div>
                                <Textarea
                                    className="text-lg w-full pl-12 pr-4 py-4 border border-green-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-300 transition-shadow resize-none"
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe the waste to be collected..."
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <Button
                                    onClick={handleSubmit}
                                    className="text-lg font-medium bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-10 py-4 rounded-2xl shadow-xl transition-all transform hover:scale-105"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0012 20c4.411 0 8-3.589 8-8 0-1.034-.213-2.024-.592-2.909C18.213 9.024 16.034 8 12 8c-4.411 0-8 3.589-8 8 0 1.034.213 2.024.592 2.909z"></path>
                                        </svg>
                                    ) : 'Schedule Collection'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleAfterPayment;
