"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({ username: "", password: "" });
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/user/login/", form);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid username or password");
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

      {/* Left Player Silhouette */}
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

      {/* Right Player Silhouette */}
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

      {/* Football icons and floating graphics */}
      <div className="absolute top-20 left-20 opacity-30 animate-bounce hidden md:block">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
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

      {/* Main Content */}
      <div className="w-full max-w-6xl flex items-center justify-center relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center w-full">
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
              </svg>
            </div>
            <h1 className="text-5xl font-bold drop-shadow-lg">Welcome Back!</h1>
            <p className="text-2xl text-green-100 font-medium">
              ⚽ Ready to Hit the Field?
            </p>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex flex-col justify-center">
            <form
              onSubmit={handleSubmit}
              className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 w-full max-w-md mx-auto"
            >
              <div className="space-y-5">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Enter your credentials to continue
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                {/* Username */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                    <input
                      type="text"
                      name="username"
                      placeholder="Enter your username"
                      value={form.username}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full pl-11 pr-12 py-3 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-lg transition duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <span>⚡ Sign In Now</span>
                  )}
                </button>

                {/* Register Link */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Don’t have an account?{" "}
                    <span
                      onClick={() => router.push("/register")}
                      className="text-green-600 font-bold hover:text-green-700 transition cursor-pointer underline"
                    >
                      Create one here
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
