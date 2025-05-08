import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import sidebarBg from "../../assets/backgroundimage.png";
import { toast } from "react-hot-toast";

const NoticesPage = () => {
  const [notices, setNotices] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState(null);
  const [newNotice, setNewNotice] = useState({
    title: "",
    description: "",
    category: "",
  });

  const categories = ["All"];

  // Fetch notices from backend on mount
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/notices");
        setNotices(data);
      } catch (error) {
        toast.error(err.response?.data?.message || "Something went wrong", {
          duration: 3000,
          position: 'top-right',
        });

      }
    };
    fetchNotices();
  }, []);

  const handleDeleteClick = (id) => {
    setNoticeToDelete(id);
    setShowDeleteConfirm(true);
  };

  // Delete notice via backend
  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/notices/${noticeToDelete}`);
      setNotices(notices.filter((n) => n._id !== noticeToDelete));
      setShowDeleteConfirm(false);

      setShowDeleteSuccess(true);
      toast.success("Notice deleted successfully!", {
        duration: 3000,
        position: 'top-right',
      });
      setTimeout(() => setShowDeleteSuccess(false), 3000);
    } catch (error) {
      toast.error(err.response?.data?.message || "Something went wrong", {
        duration: 3000,
        position: 'top-right',
      });

    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // Add new notice via backend
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: newNotice.title,
        description: newNotice.description,
        category: newNotice.category,
      };
      const { data } = await axios.post("http://localhost:3000/api/notices", payload);
      setNotices([data, ...notices]);
      setNewNotice({ title: "", description: "", category: "" });
      setShowAddForm(false);
      toast.success("Notice added successfully!", {
        duration: 3000,
        position: 'top-right',
      });
    } catch (error) {
      toast.error(err.response?.data?.message || "Something went wrong", {
        duration: 3000,
        position: 'top-right',
      });


    }
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
            {/* <Link to="/adminhome" className="block px-4 py-2 text-white hover:bg-white hover:text-green-600 rounded">Home</Link> */}
            <Link to="/users" className="block px-4 py-2 text-white hover:bg-white hover:text-green-600 rounded">DASHBOARD</Link>
            <Link to="/notice" className="block px-4 py-2 bg-white text-green-600 rounded">NOTICE</Link>
            <Link to="/requestPage" className="block px-4 py-2 text-white hover:bg-white hover:text-green-600 rounded">REQUEST</Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <header className="mb-6">
            <h2 className="text-2xl font-bold text-black">
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
            <form onSubmit={handleAddSubmit} className="bg-white p-6 rounded-xl shadow-lg max-w-2xl">
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
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  SEND
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="space-y-4">
                {notices.map((notice) => (
                  <div
                    key={notice._id}
                    className="bg-white p-5 rounded-xl shadow-md border flex justify-between"
                  >
                    <div>
                      <p className="font-bold text-gray-800">{notice.title}</p>
                      <p className="text-sm text-gray-600">{notice.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(notice.createdAt).toLocaleString()} | {notice.category}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(notice._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-full shadow-lg"
                >
                  ADD
                </button>
              </div>
            </>
          )}

          {/* Delete Confirm Modal */}
          {showDeleteConfirm && (
            <div className="absolute inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
                <p className="mb-6">Are you sure you want to delete this notice?</p>
                <div className="flex justify-end space-x-3">
                  <button onClick={cancelDelete} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
                  <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
                </div>
              </div>
            </div>
          )}

          {/* Link to Contact Page */}
          <div className="mt-8">
            <Link to="/admincontact" className="text-indigo-600 hover:text-indigo-800">
              View Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticesPage;
