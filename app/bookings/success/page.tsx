"use client";

import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function BookingSuccessPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
      <CheckCircle2 className="text-green-600 w-20 h-20 mb-4" />
      <h1 className="text-3xl font-bold text-green-700 mb-2">
        Booking Confirmed!
      </h1>
      <p className="text-gray-600 mb-6">
        Your turf booking has been successfully confirmed. You’ll receive a
        confirmation email shortly.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => router.push("/dashboard/turfs")}
          className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700"
        >
          Go to Dashboard
        </button>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 border rounded-xl hover:bg-gray-100"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
