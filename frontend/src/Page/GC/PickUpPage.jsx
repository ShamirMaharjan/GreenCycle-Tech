import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import GCSidebar from '@/components/GCSidebar';
import Calendar from '../../components/Calendar';
import Calendar2 from '@/components/Calender2';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const PickUpPage = () => {
    const navigate = useNavigate();
    const [date, setDate] = useState(new Date());
    const [showPickups, setShowPickups] = useState(false);
    const formattedDate = format(date, 'dd MMMM');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPickup, setSelectedPickup] = useState(null);

    // Example pickup data
    const [pickups, setPickups] = useState([
        {
            id: 1,
            name: "SHAMIR MAHARJAN",
            phone: "9840840311",
            location: "KALANKI, KATHMANDU",
            status: "pending" // pending, onTheWay, completed
        },
        {
            id: 2,
            name: "SHAMIR MAHARJAN",
            phone: "9840840311",
            location: "KALANKI, KATHMANDU",
            status: "onTheWay"
        },
        {
            id: 3,
            name: "SHAMIR MAHARJAN",
            phone: "9840840311",
            location: "KALANKI, KATHMANDU",
            status: "completed"
        }
    ]);

    // Calendar events for the collector
    const calendarEvents = [
        { date: new Date(2025, 4, 2), label: '3 Pickups' }, // May 2nd, 2025
    ];

    const handleDateSelect = (selectedDate) => {
        setDate(selectedDate);

        // If it's day 2 (for example), show pickups view
        const isPickupDay = calendarEvents.some(event =>
            event.date.getDate() === selectedDate.getDate() &&
            event.date.getMonth() === selectedDate.getMonth() &&
            event.date.getFullYear() === selectedDate.getFullYear()
        );

        if (isPickupDay) {
            setShowPickups(true);
        }
    };

    const handleBack = () => {
        setShowPickups(false);
    };

    const handleStatusChange = (pickup, newStatus) => {
        const updatedPickups = pickups.map(p =>
            p.id === pickup.id ? { ...p, status: newStatus } : p
        );
        setPickups(updatedPickups);
        setDialogOpen(false);
    };

    const openDialog = (pickup) => {
        setSelectedPickup(pickup);
        setDialogOpen(true);
    };

    const getStatusButton = (status) => {
        switch (status) {
            case 'pending':
                return <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">Not Arrived</div>;
            case 'onTheWay':
                return <div className="bg-yellow-300 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">On The Way</div>;
            case 'completed':
                return <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">Picked Up</div>;
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <GCSidebar />

            <div className="flex-1 flex flex-col">
                <Header />

                <div className="p-6 bg-white m-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div className="text-lg font-semibold">{formattedDate}</div>
                    </div>

                    {!showPickups ? (
                        <div className="mb-6">
                            <Calendar2
                                selectedDate={date}
                                onSelectDate={handleDateSelect}
                                events={calendarEvents}
                            />
                        </div>
                    ) : (
                        <div className="border rounded-lg overflow-hidden p-4">
                            <div className="mb-4 font-bold text-center bg-gray-100 py-2 rounded">
                                3 PICKUPS TODAY.
                            </div>

                            <div className="space-y-4">
                                {pickups.map((pickup) => (
                                    <div key={pickup.id} className="bg-white rounded-lg shadow p-4">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-12 w-12 bg-gray-200">
                                                {/* Avatar image would go here */}
                                            </Avatar>

                                            <div className="flex-1">
                                                <div className="flex justify-between items-center">
                                                    <h3
                                                        className="font-bold cursor-pointer hover:text-green-600"
                                                        onClick={() => openDialog(pickup)}
                                                    >
                                                        {pickup.name}
                                                    </h3>
                                                    {getStatusButton(pickup.status)}
                                                </div>
                                                <p className="text-gray-600">{pickup.phone}</p>
                                                <div className="flex items-center mt-1 text-gray-700">
                                                    <MapPin size={16} className="mr-1" />
                                                    {pickup.location}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 flex justify-end">
                                <Button variant="outline" onClick={handleBack} className="rounded-full">
                                    BACK
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Status Change Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center">{selectedPickup?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col space-y-3 py-4">
                        <div className="text-sm text-gray-600 text-center">{selectedPickup?.phone}</div>
                        <div className="flex items-center justify-center text-sm text-gray-600">
                            <MapPin size={16} className="mr-1" />
                            {selectedPickup?.location}
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <button
                            className="bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors"
                            onClick={() => handleStatusChange(selectedPickup, 'pending')}
                        >
                            Not Arrived
                        </button>
                        <button
                            className="bg-yellow-300 text-gray-800 py-2 rounded-md hover:bg-yellow-400 transition-colors"
                            onClick={() => handleStatusChange(selectedPickup, 'onTheWay')}
                        >
                            On The Way
                        </button>
                        <button
                            className="bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors"
                            onClick={() => handleStatusChange(selectedPickup, 'completed')}
                        >
                            Picked Up
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PickUpPage;