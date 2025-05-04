import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header";

import Sidebar from '../../components/Sidebar';
import Calendar from '../../components/Calendar'; // Fixed import statement
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft } from 'lucide-react';

const CollectionForm = () => {
    const navigate = useNavigate();
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = () => {
        // Here you would handle form submission
        console.log({ date, location, description });
        // Navigate back to schedule page after submission
        navigate('/schedule');
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Header />

                <div className="p-6 bg-white m-6 rounded-lg shadow-sm flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                        <div className="flex items-center mb-6">
                            <button
                                onClick={() => navigate('/schedule')}
                                className="mr-4"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <h1 className="text-2xl font-bold">Schedule Collection</h1>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Date</label>
                            <input
                                type="text"
                                placeholder="DD/MM/YYYY"
                                className="w-full p-2 border border-gray-300 rounded"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Location</label>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Description</label>
                            <Textarea
                                placeholder="Text area for additional notes (e.g., 'Heavy items need assistance')"
                                className="min-h-[120px]"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="mb-6">
                            <h2 className="text-sm font-medium mb-2">Payment</h2>
                            <p className="mb-2 text-sm">You are required to pay Rs.100 for waste collection services</p>
                            <div className="flex gap-4">
                                <div className="w-16 h-16 bg-gray-200 rounded"></div>
                                <div className="w-16 h-16 bg-gray-200 rounded"></div>
                                <div className="w-16 h-16 bg-gray-200 rounded"></div>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <Button
                                className="bg-green-500 hover:bg-green-600 text-white px-8"
                                onClick={handleSubmit}
                            >
                                ADD
                            </Button>
                        </div>
                    </div>

                    <div className="w-full lg:w-72">
                        <Calendar />

                        <div className="mt-6">
                            <h2 className="text-xl font-bold mb-4">Reminders</h2>
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="border border-gray-200 rounded-lg p-4 mb-4">
                                    <div className="font-medium">17 March</div>
                                    <div className="text-gray-700">Location: Naval</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollectionForm;