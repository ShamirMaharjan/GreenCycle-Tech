import React, { useState } from 'react';
import { UserRound, Mail, MapPin, Phone, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useNavigate } from 'react-router-dom';

const ProfilePopup = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [view, setView] = useState('info'); // Removed <ProfileView> type

    // Mock user data
    const [userData, setUserData] = useState({
        name: 'ALICE GREEN',
        email: 'Alicegreen@gmail.com',
        location: 'Naxal, Kathmandu',
        phone: '9812345678',
        avatarUrl: ''
    });

    const handleClosePopup = () => {
        setOpen(false);
        // Reset to the default view when closing
        setTimeout(() => setView('info'), 300);
    };

    const renderContent = () => {
        switch (view) {
            case 'info':
                return (
                    <div className="flex flex-col p-6">
                        <button
                            onClick={handleClosePopup}
                            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex justify-center mb-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={userData.avatarUrl} />
                                <AvatarFallback className="bg-gray-200 text-gray-600 text-xl">
                                    {userData.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        <h2 className="text-center font-semibold text-lg mb-6">{userData.name}</h2>

                        <div className="space-y-4 border-t pt-4">
                            <div className="flex items-center gap-3">
                                <Mail size={18} className="text-gray-600" />
                                <p className="text-sm">{userData.email}</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <MapPin size={18} className="text-gray-600" />
                                <p className="text-sm">{userData.location}</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Phone size={18} className="text-gray-600" />
                                <p className="text-sm">{userData.phone}</p>
                            </div>
                        </div>

                        <div className="flex justify-between mt-6">
                            <Button
                                variant="outline"
                                onClick={() => setView('edit')}
                                className="text-green-600 hover:text-green-700"
                            >
                                Edit Profile
                            </Button>
                            <Button
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => {
                                    handleClosePopup();
                                    navigate('/');
                                }}
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                );

            case 'edit':
                return (
                    <div className="flex flex-col p-6">
                        <button
                            onClick={handleClosePopup}
                            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                        >
                            <X size={18} />
                        </button>

                        {/* <div className="flex justify-center mb-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={userData.avatarUrl} />
                                <AvatarFallback className="bg-gray-200 text-gray-600 text-xl">
                                    {userData.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <p className="text-xs text-center text-gray-500 mb-4">Change profile picture</p> */}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Name</label>
                                <Input
                                    value={userData.name}
                                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input
                                    value={userData.email}
                                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Phone Number</label>
                                <Input
                                    value={userData.phone}
                                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Location</label>
                                <Input
                                    value={userData.location}
                                    onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex justify-between mt-6">
                            <Button
                                variant="default"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => setView('info')}
                            >
                                SAVE CHANGES
                            </Button>
                            <Button
                                variant="link"
                                onClick={() => setView('password')}
                                className="text-green-600 hover:text-green-700"
                            >
                                Change Password
                            </Button>
                        </div>
                    </div>
                );

            case 'password':
                return (
                    <div className="flex flex-col p-6">
                        <button
                            onClick={handleClosePopup}
                            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                        >
                            <X size={18} />
                        </button>

                        <div className="space-y-4 mt-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Password</label>
                                <Input type="password" placeholder="Enter current password" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">New Password</label>
                                <Input type="password" placeholder="Enter new password" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Confirm Password</label>
                                <Input type="password" placeholder="Re-enter new password" />
                            </div>
                        </div>

                        <div className="flex justify-between mt-6">
                            <Button
                                variant="default"
                                className="bg-green-600 hover:bg-green-700"
                            >
                                SAVE CHANGES
                            </Button>
                            <Button
                                variant="link"
                                onClick={() => setView('edit')}
                                className="text-green-600 hover:text-green-700"
                            >
                                Change basic information
                            </Button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="p-2 rounded-full bg-gray-100">
                    <UserRound size={24} />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md p-0">
                {renderContent()}
            </DialogContent>
        </Dialog>
    );
};

export default ProfilePopup;