"use client";

import { ChangeEvent, useState } from "react";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  CheckCircle2,
} from "lucide-react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface RegisterForm {
  username: string;
  email: string;
  phone: string;
  password: string;
  password2: string;
  is_turf_owner: boolean;
}

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterForm>({
    username: "",
    email: "",
    phone: "",
    password: "",
    password2: "",
    is_turf_owner: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (form.password !== form.password2) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      await api.post("/user/register/", form);
      
      toast.success("Account created successfully! Logging you in...", {
        duration: 2000,
      });

      // Auto login after registration
      const loginRes = await api.post("/user/login/", {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("access", loginRes.data.access);
      localStorage.setItem("refresh", loginRes.data.refresh);

      toast.success("Welcome aboard! Redirecting...", {
        duration: 2000,
      });

      setTimeout(() => {
        router.push("/");
      }, 500);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        err.response?.data?.username?.[0] ||
        err.response?.data?.email?.[0] ||
        err.response?.data?.phone?.[0] ||
        "Registration failed. Please try again.";
      
      toast.error(errorMessage, {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-linear-to-br from-green-900 via-green-700 to-emerald-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Football Field Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-white"></div>
        </div>
      </div>

      {/* Player Silhouettes */}
      <div className="absolute left-10 bottom-10 opacity-20 hidden lg:block">
        <svg width="150" height="200" viewBox="0 0 200 300" fill="none">
          <path
            d="M100 50C110 50 120 60 120 70C120 80 110 90 100 90C90 90 80 80 80 70C80 60 90 50 100 50Z"
            fill="white"
          />
          <path
            d="M100 90L100 180M100 120L70 150M100 120L130 150M100 180L70 240M100 180L130 240"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <circle cx="130" cy="80" r="15" fill="white" />
        </svg>
      </div>

      <div className="absolute right-10 bottom-10 opacity-20 hidden lg:block transform scale-x-[-1]">
        <svg width="150" height="200" viewBox="0 0 200 300" fill="none">
          <path
            d="M100 50C110 50 120 60 120 70C120 80 110 90 100 90C90 90 80 80 80 70C80 60 90 50 100 50Z"
            fill="white"
          />
          <path
            d="M100 90L100 180M100 120L70 150M100 120L130 150M100 180L70 240M100 180L130 240"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <circle cx="70" cy="80" r="15" fill="white" />
        </svg>
      </div>

      {/* Football Icons */}
      <div className="absolute top-20 left-20 opacity-30 animate-bounce hidden md:block">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2L14 8L20 8L15 12L17 18L12 14L7 18L9 12L4 8L10 8L12 2Z" />
        </svg>
      </div>

      <div className="absolute top-40 right-32 opacity-30 animate-pulse hidden md:block">
        <svg width="50" height="50" viewBox="0 0 24 24" fill="white">
          <circle cx="12" cy="12" r="10" />
          <path
            d="M12 2L14 8L20 8L15 12L17 18L12 14L7 18L9 12L4 8L10 8L12 2Z"
            fill="#22c55e"
          />
        </svg>
      </div>

      <div className="w-full max-w-6xl h-full flex items-center justify-center relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center w-full h-full max-h-[calc(100vh-2rem)] py-4">
          {/* Left Side - Branding */}
          <div className="text-white space-y-6 hidden md:block">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-2xl relative">
              <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#16a34a"
                  strokeWidth="2"
                  fill="white"
                />
                <path
                  d="M12 2L14 7L19 7L15.5 10.5L17 15L12 12L7 15L8.5 10.5L5 7L10 7L12 2Z"
                  fill="#16a34a"
                />
                <path d="M12 2v20M2 12h20" stroke="#16a34a" strokeWidth="0.5" />
              </svg>
              <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1.5 shadow-lg">
                <svg
                  className="w-4 h-4 text-yellow-900"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 15c3.31 0 6-2.69 6-6V3H6v6c0 3.31 2.69 6 6 6zm-6-8h12v2c0 2.21-1.79 4-4 4s-4-1.79-4-4V7zm6 13c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2z" />
                </svg>
              </div>
            </div>
            <h1 className="text-5xl font-bold drop-shadow-lg">Join The Game</h1>
            <p className="text-2xl text-green-100 font-medium">
              ⚽ Book Your Perfect Turf Today
            </p>

            <div className="space-y-4 pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">500+ Premium Turfs</h3>
                  <p className="text-green-100 text-sm">
                    Best quality football turfs
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Instant Booking</h3>
                  <p className="text-green-100 text-sm">
                    Book in seconds, play in minutes
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Best Prices</h3>
                  <p className="text-green-100 text-sm">
                    Affordable rates, premium experience
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="flex flex-col h-full justify-center max-h-[calc(100vh-4rem)]">
            {/* Mobile Header */}
            <div className="text-center mb-4 md:hidden">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-3 shadow-2xl relative">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#16a34a"
                    strokeWidth="2"
                    fill="white"
                  />
                  <path
                    d="M12 2L14 7L19 7L15.5 10.5L17 15L12 12L7 15L8.5 10.5L5 7L10 7L12 2Z"
                    fill="#16a34a"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Join The Game
              </h1>
              <p className="text-green-100">⚽ Book Your Perfect Turf</p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20 overflow-y-auto max-h-full"
            >
              <div className="space-y-3">
                {/* Two Column Layout for Desktop */}
                <div className="grid md:grid-cols-2 gap-3">
                  {/* Username */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                      <input
                        type="text"
                        name="username"
                        placeholder="Player name"
                        value={form.username}
                        onChange={handleChange}
                        className="w-full pl-8 pr-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                      <input
                        type="email"
                        name="email"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full pl-8 pr-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full pl-8 pr-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    />
                  </div>
                </div>

                {/* Two Column for Passwords */}
                <div className="grid md:grid-cols-2 gap-3">
                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Create password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full pl-8 pr-9 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Confirm
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                      <input
                        type={showPassword2 ? "text" : "password"}
                        name="password2"
                        placeholder="Confirm password"
                        value={form.password2}
                        onChange={handleChange}
                        className="w-full pl-8 pr-9 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword2(!showPassword2)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600"
                      >
                        {showPassword2 ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Turf Owner Checkbox */}
                <div className="flex items-center space-x-2 p-3 bg-linear-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                  <input
                    type="checkbox"
                    name="is_turf_owner"
                    id="is_turf_owner"
                    checked={form.is_turf_owner}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                  />
                  <label
                    htmlFor="is_turf_owner"
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-gray-900">
                        🏟️ Register as Turf Owner
                      </span>
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                    </div>
                    <p className="text-xs text-gray-600">
                      List your turf & earn revenue
                    </p>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-lg transition duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm">Creating Account...</span>
                    </>
                  ) : (
                    <span className="text-sm">⚡ Create Account Now</span>
                  )}
                </button>

                {/* Login Link */}
                <div className="text-center pt-2">
                  <p className="text-xs text-gray-600">
                    Already have account?{" "}
                    <span
                      onClick={() => router.push("/login")}
                      className="text-green-600 font-bold hover:text-green-700 transition cursor-pointer underline"
                    >
                      Sign in here
                    </span>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}