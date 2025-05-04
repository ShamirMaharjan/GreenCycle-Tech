import React from 'react';
import Header from "../../components/Header";
import GCSidebar from '../../components/GCSidebar';
import { MapPin, Trash, CalendarIcon } from 'lucide-react';


const HistoryItem = ({ location, wasteType, weight, date, status }) => {
    return (
        <div className="bg-gray-200 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <MapPin className="text-gray-600" />
                    <span>{location}</span>
                </div>
                <span
                    className={`px-3 py-1 rounded-full text-sm ${status === 'Picked' ? 'bg-green-500 text-white' : 'bg-yellow-400 text-black'
                        }`}
                >
                    {status}
                </span>
            </div>

            <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Trash className="text-gray-600" />
                        <span className="text-gray-600">{wasteType}</span>
                    </div>
                    <span className="text-gray-600">{weight}</span>
                </div>

                <div className="flex items-center gap-2">
                    <CalendarIcon className="text-gray-600" size={16} />
                    <span className="text-gray-600">{date}</span>
                </div>
            </div>
        </div>
    );
};

const GCHistoryPage = () => {
    const historyItems = [
        {
            location: 'Kalanki, Kathmandu',
            wasteType: 'Degradable waste',
            weight: 'Approximately 70kg',
            date: '2025-01-05',
            status: 'Picked',
        },
        {
            location: 'Kalanki, Kathmandu',
            wasteType: 'Degradable waste',
            weight: 'Approximately 70kg',
            date: '2025-01-05',
            status: 'Picked',
        },
        {
            location: 'Kalanki, Kathmandu',
            wasteType: 'Degradable waste',
            weight: 'Approximately 70kg',
            date: '2025-01-05',
            status: 'Picked',
        },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            <GCSidebar />

            <div className="flex-1 flex flex-col">
                <Header />

                <div className="p-6 bg-white m-6 rounded-lg shadow-sm">
                    {historyItems.map((item, index) => (
                        <HistoryItem key={index} {...item} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GCHistoryPage;