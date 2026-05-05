import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosMail } from "react-icons/io";
import { registerUser } from "../services/authService";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    country: "",
    state: "",
    city: "",
    zip: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.address ||
      !form.country ||
      !form.state ||
      !form.city ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill all required fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        firstname: form.firstName,
        lastname: form.lastName,
        email: form.email.toLowerCase().trim(),
        address: form.address,
        country: form.country,
        state: form.state,
        city: form.city,
        zip: form.zip,
        password: form.password,
      };

      await registerUser(payload);

      setSuccess("Account created successfully 🎉");
      setTimeout(() => navigate("/signin"), 1000);
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          err.response?.data?.message ||
          err.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-2xl">
            <img
              src="./logo.png"
              alt="logo"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <h2 className="text-3xl font-semibold text-center text-gray-950 mb-2">
          Create your account
        </h2>
        <p className="text-center text-sm mb-4 text-gray-500">
          Sign up to start managing tasks with your team
        </p>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mb-3">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm">First name*</label>
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={form.firstName}
                onChange={handleChange}
                autoComplete="given-name"
                className="block w-full px-3 py-2 rounded-md border-2 border-gray-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm">Last name*</label>
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={form.lastName}
                onChange={handleChange}
                autoComplete="family-name"
                className="block w-full px-3 py-2 rounded-md border-2 border-gray-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label>Address*</label>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              autoComplete="street-address"
              className="w-full px-4 py-2 border-2 border-gray-500 rounded-md outline-none"
            />
          </div>

         <div>
  <label className="block text-sm mb-1">Email*</label>

  <div className="relative">
    {/* Mail Icon */}
    <IoIosMail
      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"
    />

    {/* Input */}
    <input
      type="email"
      name="email"
      placeholder="Email address"
      value={form.email}
      onChange={handleChange}
      autoComplete="email"
      className="w-full pl-10 pr-4 py-2 border-2 border-gray-500 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
    />
  </div>
</div>

          <div>
            <label className="block text-sm text-gray-950 mb-2">Country</label>
            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              autoComplete="country-name"
              className="block w-full px-3 py-2.5 border border-gray-400 text-sm rounded-md outline-none"
            >
              <option value="">Select Country</option>
              <option>India</option>
              <option>USA</option>
              <option>UK</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-sm text-gray-950 mb-2">State</label>
              <select
                name="state"
                value={form.state}
                onChange={handleChange}
                autoComplete="address-level1"
                className="block w-full px-3 py-2.5 bg-gray-100 border border-gray-400 text-sm rounded-md outline-none"
              >
                <option value="">State</option>
                <option>MP</option>
                <option>UP</option>
                <option>Rajasthan</option>
                <option>Maharashtra</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-950 mb-2">City</label>
              <select
                name="city"
                value={form.city}
                onChange={handleChange}
                autoComplete="address-level2"
                className="block w-full px-3 py-2.5 bg-gray-100 border border-gray-400 text-sm rounded-md outline-none"
              >
                <option value="">City</option>
                <option>Jaipur</option>
                <option>Mumbai</option>
                <option>Indore</option>
                <option>Bhopal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-gray-500 text-sm">Zip Code</label>
            <input
              type="text"
              name="zip"
              placeholder="Zip Code"
              value={form.zip}
              onChange={handleChange}
              autoComplete="postal-code"
              className="w-full px-4 py-2 border-2 border-gray-500 rounded-md outline-none"
            />
          </div>

          <div>
            <label className="text-gray-500 text-sm">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              className="w-full px-4 py-2 border-2 border-gray-500 rounded-md outline-none"
            />
          </div>

          <div>
            <label className="text-gray-500 text-sm">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              className="w-full px-4 py-2 border-2 border-gray-500 rounded-md outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/signin")}
            className="text-blue-600 cursor-pointer ml-1"
          >
            Back to login
          </span>
        </p>
      </div>
    </div>
  );
}
