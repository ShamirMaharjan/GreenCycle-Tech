import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import sidebarBg from "../../assets/backgroundimage.png";
import { toast } from "react-hot-toast";

const NoticesPage = () => {
  const [notices, setNotices] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState(null);
  const [newNotice, setNewNotice] = useState({
    title: "",
    description: "",
    category: "All", // Automatically set to "All"
  });

<<<<<<< HEAD
  const categories = ["All"];

  // Fetch notices from backend on mount
=======
>>>>>>> integrate
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
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/notices/${noticeToDelete}`);
      setNotices(notices.filter((n) => n._id !== noticeToDelete));
<<<<<<< HEAD
      setShowDeleteConfirm(false);

=======
      setNoticeToDelete(null);
>>>>>>> integrate
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
    setNoticeToDelete(null);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: newNotice.title,
        description: newNotice.description,
        category: newNotice.category, // Always "All"
      };
      const { data } = await axios.post("http://localhost:3000/api/notices", payload);
      setNotices([data, ...notices]);
      setNewNotice({ title: "", description: "", category: "All" }); // Reset to "All"
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

          {showDeleteSuccess && (
            <div className="fixed top-4 right-4 bg-green-100 border-l-4 border-green-600 text-green-800 p-4 z-50 rounded">
              Notice deleted successfully!
            </div>
          )}

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
              {/* Category is removed because it's always set to "All" */}
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
                  <div key={notice._id} className="bg-white p-5 rounded-xl shadow-md border flex justify-between items-start relative">
                    <div>
                      <p className="font-bold text-gray-800">{notice.title}</p>
                      <p className="text-sm text-gray-600">{notice.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notice.createdAt).toLocaleString()} | {notice.category}
                      </p>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => handleDeleteClick(notice._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>

                      {noticeToDelete === notice._id && (
                        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 shadow-lg p-4 rounded z-50">
                          <p className="text-base font-semibold text-gray-800 mb-4">
                            Are you sure you want to delete this notice?
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
                ))}
              </div>

              <div className="mt-8 flex justify-between">
                {/* Left-aligned "View Feedback" link */}
                <Link
                  to="/admincontact"
                  className="text-lg font-semibold text-indigo-700 hover:text-indigo-900 transition duration-200"
                >
                  View Feedback
                </Link>

                {/* Right-aligned "Add" button */}
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-full shadow-lg"
                >
                  ADD
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoticesPage;
