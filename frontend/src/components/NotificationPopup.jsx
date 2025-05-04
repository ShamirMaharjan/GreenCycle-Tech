import React from 'react';
import { AlertCircle, Bell, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const NotificationPopup = () => {
    const [open, setOpen] = React.useState(false);

    const notifications = [
        {
            id: 1,
            text: "A new article about Bio-Degradable waste has been shared with you.",
            date: "March 29 at 9:50 PM",
            read: false,
        },
        {
            id: 2,
            text: "A new article about Hazardous waste has been shared with you.",
            date: "March 25 at 9:50 PM",
            read: false,
        },
        {
            id: 3,
            text: "A new article about Recycable waste has been shared with you.",
            date: "March 20 at 9:50 PM",
            read: true,
        },
        {
            id: 4,
            text: "Your waste pickup schedule has been rescheduled due to unforeseen circumstances.",
            date: "March 19 at 9:50 PM",
            read: true,
        },
        {
            id: 5,
            text: "A new article about Bio-Degradable waste has been shared with you.",
            date: "March 15 at 9:50 PM",
            read: true,
        },
    ];

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button className="p-2 relative">
                    <Bell size={24} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="flex justify-between items-center px-4 py-3 border-b">
                        <h3 className="font-medium">Notifications</h3>
                        <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`flex items-start gap-3 p-3 border-b hover:bg-gray-50 ${notification.read ? 'opacity-70' : ''
                                    }`}
                            >
                                <div className="mt-1 text-gray-700">
                                    <AlertCircle size={18} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm">{notification.text}</p>
                                    <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default NotificationPopup;