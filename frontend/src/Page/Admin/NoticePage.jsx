import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import sidebarBg from "../../assets/backgroundimage.png";

const NoticesPage = () => {
  const [notices, setNotices] = useState([
    {
      id: 1,
      text: "GARBAGE COLLECTOR ID NO:1256 ADDED TO YOUR WEBSITE",
      time: "2 hours ago",
      category: "Garbage",
    },
    {
      id: 2,
      text: "YOU HAVE RECEIVED COMPLAINT FOR GARBAGE COLLECTOR ID ...FROM USER ID ...",
      time: "1 day ago",
      category: "Users",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState(null);
  const [newNotice, setNewNotice] = useState({
    title: "",
    description: "",
    category: "",
  });

  const categories = ["All", "Users", "Garbage Collector"];

  const handleDeleteClick = (id) => {
    setNoticeToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setNotices(notices.filter((notice) => notice.id !== noticeToDelete));
    setShowDeleteConfirm(false);
    setShowDeleteSuccess(true);
    setTimeout(() => setShowDeleteSuccess(false), 3000);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newNoticeItem = {
      id: Date.now(),
      text: newNotice.title,
      time: "Just now",
      description: newNotice.description,
      category: newNotice.category,
    };
    setNotices([newNoticeItem, ...notices]);
    setNewNotice({ title: "", description: "", category: "" });
    setShowAddForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNotice((prev) => ({ ...prev, [name]: value }));
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
            <Link to="/" className="block w-full text-left px-4 py-2 text-white hover:bg-white hover:text-green-600 rounded">Home</Link>
            <Link to="/users" className="block w-full text-left px-4 py-2 text-white hover:bg-white hover:text-green-600 rounded">USERS</Link>
            <Link to="/notice" className="block w-full text-left px-4 py-2 bg-white text-green-600 rounded">NOTICE</Link>
            <Link to="/requestPage" className="block w-full text-left px-4 py-2 text-white hover:bg-white hover:text-green-600 rounded">REQUEST</Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <header className="mb-6">
            <h2 className="text-2xl font-bold text-black drop-shadow">
              {showAddForm ? "ADD NEW NOTICE" : "NOTICES"}
            </h2>
          </header>

          {/* Success Alert */}
          {showDeleteSuccess && (
            <div className="fixed top-4 right-4 bg-green-100 border-l-4 border-green-600 text-green-800 p-4 z-50 rounded">
              Notice deleted successfully!
            </div>
          )}

          {/* Add Form */}
          {showAddForm ? (
            <div className="bg-white bg-opacity-80 backdrop-blur-md p-6 rounded-xl shadow-lg max-w-2xl">
              <form onSubmit={handleAddSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newNotice.title}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={newNotice.description}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded"
                    rows="4"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Category</label>
                  <select
                    name="category"
                    value={newNotice.category}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    SEND
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {notices.map((notice) => (
                  <div
                    key={notice.id}
                    className="bg-white bg-opacity-80 backdrop-blur-sm p-5 rounded-xl shadow-md flex justify-between items-center border border-gray-300"
                  >
                    <div>
                      <p className="text-gray-800 font-medium">{notice.text}</p>
                      <p className="text-gray-500 text-sm mt-1">{notice.time}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(notice.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7L5 7M6 7V19a2 2 0 002 2h8a2 2 0 002-2V7M10 11V17M14 11V17M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full shadow-lg"
                >
                  ADD
                </button>
              </div>
            </>
          )}

          {/* Delete Confirmation - Now inline like UsersPage */}
          {showDeleteConfirm && (
            <div className="absolute inset-0 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
                <p className="mb-6">Are you sure you want to delete this notice?</p>
                <div className="flex justify-end space-x-3">
                  <button 
                    onClick={cancelDelete} 
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmDelete} 
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoticesPage;