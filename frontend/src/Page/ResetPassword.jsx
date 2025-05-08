import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import bgImage from '../assets/backgroundimage.png';
import logo from '../assets/logo.png';
import { toast } from 'react-hot-toast';
const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { state } = useLocation();
    const { email, otp } = state || {};
    const navigate = useNavigate();

    if (!email || !otp) {
        navigate('/forgot-password');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        try {
            await axios.post('http://localhost:3000/api/users/reset-password', {
                email,
                otp,
                newPassword: password
            });
            toast.success("Password Reset Successfully", {
                duration: 3000,
                position: 'top-right',
            });
            navigate('/login');

        } catch (error) {

            // Error toast notification
            toast.error(error.response?.data?.message || 'Password reset failed. Please try again.', {
                duration: 3000,
                position: 'top-right',
            });
        }
        setIsLoading(false);
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center px-6"
            style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="absolute inset-0 bg-black opacity-50"></div>

            <div className="relative z-10 w-full max-w-md p-8 bg-white bg-opacity-90 shadow-lg rounded-lg">
                <div className="flex justify-center mb-4">
                    <img src={logo} alt="Logo" style={{ height: '100px', width: 'auto' }} />
                </div>

                <h2 className="text-center text-2xl font-bold text-green-700">RESET PASSWORD</h2>
                <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="New Password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
                {message && <p className="mt-4 text-center text-red-600">{message}</p>}
            </div>
        </div>
    );
};

export default ResetPassword;