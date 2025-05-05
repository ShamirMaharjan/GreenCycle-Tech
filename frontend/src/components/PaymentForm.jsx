import React, { useState } from "react";
import axios from "axios";
import { generateUniqueId } from "esewajs";

const PaymentForm = () => {
    const [amount, setAmount] = useState("");

    const handlePayment = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:3000/initiate-payment", {
                amount,
                productId: generateUniqueId(),
            });

            window.location.href = response.data.url;
        } catch (error) {
            console.error("Error initiating payment:", error);
            alert("Failed to initiate payment. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
                <h1 className="text-2xl font-bold text-center mb-6 text-green-600">
                    eSewa Payment
                </h1>

                <form onSubmit={handlePayment} className="space-y-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="amount" className="text-sm font-medium text-gray-700">
                            Amount
                        </label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter amount (100)"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
                    >
                        Pay with eSewa
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PaymentForm;
