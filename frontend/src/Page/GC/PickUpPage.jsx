import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import GCSidebar from '../../components/GCSidebar';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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

    const handleDateClick = (day) => {
        setShowPickups(true);
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
                    <div className="flex justify-end mb-6">
                        <div className="text-lg font-semibold">{formattedDate}</div>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                        <button className="bg-white rounded-full p-2 shadow-sm">
                            <ChevronLeft size={24} />
                        </button>
                        <h2 className="text-xl font-bold">{format(date, 'MMMM')}</h2>
                        <button className="bg-white rounded-full p-2 shadow-sm">
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    {!showPickups ? (
                        <div className="border rounded-lg overflow-hidden">
                            <div className="grid grid-cols-7 text-center">
                                <div className="p-4 font-semibold">Sun</div>
                                <div className="p-4 font-semibold">Mon</div>
                                <div className="p-4 font-semibold">Tue</div>
                                <div className="p-4 font-semibold">Wed</div>
                                <div className="p-4 font-semibold">Thu</div>
                                <div className="p-4 font-semibold">Fri</div>
                                <div className="p-4 font-semibold">Sat</div>
                            </div>

                            <div className="grid grid-cols-7 border-t">
                                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                    <div
                                        key={day}
                                        className={`p-4 border-r last:border-r-0 min-h-[100px] ${day === 2 ? 'bg-yellow-100 cursor-pointer' : ''}`}
                                        onClick={() => day === 2 && handleDateClick(day)}
                                    >
                                        <div className="font-bold">{day}</div>
                                        {day === 2 && (
                                            <div className="mt-2 text-sm font-medium">3 Pickups</div>
                                        )}
                                    </div>
                                ))}
                            </div>
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