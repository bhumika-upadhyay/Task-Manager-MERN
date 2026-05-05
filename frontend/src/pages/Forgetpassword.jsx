import React, { useState } from "react";
import { IoIosMail } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Email validation
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Handle submit
  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!email) return setError("Please enter your email");
    if (!validateEmail(email)) return setError("Please enter a valid email");

    try {
      // Replace with your backend endpoint
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setSuccess(res.data.message || "Reset link sent successfully");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-linear-to-r from-blue-50 to-blue-100">
      <div className="w-full max-w-md p-6 bg-white flex flex-col items-center justify-center rounded-md shadow-2xl">
        <div className="flex items-center justify-center mb-4">
          <div className="h-14 w-14 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
            TM
          </div>
        </div>

        <h5 className="text-center text-medium font-semibold text-gray-500 mb-2">
          Task Manager
        </h5>
        <h2 className="text-center font-bold text-black mb-2">
          Forget Your Password?
        </h2>
        <h6 className="text-center text-sm text-gray-500 mb-4">
          Enter your registered email address and we'll send you a reset link
        </h6>

        {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center mb-2">{success}</p>}

        <div className="w-full mb-4">
          <label htmlFor="email" className="text-sm">
            Email*
          </label>
          <div className="flex items-center border-2 border-gray-400 rounded-md mt-1">
            <IoIosMail className="ml-2 text-gray-500" />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-2 py-2 rounded-r-md focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full p-2 mt-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Send Reset Link
        </button>

        <span
          onClick={() => navigate("/signin")}
          className="text-blue-600 cursor-pointer mt-4 flex items-center justify-center hover:underline"
        >
          <FaArrowLeft className="inline-block text-blue-600 mr-1" />
          Back to login
        </span>
      </div>
    </div>
  );
};

export default ForgetPassword;

