import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header";
import Sidebar from '../../components/Sidebar';
import Calendar from '../../components/Calendar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

const CollectionForm = () => {
    const navigate = useNavigate();
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [reminders, setReminders] = useState([]);
    const [successMessage, setSuccessMessage] = useState(''); // State for success message

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please login to schedule a collection.");
            navigate('/login');
        }
    }, []);



    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log("Frontend Token (handleSubmit):", token);

            const response = await fetch('http://localhost:3000/api/collections', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ date, location, description })
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Collection scheduled:', result);
                // Set success message
                toast.success('Collection scheduled successfully!', {
                    duration: 3000,
                    position: 'top-right',
                });
                // Reset form fields
                setDate('');
                setLocation('');
                setDescription('');
                // Optionally, refresh reminders
                // fetchReminders();
            } else {
                console.error('Failed to schedule collection:', result.message || result.error);
                toast.error(result.message || "Failed to schedule collection.", {
                    duration: 3000,
                    position: 'top-right',
                });
            }
        } catch (error) {
            console.error('Error submitting schedule:', error);
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
                <div className="p-6 bg-white m-6 rounded-lg shadow-sm flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                        <div className="flex items-center mb-6">
                            <button onClick={() => navigate('/schedule')} className="mr-4">
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
                                placeholder="Additional notes"
                                className="min-h-[120px]"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="mb-6">
                            <h2 className="text-sm font-medium mb-2">Payment</h2>
                            <p className="mb-2 text-sm">You are required to pay Rs.100 for waste collection services</p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => navigate('/payment')}
                                    className="w-16 h-16 rounded shadow hover:scale-105 transition-transform duration-150"
                                >
                                    <img
                                        src="https://cdn-1.webcatalog.io/catalog/esewa/esewa-icon.png?v=1743381440946"
                                        alt="eSewa"
                                        className="object-contain w-full h-full"
                                    />
                                </button>
                            </div>
                        </div>
                        {successMessage && (
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                                <p className="text-sm text-green-700">{successMessage}</p>
                            </div>
                        )}
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


                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollectionForm;
