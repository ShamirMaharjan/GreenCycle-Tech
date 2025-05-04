import React, { useState } from 'react';
import axios from 'axios';
import logo from '../assets/logo.png';
import bgImage from '../assets/backgroundimage.png'; // Make sure the file name matches exactly!
import { useNavigate } from 'react-router-dom';

const Signup = ({ setIsSignup }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    email: "",
    password: "",
    role: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneNumber = formData.phoneNumber.replace(/\D/g, '');
    if (phoneNumber.length !== 10) {
      alert('Phone number must be exactly 10 digits');
      return;
    }

    const updatedFormData = {
      ...formData,
      phoneNumber,
    };

    try {
      const res = await axios.post("http://localhost:3000/api/users/register", updatedFormData);
      alert(res.data.message);
      const { user, token } = res.data;

      localStorage.setItem('role', user.role);
      localStorage.setItem('user', JSON.stringify(user));
      if (token) localStorage.setItem('token', token);

      if (user.role === 'admin') {
        navigate('/adminHome');
      } else if (user.role === 'garbageCollector') {
        navigate('/gcHome');
      } else {
        navigate('/userHome');
      }

      setFormData({
        name: "",
        address: "",
        phoneNumber: "",
        email: "",
        password: "",
        role: "",
      });

    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center px-6"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white bg-opacity-90 shadow-lg rounded-lg">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Green Cycle Tech" style={{ height: '100px', width: 'auto' }} />
        </div>

        <h2 className="text-center text-2xl font-bold text-green-700">SIGN UP</h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          PLEASE FILL THE DETAILS TO COMPLETE SIGN UP
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="USER NAME"
            className="input-field"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="ADDRESS"
            className="input-field"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="PHONE NUMBER"
            className="input-field"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="EMAIL"
            className="input-field"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="PASSWORD"
            className="input-field"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <select
            name="role"
            className="input-field"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">CHOOSE A ROLE</option>
            <option value="User">User</option>
            <option value="garbageCollector">Garbage Collector</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            className="w-full py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            SIGNUP
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-700">
          ALREADY HAVE AN ACCOUNT?{" "}
          <span
            onClick={() => navigate('/login')}
            className="text-green-600 font-semibold cursor-pointer"
          >
            LOGIN NOW
          </span>

        </p>
      </div>

      {/* Styles */}
      <style>{`
        .input-field {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default Signup;
