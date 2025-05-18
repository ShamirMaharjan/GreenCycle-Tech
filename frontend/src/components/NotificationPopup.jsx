import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, Bell, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const NotificationPopup = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const userRole = localStorage.getItem('role') || 'User';

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/api/notices/${encodeURIComponent(userRole)}`
        );
        setNotifications(data);
      } catch (err) {
        console.error('Failed to load notifications:', err);
      }
    };

    if (open) {
      fetchNotifications();
    }
  }, [userRole, open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <div className="p-2 relative cursor-pointer inline-flex items-center justify-center">
          <Bell size={24} />
          {notifications.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="end">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <h3 className="font-medium">Notifications</h3>
            <div
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <X size={18} />
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-gray-500 text-center">No new notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`flex items-start gap-3 p-3 border-b hover:bg-gray-50 ${
                    n.read ? 'opacity-70' : ''
                  }`}
                >
                  <div className="mt-1 text-gray-700">
                    <AlertCircle size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">{n.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopup;
