import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import baseurl from "../BaseUrl";

const SignUp = () => {
  const [formdata, setformdata] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
  });

  const navi = useNavigate();

  const handleChange = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    sendingdata();
    setformdata({
      name: "",
      email: "",
      password: "",
      age: "",
      gender: "",
    });
  };

  const sendingdata = async () => {
    try {
      const res = await axios.post(`${baseurl}/user/senddata`, formdata);
      alert(res.data.message);
      localStorage.setItem("email", formdata.email);
      navi("/otp");
    } catch (error) {
      const res = error.response?.data?.message;
      alert(res);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-300 via-pink-200 to-yellow-200">
      <form
        onSubmit={handlesubmit}
        className="bg-white px-10 py-12 rounded-3xl shadow-2xl w-full max-w-lg space-y-7 border border-pink-300"
      >
        <h2 className="text-3xl font-extrabold text-center text-pink-600 drop-shadow-sm">
          Create Your Account
        </h2>

        {/* Name */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={formdata.name}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formdata.email}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
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
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>

        {/* Age */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Age
          </label>
          <input
            type="number"
            name="age"
            placeholder="18"
            value={formdata.age}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Gender
          </label>
          <select
            name="gender"
            value={formdata.gender}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-pink-500 text-white py-3 text-lg font-bold rounded-xl hover:bg-pink-600 transition duration-200"
        >
          Sign Up
        </button>

        {/* Login Link */}
        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-pink-600 font-semibold hover:underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
