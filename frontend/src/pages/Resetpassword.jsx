import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams(); // token from URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    // frontend validation
    if (!password || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/resetPassword/${token}`,
        { password }
      );

      setSuccess(res.data.message);

      // redirect to login after 1.5 sec
      setTimeout(() => {
        navigate("/signin");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-linear-to-r from-blue-50 to-blue-100">
      <div className="w-96 p-6 bg-white flex flex-col items-center justify-center rounded-md shadow-2xl">
        <div className="flex items-center justify-center mb-4">
          <div className="h-14 w-14 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
            TM
          </div>
        </div>

        <h2 className="text-black text-center font-bold text-xl mb-2">
          Reset Your Password
        </h2>
        <h5 className="text-gray-500 text-center text-sm mb-4">
          Enter your new password below to reset your account
        </h5>

        {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center mb-2">{success}</p>}

        <label className="text-gray-500 text-sm w-full">New Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border-2 border-gray-400 outline-none p-2 rounded mb-2"
        />

        <label className="text-gray-500 text-sm w-full">Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border-2 border-gray-400 outline-none p-2 rounded mb-4"
        />

        <button
          onClick={handleSubmit}
          className="w-full p-2 mt-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;