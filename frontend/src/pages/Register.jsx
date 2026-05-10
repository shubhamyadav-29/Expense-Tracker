import { useState } from "react";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import API from "../services/api";

import toast from "react-hot-toast";

const Register = () => {

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
    });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post(
        "/auth/register",
        formData
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      toast.success(
        "Registration successful"
      );

      navigate("/dashboard");

    } catch (error) {

      console.log(error);

      toast.error(
        "Registration failed"
      );

    }
  };

  return (

    <div className="h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-8 rounded-xl w-96"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">

          Register

        </h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full border p-3 mb-4 rounded"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-3 mb-4 rounded"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-3 mb-4 rounded"
          onChange={handleChange}
        />

        <button className="w-full bg-black text-white p-3 rounded hover:bg-gray-800 transition">

          Register

        </button>

        <p className="mt-4 text-center">

          Already have an account?{" "}

          <Link
            to="/"
            className="text-blue-500"
          >

            Login

          </Link>

        </p>

      </form>

    </div>

  );
};

export default Register;