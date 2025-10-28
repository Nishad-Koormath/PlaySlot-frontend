"use client";

import api from "@/lib/api";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    password2: "",
    is_turf_owner: false,
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type == "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/user/register/", form);

      const loginRes = await api.post("/user/login/", {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("access", loginRes.data.access);
      localStorage.setItem("refresh", loginRes.data.refresh);

      router.push("/");
      
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.error ||
          "Registration failed"
      );
    }
  };

  return (
    <div className="flex item-center justify-center min-h-screen bg-gray-50">
      <form
        action=""
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md
        w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Create Account</h1>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="input"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="input"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          className="input"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password2"
          placeholder="Confirm password"
          className="input"
          onChange={handleChange}
          required
        />
        <label htmlFor="" className="flex items-center gap-2 text-sm mt-2">
          <input type="checkbox" name="is_turf_owner" onChange={handleChange} />
          Register as Turf Owner
        </label>

        <button
          type="submit"
          className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          Register
        </button>
      </form>
    </div>
  );
}
