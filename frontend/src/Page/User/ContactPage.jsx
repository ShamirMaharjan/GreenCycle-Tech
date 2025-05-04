import React, { useState } from 'react';
import Header from "../../components/Header";
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

const ContactPage = () => {
    const [feedback, setFeedback] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Feedback submitted:', feedback);
        // Here you would typically send the feedback to a server
        alert('Thank you for your feedback!');
        setFeedback('');
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Header />

                <div className="p-6 bg-white m-6 rounded-lg shadow-sm">
                    <form onSubmit={handleSubmit} className="mb-12">
                        <div className="border border-blue-400 rounded-lg p-2">
                            <textarea
                                className="w-full h-40 resize-none outline-none p-2"
                                placeholder="WRITE YOUR FEEDBACK"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                type="submit"
                                className="bg-green-500 text-white px-6 py-2 rounded-md font-semibold"
                            >
                                SUBMIT
                            </button>
                        </div>
                    </form>

                    <div className="mt-12">
                        <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
                        <div className="flex justify-between">
                            <div className="flex flex-col gap-4">
                                <p className="text-xl">9812345678</p>
                                <p className="text-xl">9812345678</p>
                            </div>
                            <div className="flex flex-col gap-4 text-right">
                                <p className="text-xl">greencycle@gmail.com</p>
                                <p className="text-xl">Kathmandu, Nepal</p>
                            </div>
                        </div>
                        <p className="text-center mt-12 text-lg">
                            Join us in making a difference—one pickup at a time!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;