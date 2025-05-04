import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import sidebarBg from '../../assets/backgroundimage.png';

const CollectorHistoryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { request } = location.state || {};
  const [assignedCollectorIndex, setAssignedCollectorIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignedCollector, setAssignedCollector] = useState(null);

  const collectors = [
    {
      name: 'Saksham',
      email: 'Saksham@gmail.com',
      phone: '9839393989',
      address: 'Hetauda',
      pickups: 1,
    },
    {
      name: 'Ramesh',
      email: 'ramesh@gmail.com',
      phone: '9841122233',
      address: 'Kathmandu',
      pickups: 0,
    },
  ];

  const handleAssign = (collector, index) => {
    setAssignedCollectorIndex(index);
    setAssignedCollector(collector);
    setIsModalOpen(true);  // Open the popup/modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal when "OK" is clicked
    navigate('/requestPage', {
      state: {
        assigned: true,
        requestId: request?.id,
        collector: assignedCollector, // Pass the assigned collector details
      },
    });
  };

  if (!request) {
    return (
      <div className="h-screen flex items-center justify-center text-red-600 font-bold">
        Invalid request data.
        <button
          onClick={() => navigate(-1)}
          className="ml-4 underline text-blue-500"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen relative z-10">
        {/* Sidebar */}
        <div
          className="w-64 p-6 border-r border-gray-200 text-white relative"
          style={{
            backgroundImage: `url(${sidebarBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="relative z-10 flex flex-col items-center mb-10">
            <img
              src={logo}
              alt="Logo"
              className="w-20 h-20 rounded-full mb-2"
            />
            <h2 className="text-lg font-bold text-white text-center">
              GREEN CYCLE TECH
            </h2>
          </div>
          <div className="relative z-10 space-y-1">
            <button
              onClick={() => navigate('/adminHome')}
              className="block w-full text-left px-4 py-2 text-white hover:bg-white hover:text-green-600 rounded"
            >
              Home
            </button>
            <button
              onClick={() => navigate('/requestPage')}
              className="block w-full text-left px-4 py-2 bg-white text-green-600 rounded"
            >
              Back to Requests
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 drop-shadow">
              GARBAGE COLLECTOR HISTORY
            </h1>
            <p className="text-gray-500 mt-1">
              Assignment details of this request
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-green-700 mb-4">
              Assign to Garbage Collector
            </h2>
            <table className="w-full table-auto text-left border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Phone No.</th>
                  <th className="px-4 py-2 border">Address</th>
                  <th className="px-4 py-2 border">Pickups</th>
                  <th className="px-4 py-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {collectors.map((collector, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border">{collector.name}</td>
                    <td className="px-4 py-2 border">{collector.email}</td>
                    <td className="px-4 py-2 border">{collector.phone}</td>
                    <td className="px-4 py-2 border">{collector.address}</td>
                    <td className="px-4 py-2 border">{collector.pickups}</td>
                    <td className="px-4 py-2 border">
                      {assignedCollectorIndex === index ? (
                        <button
                          disabled
                          className="bg-gray-400 text-white px-3 py-1 rounded cursor-not-allowed"
                        >
                          Assigned
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAssign(collector, index)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Assign
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Modal for Assigned Collector */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md text-center space-y-4 w-[90%] max-w-md">
            <h2 className="text-xl font-bold text-green-700">Assigned Collector</h2>
            <p><strong>Name:</strong> {assignedCollector?.name}</p>
            <p><strong>Phone:</strong> {assignedCollector?.phone}</p>
            <div className="flex justify-center gap-4 mt-4">
              <button onClick={closeModal} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectorHistoryPage;
