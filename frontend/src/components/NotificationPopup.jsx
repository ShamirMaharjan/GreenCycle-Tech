import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, Bell, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'react-hot-toast';

const NotificationPopup = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [noticeToDelete, setNoticeToDelete] = useState(null);

  // Replace this with however you actually get the user's role:
  // e.g. from your auth context or localStorage
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
        toast.error('Failed to load notifications');
      }
    };

    // Fetch whenever the popover opens (optional) or on mount
    if (open) {
      fetchNotifications();
    }
  }, [userRole, open]);

  const handleDeleteClick = (id) => {
    setNoticeToDelete(id);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/notices/${noticeToDelete}`);
      setNotifications(notifications.filter((n) => n._id !== noticeToDelete));
      setNoticeToDelete(null);
      toast.success('Notification deleted successfully!', {
        duration: 3000,
        position: 'top-right',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete notification', {
        duration: 3000,
        position: 'top-right',
      });
    }
  };

  const cancelDelete = () => {
    setNoticeToDelete(null);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="p-2 relative">
          <Bell size={24} />
          {notifications.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="end">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <h3 className="font-medium">Notifications</h3>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>
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
                  <div className="relative">
                    <button
                      onClick={() => handleDeleteClick(n._id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>

                    {noticeToDelete === n._id && (
                      <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 shadow-lg p-4 rounded z-50">
                        <p className="text-base font-semibold text-gray-800 mb-4">
                          Are you sure you want to delete this notification?
                        </p>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={cancelDelete}
                            className="px-3 py-1 bg-gray-400 text-white rounded text-sm"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={confirmDelete}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
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
