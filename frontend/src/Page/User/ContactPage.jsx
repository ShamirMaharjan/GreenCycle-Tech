import React from 'react';
import Header from '../../components/Header';

import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ContactPage = () => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Header />

                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Contact Support</h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h2 className="text-xl font-bold mb-4">Send Us a Message</h2>

                                <form className="space-y-4">
                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                            Subject
                                        </label>
                                        <Input id="subject" placeholder="Enter subject" />
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                            Message
                                        </label>
                                        <Textarea id="message" placeholder="Type your message here" rows={6} />
                                    </div>

                                    <Button className="bg-green-600 hover:bg-green-700">
                                        Send Message
                                    </Button>
                                </form>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-xl font-bold mb-4">Contact Information</h2>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                    <p className="mt-1">support@greencycle.com</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">Phone</p>
                                    <p className="mt-1">+977 1-4444444</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">Address</p>
                                    <p className="mt-1">Kalanki, Kathmandu, Nepal</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">Working Hours</p>
                                    <p className="mt-1">Monday - Friday: 9AM - 5PM</p>
                                    <p>Saturday: 10AM - 2PM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;