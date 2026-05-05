import React, { useState } from "react";
import { Button } from "@mui/material";
import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

const Signin = () => {
  const navigate = useNavigate();
  const [remember, setRemember] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!loginData.email || !loginData.password) {
      setError("Please fill all fields");
      return;
    }

    try {
      const res = await loginUser({
        email: loginData.email,
        password: loginData.password,
      });

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      navigate("/dashboard");
    } catch (err) {
      const backendMsg =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response.data : null) ||
        "Login failed";

      setError(backendMsg);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-r from-blue-50 to-blue-100 px-4 sm:px-6 lg:px-8 py-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-5 sm:p-6 md:p-8">
        {/* Logo */}
        <div className="flex justify-center mb-4 sm:mb-5">
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full overflow-hidden shadow-md">
            <img
              src="./logo.png"
              alt="logo"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
          Sign in to Task Manager
        </h2>
        <p className="text-center text-sm sm:text-base text-gray-500 mb-4 sm:mb-5">
          Welcome back! Please enter your details
        </p>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form className="space-y-4 sm:space-y-5" onSubmit={handleLogin}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
  type="email"
  name="email"
  value={loginData.email}
  onChange={handleChange}
  placeholder="Enter your email"
  autoComplete="email"
  className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
/>
             
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                  autoComplete="current-password"
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Remember / Forgot */}
          <div className="flex flex-col xs:flex-row sm:flex-row gap-2 sm:gap-0 sm:items-center sm:justify-between text-sm text-gray-600">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="w-4 h-4 border border-gray-400 rounded accent-blue-500"
              />
              Remember me
            </label>

            <Link
              to="/Forgetpassword"
              className="text-blue-500 hover:underline text-left sm:text-right"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              py: 1.3,
              borderRadius: "10px",
              fontSize: { xs: "14px", sm: "15px", md: "16px" },
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Sign in
          </Button>

          {/* Signup */}
          <p className="text-center text-sm sm:text-base text-gray-600 pt-2">
            Don&apos;t have an account?
            <Link to="/SignUp" className="text-blue-500 ml-1 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signin;

