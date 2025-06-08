import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import baseurl from "../BaseUrl";

const LogIn = () => {
  const [formdata, setformdata] = useState({
    email: "",
    password: "",
  });

  const navi = useNavigate();

  const handleChange = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    senddata();
    setformdata({
      email: "",
      password: "",
    });
  };

  const senddata = async () => {
    try {
      const res = await axios.post(`${baseurl}/user/logindata`, formdata);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("email", res.data.email);
      alert(res.data.message);
      navi("/main");
    } catch (error) {
      const val = error.response?.data?.message;
      alert(val);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-50 px-10 py-12 rounded-3xl shadow-xl border border-gray-200 w-full max-w-md space-y-7"
      >
        <h2 className="text-3xl font-bold text-center text-gray-700">
          Welcome Back
        </h2>

        {/* Email */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formdata.email}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formdata.password}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-xl text-lg font-bold hover:bg-blue-600 transition duration-200"
        >
          Log In
        </button>

        {/* Sign Up Link */}
        <p className="text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <Link to="/" className="text-blue-600 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LogIn;
