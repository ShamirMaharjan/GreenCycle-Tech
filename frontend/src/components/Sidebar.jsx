import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <div className="w-64 min-h-screen bg-[#0A2905] flex flex-col items-center">
            <div className="mt-8 mb-12">
                <img
                    src="/lovable-uploads/88f79527-1242-4096-a5cc-56051c099c47.png"
                    alt="GreenCycle Logo"
                    className="w-28 h-28 rounded-full bg-white p-2"
                />
            </div>

            <nav className="w-full flex flex-col">
                <Link
                    to="/userHome"
                    className={`py-4 px-8 text-white font-medium ${currentPath === '/userHome' ? 'bg-green-500' : 'hover:bg-green-500/30 transition-colors'}`}
                >
                    HOME
                </Link>
                <Link
                    to="/schedule"
                    className={`py-4 px-8 text-white font-medium ${currentPath === '/schedule' ? 'bg-green-500' : 'hover:bg-green-500/30 transition-colors'}`}
                >
                    SCHEDULE
                </Link>
                <Link
                    to="/history"
                    className={`py-4 px-8 text-white font-medium ${currentPath === '/history' ? 'bg-green-500' : 'hover:bg-green-500/30 transition-colors'}`}
                >
                    HISTORY
                </Link>
                <Link
                    to="/contact"
                    className={`py-4 px-8 text-white font-medium ${currentPath === '/contact' ? 'bg-green-500' : 'hover:bg-green-500/30 transition-colors'}`}
                >
                    CONTACT US
                </Link>
            </nav>
        </div>
    );
};

export default Sidebar;