// import React from 'react'
// import { useState, useEffect } from 'react'
// import axios from 'axios'
// import { Link, useNavigate } from 'react-router'
// import baseurl from '../BaseUrl'

// const OtpVerification = () => {

//     const [data, setdata] = useState("")

//     const navi = useNavigate()

//     const handlesubmit = (e) => {
//         e.preventDefault()

//         otpcheck()
//         setdata("")
//     }

//     const email = localStorage.getItem('email')

//     const otpcheck = async() => {
//         try {
//             const res = await axios.post(`${baseurl}/user/otpverify`, {email, otp: data})
//             alert(res.data.message)
//             navi('/login')
//         } catch (error) {
//             const re = error.response?.data?.message
//             alert(re)
//         }
//     }
//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#1f1f47] via-[#2c2c5e] to-[#1a1a2e]">
//     <form onSubmit={handlesubmit} className="bg-[#2b2b55] text-white relative flex items-center flex-col max-w-md w-full mx-4 px-8 py-10 rounded-2xl shadow-lg">
//       <img
//         className="h-16 w-16 absolute -top-8"
//         src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/otp/privacyIcon.png"
//         alt="privacyIcon"
//       />
//       <h2 className="text-2xl font-semibold mb-2 text-center text-gray-300 mt-6">
//         OTP Verification
//       </h2>
//       <p className="mb-6 text-center text-sm text-gray-400">
//         Please enter the 6-digit code sent to your email
//       </p>

//       <input
//         type="text"
//         maxLength="6"
//         placeholder="Enter OTP"
//         value={data}
//         onChange={(e) => setdata(e.target.value)}
//         className="w-full text-center text-lg tracking-widest bg-[#1e1e3f] text-white border border-gray-600 rounded-md py-3 mb-6 outline-none focus:border-purple-500"
//       />

//       <button
//         type="submit"
//         className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition duration-300"
//       >
//         Verify OTP
//       </button>
//     </form>
//   </div>
//   )
// }

// export default OtpVerification



import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import baseurl from '../BaseUrl';

const OtpVerification = () => {
  const [data, setdata] = useState('');
  const navi = useNavigate();

  const email = localStorage.getItem('email');

  const handlesubmit = (e) => {
    e.preventDefault();
    otpcheck();
    setdata('');
  };

  const otpcheck = async () => {
    try {
      const res = await axios.post(`${baseurl}/user/otpverify`, { email, otp: data });
      alert(res.data.message);
      navi('/login');
    } catch (error) {
      const re = error.response?.data?.message;
      alert(re);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <form
        onSubmit={handlesubmit}
        className="bg-gray-50 text-gray-800 relative flex flex-col items-center max-w-md w-full mx-4 px-10 py-12 rounded-3xl shadow-2xl border border-gray-200"
      >
        <img
          className="h-16 w-16 absolute -top-8"
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/otp/privacyIcon.png"
          alt="privacyIcon"
        />
        <h2 className="text-3xl font-semibold mb-2 text-center text-gray-700 mt-8">OTP Verification</h2>
        <p className="mb-6 text-center text-sm text-gray-500">
          Please enter the 6-digit code sent to your email
        </p>

        <input
          type="text"
          maxLength="6"
          placeholder="Enter OTP"
          value={data}
          onChange={(e) => setdata(e.target.value)}
          className="w-full text-center text-lg tracking-widest bg-white border border-gray-300 rounded-lg py-3 mb-6 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold transition duration-300"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default OtpVerification;
