import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header";
import Sidebar from '../../components/Sidebar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import FormCalendar from '@/components/FormCalendar';
import { format } from 'date-fns';

const ScheduleAfterPayment = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);

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
                });
                navigate('/schedule');
            } else {
                toast.error(result.message || "Failed to schedule collection.", {
                    duration: 3000,
                    position: 'top-right',
                });
            }
        } catch (error) {
            toast.error(error.message || "Something went wrong.", {
                duration: 3000,
                position: 'top-right',
            });
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <div className="p-6 bg-white m-6 rounded-lg shadow-sm max-w-2xl mx-auto">
                    <div className="flex items-center mb-6">
                        <button onClick={() => navigate('/schedule')} className="mr-4">
                            <ChevronLeft size={24} />
                        </button>
                        <h1 className="text-2xl font-bold">Schedule Collection</h1>
                    </div>

                    <div className="space-y-6">
                        {/* Date Selection */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Date</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    readOnly
                                    value={format(selectedDate, 'dd/MM/yyyy')}
                                    onClick={() => setShowCalendar(!showCalendar)}
                                    className="w-full p-2 border border-gray-300 rounded cursor-pointer"
                                    placeholder="Select Date"
                                />
                                {showCalendar && (
                                    <div className="absolute z-10 mt-1">
                                        <FormCalendar
                                            selectedDate={selectedDate}
                                            onSelectDate={handleDateSelect}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Location</label>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Enter collection location"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Description</label>
                            <Textarea
                                className="w-full p-2 border border-gray-300 rounded"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the waste to be collected"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <Button
                                onClick={handleSubmit}
                                className="bg-green-500 hover:bg-green-600 text-white px-8"
                            >
                                ADD
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleAfterPayment;
