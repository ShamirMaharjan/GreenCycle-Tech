import React from 'react';
import bgImage from '../assets/backgroundimage.png';
import dustbinImage from '../assets/dustbin.png';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Top Bar */}
      <div className="w-full flex justify-between items-center p-6">
        <button
          onClick={() => navigate('/signup/user')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          SIGNUP
        </button>
        <img src={logo} alt="GreenCycle Logo" className="h-14" />
        <button
          onClick={() => navigate('/login')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          LOGIN
        </button>
      </div>

      {/* Full-width White Background Content */}
      <div className="w-full bg-white bg-opacity-95 px-6 py-10">
        {/* About Us */}
        <h2 className="text-2xl font-bold text-center text-green-800 mb-4">About Us</h2>
        <p className="text-center text-gray-700 mb-2 max-w-4xl mx-auto">
          At GreenCycle, we believe in keeping our environment clean while making waste management simple and efficient. Our platform connects households with garbage collectors, ensuring hassle-free waste collection at your doorstep.
        </p>
        <p className="text-center text-gray-700 mb-6 max-w-4xl mx-auto">
          We are committed to making waste management easier while encouraging responsible disposal and environmental awareness. By rewarding users for reporting waste dumps, we aim to create cleaner, healthier communities.
        </p>

        {/* How it works */}
        <h2 className="text-2xl font-bold text-center text-green-800 mb-8">How it works</h2>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-10 mb-8 max-w-5xl mx-auto">

          {/* Left Features */}
          <div className="flex flex-col gap-6 text-green-800 font-medium text-center sm:text-right">
            <p className="feature-text-nohover">Schedule Pickups</p>
            <p className="feature-text-nohover">View articles about waste management</p>
          </div>

          {/* Right Features */}
          <div className="flex flex-col gap-6 text-green-800 font-medium text-center sm:text-left">
            <p className="feature-text-nohover">Easy Payments</p>
            <p className="feature-text-nohover">View pickup history</p>
          </div>
        </div>

        {/* Dustbin Image Below How it Works */}
        <div className="flex justify-center mb-8 -mt-36">
          <img src={dustbinImage} alt="Dustbin" className="h-36 w-auto" />
        </div>
      </div>

      {/* Contact Section: Transparent, with background image visible */}
      <div className="w-full text-center text-white py-8 px-4">
        <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
        <p>9812345678</p>
        <p>9812345678</p>
        <p className="mt-2">greencycle@gmail.com</p>
        <p>Kathmandu, Nepal</p>
        <p className="mt-4 italic">Join us in making a difference—one pickup at a time!</p>
      </div>

      {/* Feature text style */}
      <style>{`
        .feature-text-nohover {
          padding: 10px 16px;
          border: 2px solid green;
          border-radius: 6px;
          background-color: white;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;