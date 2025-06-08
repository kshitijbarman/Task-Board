import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { FaBars } from "react-icons/fa";
import axios from "axios";
import baseurl from "../BaseUrl";
import { getAuthHeaders } from "../utils/authHeaders";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const count = useSelector((state) => state.counter.value);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const dropdownRef = useRef(null);

  const userEmail = localStorage.getItem("email");

  const [profileData, setProfileData] = useState({
    name: "",
    age: "",
    email: userEmail || "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    email: userEmail || "",
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    try {
      const res = await axios.put(
        `${baseurl}/user/update-profile`,
        profileData,
        getAuthHeaders()
      );
      alert(res.data.message);
      setEditModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Error updating profile");
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordReset = async () => {
    try {
      const res = await axios.post(
        `${baseurl}/user/reset-password`,
        passwordData,
        getAuthHeaders()
      );
      alert(res.data.message);
      setPasswordModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Error resetting password");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="text-2xl font-bold text-indigo-600 tracking-wide">
        🌟Task Board
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-300 px-4 py-1 rounded-full text-indigo-600 text-sm font-semibold transition"
        >
          LogOut
        </button>

        <div ref={dropdownRef} className="relative">
          <FaBars
            className="text-2xl text-indigo-600 cursor-pointer hover:text-indigo-800"
            onClick={() => setMenuOpen(!menuOpen)}
          />
          {menuOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white border rounded-xl shadow-lg overflow-hidden z-50">
              <button
                onClick={() => {
                  setEditModal(true);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-indigo-50 text-sm text-gray-700"
              >
                ✏️ Edit Profile
              </button>
              <button
                onClick={() => {
                  setPasswordModal(true);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-indigo-50 text-sm text-gray-700"
              >
                🔐 Reset Password
              </button>
              <button className="w-full text-left px-4 py-3 hover:bg-indigo-50 text-sm text-gray-700">
                ⚙️ Settings
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-[90%] max-w-md shadow-2xl space-y-4">
            <h2 className="text-xl font-semibold text-center text-indigo-600">
              Edit Profile
            </h2>

            <input
              name="name"
              placeholder="Name"
              value={profileData.name}
              onChange={handleProfileChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
            />

            <input
              name="age"
              placeholder="Age"
              value={profileData.age}
              onChange={handleProfileChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
            />

            <input
              type="email"
              value={profileData.email}
              readOnly
              className="w-full border border-gray-200 px-4 py-2 rounded-lg bg-gray-100 cursor-not-allowed"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {passwordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-[90%] max-w-md shadow-2xl space-y-4">
            <h2 className="text-xl font-semibold text-center text-indigo-600">
              Reset Password
            </h2>

            <input
              type="email"
              value={passwordData.email}
              readOnly
              className="w-full border border-gray-200 px-4 py-2 rounded-lg bg-gray-100 cursor-not-allowed"
            />

            <input
              type="password"
              name="oldPassword"
              placeholder="Old Password"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
            />

            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPasswordModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordReset}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Change
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
