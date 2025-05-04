import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import sidebarBg from '../../assets/backgroundimage.png';

const RequestPage = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([
    {
      id: 1,
      name: 'Saksham',
      email: 'Saksham@email.com',
      phone: '9839393941',
      address: 'Hetauda',
      time: '2025-04-08'
    },
    {
      id: 2,
      name: 'Sanish',
      email: 'Sanish@email.com',
      phone: '9814393989',
      address: 'Hetauda',
      time: '2025-04-08'
    },
    {
      id: 3,
      name: 'Sahyam',
      email: 'Sahyam@email.com',
      phone: '9839325989',
      address: 'Hetauda',
      time: ''
    }
  ]);

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  const handleApprove = (id) => {
    const request = requests.find(r => r.id === id);
    navigate(`/GarbageCOllectorsHistory`, { state: { request } });
  };

  const confirmReject = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const cancelReject = () => {
    setSelectedId(null);
    setShowConfirm(false);
  };

  const handleReject = () => {
    setRequests(prev => prev.filter(r => r.id !== selectedId));
    setSelectedId(null);
    setShowConfirm(false);
    setShowDeleteSuccess(true);
    setTimeout(() => setShowDeleteSuccess(false), 3000); // Hide success message after 3 seconds
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen relative z-10">
        {/* Sidebar */}
        <div
          className="w-64 p-6 border-r border-gray-200 text-white relative"
          style={{
            backgroundImage: `url(${sidebarBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="relative z-10 flex flex-col items-center mb-10">
            <img src={logo} alt="Logo" className="w-20 h-20 rounded-full mb-2" />
            <h2 className="text-lg font-bold text-white text-center">GREEN CYCLE TECH</h2>
          </div>
          <div className="relative z-10 space-y-1">
            <Link to="/adminHome" className="block w-full px-4 py-2 text-white hover:bg-white hover:text-green-600 rounded">Home</Link>
            <Link to="/users" className="block w-full px-4 py-2 text-white hover:bg-white hover:text-green-600 rounded">USERS</Link>
            <Link to="/notice" className="block w-full px-4 py-2 text-white hover:bg-white hover:text-green-600 rounded">NOTICE</Link>
            <Link to="/requestPage" className="block w-full px-4 py-2 bg-white text-green-600 rounded">REQUEST</Link>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 drop-shadow">REQUEST MANAGEMENT</h1>
          </div>

          {/* Success Message */}
          {showDeleteSuccess && (
            <div className="fixed top-4 right-4 bg-green-100 border-l-4 border-green-600 text-green-800 p-4 z-50 rounded">
              Request deleted successfully!
            </div>
          )}

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Name', 'Email', 'Phone No.', 'Address', 'Time', 'Actions'].map((header) => (
                      <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((req) => (
                    <tr key={req.id}>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold">{req.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold">{req.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold">{req.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold">{req.address}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold">{req.time || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => confirmReject(req.id)} className="text-red-600 hover:text-red-900 mr-3 text-xl">✗</button>
                        <button onClick={() => handleApprove(req.id)} className="text-green-600 hover:text-green-900 text-xl">✓</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {requests.length === 0 && (
                <p className="text-center py-4 text-gray-500">No pending requests.</p>
              )}
            </div>
          </div>
        </main>

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md text-center space-y-4 w-[90%] max-w-md">
              <h2 className="text-xl font-bold text-red-600">Confirm Deletion</h2>
              <p>Are you sure you want to delete this request?</p>
              <div className="flex justify-center gap-4 mt-4">
                <button onClick={cancelReject} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Cancel</button>
                <button onClick={handleReject} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestPage;

