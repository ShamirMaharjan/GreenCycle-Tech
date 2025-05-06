import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import sidebarBg from '../../assets/backgroundimage.png';
import axios from 'axios';

const RequestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  const [showCollectorInfo, setShowCollectorInfo] = useState(false);
  const [collectorDetails, setCollectorDetails] = useState(null);

  const [showReassignConfirm, setShowReassignConfirm] = useState(false);
  const [requestToReassign, setRequestToReassign] = useState(null);

  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [requestDetails, setRequestDetails] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token not found');

        const res = await axios.get('http://localhost:3000/api/collections/pending', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success && Array.isArray(res.data.data)) {
          setRequests(res.data.data);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        setError('Failed to load requests');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    if (location.state?.assigned) {
      const { requestId, collector } = location.state;
      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, assignedTo: collector } : req
        )
      );
    }
  }, [location.state]);

  const handleApprove = (id) => {
    const request = requests.find((r) => r._id === id);
    navigate(`/GarbageCollectorHistory`, { state: { request } });
  };

  const handleReassign = (request) => {
    setRequestToReassign(request);
    setShowReassignConfirm(true);
  };

  const cancelReassign = () => {
    setRequestToReassign(null);
    setShowReassignConfirm(false);
  };

  const confirmReassign = () => {
    navigate(`/GarbageCollectorHistory`, { state: { request: requestToReassign } });
    setRequestToReassign(null);
    setShowReassignConfirm(false);
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
    setRequests((prev) => prev.filter((r) => r._id !== selectedId));
    setSelectedId(null);
    setShowConfirm(false);
    setShowDeleteSuccess(true);
    setTimeout(() => setShowDeleteSuccess(false), 3000);
  };

  const openCollectorPopup = (collector, request) => {
    setCollectorDetails({ ...collector, request });
    setShowCollectorInfo(true);
  };

  const closeCollectorPopup = () => {
    setCollectorDetails(null);
    setShowCollectorInfo(false);
  };

  const handleViewDetails = (req) => {
    setRequestDetails(req);
    setShowRequestDetails(true);
  };

  const closeRequestDetails = () => {
    setRequestDetails(null);
    setShowRequestDetails(false);
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
            <Link to="/adminHome" className="block w-full px-4 py-2 text-white hover:bg-white hover:text-green-600 rounded">HOME</Link>
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

          {loading ? (
            <p className="text-center text-gray-500">Loading requests...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <>
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
                        <tr key={req._id}>
                          <td className="px-6 py-4 whitespace-nowrap font-semibold">{req.clientName || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap font-semibold">{req.clientId?.email || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap font-semibold">{req.clientPhone || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap font-semibold">{req.clientAddress || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap font-semibold">{req.date ? new Date(req.date).toLocaleString() : '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-3">
                            <button onClick={() => confirmReject(req._id)} className="text-red-600 hover:text-red-900 text-xl">✗</button>
                            <button onClick={() => handleViewDetails(req)} className="text-blue-600 hover:text-blue-900 text-xl">👁️</button>

                            {req.assignedTo ? (
                              <button
                                onClick={() => openCollectorPopup(req.assignedTo, req)}
                                className="text-green-600 hover:text-green-900 text-xl"
                              >
                                Assigned
                              </button>
                            ) : (
                              <button
                                onClick={() => handleApprove(req._id)}
                                className="text-green-600 hover:text-green-900 text-xl"
                              >
                                ✓
                              </button>
                            )}
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
            </>
          )}
        </main>

        {/* Modals */}
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

        {showCollectorInfo && collectorDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md text-center space-y-4 w-[90%] max-w-md">
              <h2 className="text-xl font-bold text-green-700">Assigned Collector</h2>
              <p><strong>Name:</strong> {collectorDetails.name}</p>
              <p><strong>Phone:</strong> {collectorDetails.phone}</p>
              <div className="flex justify-center gap-4 mt-4">
                <button onClick={closeCollectorPopup} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Close</button>
                <button onClick={() => handleReassign(collectorDetails.request)} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Reassign</button>
              </div>
            </div>
          </div>
        )}

        {showReassignConfirm && requestToReassign && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md text-center space-y-4 w-[90%] max-w-md">
              <h2 className="text-xl font-bold text-green-700">Reassign Request</h2>
              <p>Are you sure you want to reassign this request?</p>
              <div className="flex justify-center gap-4 mt-4">
                <button onClick={cancelReassign} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Cancel</button>
                <button onClick={confirmReassign} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Yes</button>
              </div>
            </div>
          </div>
        )}

        {showRequestDetails && requestDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md text-center space-y-4 w-[90%] max-w-md">
              <h2 className="text-xl font-bold text-blue-700">Request Details</h2>
              <p><strong>Date:</strong> {new Date(requestDetails.date).toLocaleString()}</p>
              <p><strong>Location:</strong> {requestDetails.location || '-'}</p>
              <p><strong>Description:</strong> {requestDetails.description || '-'}</p>
              <div className="flex justify-center gap-4 mt-4">
                <button onClick={closeRequestDetails} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestPage;
