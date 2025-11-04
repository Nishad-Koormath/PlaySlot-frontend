"use client";

import { useEffect, useState } from "react";
import { MapPin, Info, Sun, Moon, Image as ImageIcon } from "lucide-react";
import { toast, Toaster } from "sonner";
import api from "@/lib/api";

interface Turf {
  id: number;
  name: string;
  location: string;
  description: string;
  day_price_per_hour: string;
  night_price_per_hour: string;
  images: { id: number; image: string }[];
  is_active?: boolean;
}

export default function PublicTurfList() {
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const res = await api.get("/turfs/");
        const data = res.data;
        const activeTurfs = data.filter((t: Turf) => t.is_active !== false);
        setTurfs(activeTurfs);
        if (activeTurfs.length > 0) {
          toast.success(
            `Loaded ${activeTurfs.length} turf${
              activeTurfs.length > 1 ? "s" : ""
            } ⚽`
          );
        }
      } catch (error) {
        console.error("Error loading turfs:", error);
        toast.error("Failed to load turfs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchTurfs();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-green-900 via-green-700 to-emerald-600 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-6xl">
          <div className="absolute left-1/2 -translate-x-1/2 w-64 h-64 border-4 border-white rounded-full"></div>
          <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full"></div>
          <div className="absolute left-0 right-0 h-1 bg-white"></div>
        </div>
      </div>

      <div className="absolute top-10 right-20 opacity-20 animate-bounce hidden lg:block">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
          <circle cx="12" cy="12" r="10" />
          <path
            d="M12 2L14 8L20 8L15 12L17 18L12 14L7 18L9 12L4 8L10 8L12 2Z"
            fill="#22c55e"
          />
        </svg>
      </div>

      <div className="absolute bottom-20 left-20 opacity-20 animate-pulse hidden lg:block">
        <svg
          width="50"
          height="50"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2L14 8L20 8L15 12L17 18L12 14L7 18L9 12L4 8L10 8L12 2Z" />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-4 md:p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-8 mb-6 border border-white/20">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-linear-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="white"
                  strokeWidth="2"
                  fill="transparent"
                />
                <path
                  d="M12 2L14 7L19 7L15.5 10.5L17 15L12 12L7 15L8.5 10.5L5 7L10 7L12 2Z"
                  fill="white"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                🏟️ Explore Our Turfs
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Find the perfect turf for your next game
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    {turfs.length}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Available</p>
                  <p className="text-sm font-bold text-gray-800">Turfs</p>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-blue-50 to-sky-50 rounded-lg p-4 border-2 border-blue-200">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">⚽</span>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Premium</p>
                  <p className="text-sm font-bold text-gray-800">Quality</p>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-yellow-50 to-amber-50 rounded-lg p-4 border-2 border-yellow-200">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">⭐</span>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Top Rated</p>
                  <p className="text-sm font-bold text-gray-800">4.8/5.0</p>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-lg p-4 border-2 border-purple-200">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">📍</span>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Multiple</p>
                  <p className="text-sm font-bold text-gray-800">Locations</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-20 text-center border border-white/20">
            <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading turfs...</p>
          </div>
        ) : turfs.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-12 text-center border border-white/20">
            <div className="w-20 h-20 bg-linear-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🏟️</span>
            </div>
            <p className="text-xl font-bold text-gray-800 mb-2">
              No turfs available
            </p>
            <p className="text-sm text-gray-600">
              Check back soon for new listings!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {turfs.map((turf) => (
              <div
                key={turf.id}
                className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/20 group"
              >
                <div className="h-48 w-full bg-linear-to-br from-green-100 to-emerald-100 relative overflow-hidden">
                  {turf.images && turf.images.length > 0 ? (
                    <img
                      src={turf.images[0].image}
                      alt={turf.name}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-green-600">
                      <ImageIcon className="w-16 h-16 mb-2" />
                      <span className="text-sm font-medium">No image</span>
                    </div>
                  )}

                  <div className="absolute top-3 right-3">
                    <div className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/90 text-white backdrop-blur-sm">
                      ⚡ Available
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                    ⚽ {turf.name}
                  </h2>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span>{turf.location}</span>
                  </div>

                  {turf.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {turf.description}
                    </p>
                  )}

                  <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-lg p-3 mb-4 border-2 border-green-200">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Sun className="w-5 h-5 text-yellow-500" />
                        <div>
                          <p className="text-xs text-gray-600">Day Rate</p>
                          <p className="text-sm font-bold text-gray-800">
                            ₹{Number(turf.day_price_per_hour).toFixed(0)}/hr
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Moon className="w-5 h-5 text-indigo-500" />
                        <div>
                          <p className="text-xs text-gray-600">Night Rate</p>
                          <p className="text-sm font-bold text-gray-800">
                            ₹{Number(turf.night_price_per_hour).toFixed(0)}/hr
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => (window.location.href = `/turfs/${turf.id}`)}
                    className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-3 rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                  >
                    <Info className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
