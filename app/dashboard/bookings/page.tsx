"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Loader2, Trash2, Calendar, MapPin } from "lucide-react";

interface Booking {
  id: number;
  turf: {
    id: number;
    name: string;
    location: string;
  };
  date: string;
  start_time: string;
  end_time: string;
  total_price: number;
  created_at: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/");
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await api.delete(`/bookings/${id}/`);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      toast.success("Booking deleted successfully");
    } catch (err) {
      console.error("Error deleting booking:", err);
      toast.error("Failed to delete booking");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-green-600">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Loading your bookings...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h1 className="text-2xl font-semibold mb-6 text-green-700">
        My Bookings
      </h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full text-sm">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Turf</th>
              <th className="py-3 px-4 text-left">Location</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Time</th>
              <th className="py-3 px-4 text-left">Price</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr
                key={b.id}
                className="border-b last:border-none hover:bg-green-50 transition"
              >
                <td className="py-3 px-4 font-medium">{b.turf?.name}</td>
                <td className="py-3 px-4 flex items-center gap-1 text-gray-700">
                  <MapPin className="w-4 h-4 text-green-600" />
                  {b.turf?.location}
                </td>
                <td className="py-3 px-4">{b.date}</td>
                <td className="py-3 px-4">
                  {b.start_time} - {b.end_time}
                </td>
                <td className="py-3 px-4 font-semibold text-green-600">
                  ₹{b.total_price}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="text-red-600 hover:text-red-800 transition flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
