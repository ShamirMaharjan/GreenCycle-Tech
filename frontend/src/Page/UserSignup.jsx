import React, { useState } from 'react';
import axios from 'axios';
import logo from '../assets/logo.png';
import bgImage from '../assets/backgroundimage.png';
import { useNavigate } from 'react-router-dom';

const UserSignup = () => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    address: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [passwordTouched, setPasswordTouched] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const minLength = /.{7,}/;
    const hasNumber = /\d/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    return minLength.test(password) && hasNumber.test(password) && hasSpecialChar.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneNumber = formData.phoneNumber.replace(/\D/g, '');
    if (phoneNumber.length !== 10) {
      alert('Phone number must be exactly 10 digits');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!validatePassword(formData.password)) {
      alert("Password must contain at least 7 characters, 1 number, and 1 special character");
      return;
    }

    const updatedFormData = {
      username: formData.username,
      name: formData.name,
      address: formData.address,
      phoneNumber,
      email: formData.email,
      password: formData.password,
      role: "User"
    };

    try {
      const res = await axios.post("http://localhost:3000/api/users/register", updatedFormData);
      alert(res.data.message);
      const { user, token } = res.data;

      localStorage.setItem('role', user.role);
      localStorage.setItem('user', JSON.stringify(user));
      if (token) localStorage.setItem('token', token);

      navigate('/userHome');

      setFormData({
        username: "",
        name: "",
        address: "",
        phoneNumber: "",
        email: "",
        password: "",
        confirmPassword: ""
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
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white bg-opacity-90 shadow-lg rounded-lg">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Green Cycle Tech" style={{ height: '100px', width: 'auto' }} />
        </div>

        <h2 className="text-center text-2xl font-bold text-green-700">USER SIGN UP</h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          PLEASE FILL THE DETAILS TO CREATE USER ACCOUNT
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="USERNAME"
            className="input-field"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="name"
            placeholder="FULL NAME"
            className="input-field"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <select
            name="address"
            className="input-field"
            value={formData.address}
            onChange={handleChange}
            required
          >
            <option value="">SELECT ADDRESS</option>
            <option value="Naxal">Naxal</option>
            <option value="Baneshwor">Baneshwor</option>
            <option value="Koteshwor">Koteshwor</option>
            <option value="Balkhu">Balkhu</option>
            <option value="Boudha">Boudha</option>
          </select>

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
            onBlur={() => setPasswordTouched(true)}
            required
          />
          {passwordTouched && !validatePassword(formData.password) && (
            <p className="text-sm text-red-600">
              Password must contain at least 7 characters, 1 number, and 1 special character.
            </p>
          )}

          <input
            type="password"
            name="confirmPassword"
            placeholder="CONFIRM PASSWORD"
            className="input-field"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            SIGN UP
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

        <p className="mt-2 text-center text-sm text-gray-700">
          Want to register as a garbage collector?{" "}
          <span
            onClick={() => navigate('/signup/garbage-collector')}
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
          >
            Click here
          </span>
        </p>
      </div>

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

export default UserSignup;
