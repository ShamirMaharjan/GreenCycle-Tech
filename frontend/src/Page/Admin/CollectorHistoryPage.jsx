import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import sidebarBg from '../../assets/backgroundimage.png';

const CollectorHistoryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { request } = location.state || {};

  const [collectors, setCollectors] = useState([]);
  const [assignedCollectorIndex, setAssignedCollectorIndex] = useState(null);
  const [assignedCollector, setAssignedCollector] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCollectors, setFilteredCollectors] = useState([]);

  const fetchCollectors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/users/all', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        // Filter collectors by role 'garbageCollector'
        const filteredCollectors = data.data.filter(collector => collector.role === 'garbageCollector');
        
        const mappedCollectors = filteredCollectors.map(collector => ({
          id: collector._id,
          name: collector.name,
          email: collector.email,
          phone: collector.phoneNumber,
          address: collector.address,
          pickups: collector.pickups?.length || collector.history?.length || 0,
        }));
        setCollectors(mappedCollectors);
      } else {
        console.error('Failed to fetch collectors');
      }
    } catch (error) {
      console.error('Error fetching collectors:', error);
    }
  };

  useEffect(() => {
    fetchCollectors();
  }, []);

  useEffect(() => {
    const results = collectors.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCollectors(results);
  }, [searchQuery, collectors]);

  const handleAssign = (collector, index) => {
    setAssignedCollectorIndex(index);
    setAssignedCollector(collector);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/requestPage', {
      state: {
        assigned: true,
        requestId: request?.id,
        collector: assignedCollector,
      },
    });
  };

  const handleSearchClick = () => {
    setSearchQuery(searchInput);
  };

  if (!request) {
    return (
      <div className="h-screen flex items-center justify-center text-red-600 font-bold">
        Invalid request data.
        <button onClick={() => navigate(-1)} className="ml-4 underline text-blue-500">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen relative z-10">
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
            <img src={logo} alt="Logo" className="w-20 h-20 rounded-full mb-2" />
            <h2 className="text-lg font-bold text-white text-center">GREEN CYCLE TECH</h2>
          </div>
          <div className="relative z-10 space-y-1">
            <button onClick={() => navigate('/adminHome')} className="block w-full text-left px-4 py-2 text-white hover:bg-white hover:text-green-600 rounded">Home</button>
            <button onClick={() => navigate('/requestPage')} className="block w-full text-left px-4 py-2 bg-white text-green-600 rounded">Back to Requests</button>
          </div>
        </div>

        <main className="flex-1 p-8 overflow-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 drop-shadow">GARBAGE COLLECTOR HISTORY</h1>
            <p className="text-gray-500 mt-1">Assignment details of this request</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <input
                type="text"
                placeholder="Search collectors by name or email"
                className="w-full sm:w-64 p-2 border border-gray-300 rounded-md text-sm"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button
                onClick={handleSearchClick}
                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Search
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-green-700 mb-4">Assign to Garbage Collector</h2>
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
                {filteredCollectors.map((collector, index) => (
                  <tr key={collector.id}>
                    <td className="px-4 py-2 border">{collector.name}</td>
                    <td className="px-4 py-2 border">{collector.email}</td>
                    <td className="px-4 py-2 border">{collector.phone}</td>
                    <td className="px-4 py-2 border">{collector.address}</td>
                    <td className="px-4 py-2 border">{collector.pickups}</td>
                    <td className="px-4 py-2 border">
                      {assignedCollectorIndex === index ? (
                        <button disabled className="bg-gray-400 text-white px-3 py-1 rounded cursor-not-allowed">
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

      {isModalOpen && assignedCollector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md text-center space-y-4 w-[90%] max-w-md">
            <h2 className="text-xl font-bold text-green-700">Assigned Collector</h2>
            <p><strong>Name:</strong> {assignedCollector.name}</p>
            <p><strong>Phone:</strong> {assignedCollector.phone}</p>
            <p><strong>Email:</strong> {assignedCollector.email}</p>
            <p><strong>Address:</strong> {assignedCollector.address}</p>
            <p><strong>Pickups:</strong> {assignedCollector.pickups}</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
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
