"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "sonner";
import { Calendar, Clock } from "lucide-react";

export default function TurfDetailPage() {
  const { id } = useParams();
  const [turf, setTurf] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [booking, setBooking] = useState({ date: "", time: "" });

  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    const fetchTurf = async () => {
      try {
        const res = await api.get(`/turfs/${id}/`);
        setTurf(res.data);
      } catch (error) {
        toast.error("Failed to load turf details");
      } finally {
        setLoading(false);
      }
    };
    fetchTurf();
  }, [id]);

  const handleBookingSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/bookings/", {
        turf: id,
        date: booking.date,
        time: booking.time,
      });
      toast.success("Booking successful!");
      router.push("/bookings/success/");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Booking failed");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!turf) return <div className="p-8 text-center">Turf not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Turf Details */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <img
          src={turf.image}
          alt={turf.name}
          className="w-full h-64 object-cover rounded-xl"
        />
        <h1 className="text-3xl font-bold">{turf.name}</h1>
        <p className="text-gray-600">{turf.location}</p>
        <p className="text-lg font-semibold text-green-600">
          ₹{turf.price_per_hour}/hour
        </p>
        <button
          onClick={() => setShowBookingModal(true)}
          className="mt-4 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700"
        >
          Book Now
        </button>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-2xl w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Book Turf</h2>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-gray-700 mb-1">
                  <Calendar size={18} /> Date
                </label>
                <input
                  type="date"
                  value={booking.date}
                  onChange={(e) =>
                    setBooking({ ...booking, date: e.target.value })
                  }
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:outline-green-600"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 mb-1">
                  <Clock size={18} /> Time
                </label>
                <input
                  type="time"
                  value={booking.time}
                  onChange={(e) =>
                    setBooking({ ...booking, time: e.target.value })
                  }
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:outline-green-600"
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
