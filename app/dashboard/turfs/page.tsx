    "use client";

    import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
    import {
    Plus,
    ImageIcon,
    Trash2,
    Edit2,
    MapPin,
    Clock,
    DollarSign,
    Sun,
    Moon,
    } from "lucide-react";
    import { toast, Toaster } from "sonner";

    type TurfImage = {
    id: number;
    image: string;
    };

    type Turf = {
    id: number;
    owner: number;
    name: string;
    location: string;
    description?: string;
    day_price_per_hour: string;
    night_price_per_hour: string;
    day_start_time?: string;
    night_start_time?: string;
    is_active: boolean;
    images: TurfImage[];
    };

    type UserProfile = {
    id: number;
    username: string;
    email?: string;
    phone?: string;
    is_turf_owner: boolean;
    is_superuser?: boolean;
    };

    // Configure your API base URL
    const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

    export default function DashboardTurfsPage() {
    const [turfs, setTurfs] = useState<Turf[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState("");

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [profileLoading, setProfileLoading] = useState<boolean>(true);

    const [showModal, setShowModal] = useState<boolean>(false);
    const [creating, setCreating] = useState<boolean>(false);

    const [form, setForm] = useState({
        name: "",
        location: "",
        description: "",
        day_price_per_hour: "",
        night_price_per_hour: "",
        day_start_time: "06:00",
        night_start_time: "18:00",
    });
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    // Helper function to get auth token (adjust based on your auth implementation)
    const getAuthToken = () => {
        return localStorage.getItem("authToken") || "";
    };

    // Fetch user profile
    useEffect(() => {
        const fetchProfile = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/profile/`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                "Content-Type": "application/json",
            },
            });

            if (response.ok) {
            const data = await response.json();
            setProfile(data);
            toast.success("Profile loaded successfully");
            } else {
            console.error("Failed to fetch profile");
            toast.error("Failed to load profile");
            }
        } catch (err) {
            console.error("Error fetching profile:", err);
            toast.error("Error loading profile");
        } finally {
            setProfileLoading(false);
        }
        };

        fetchProfile();
    }, []);

    // Fetch turfs
    useEffect(() => {
        const fetchTurfs = async () => {
        setLoading(true);
        setError("");

        try {
            // Add ?owner=true query param to get only user's turfs
            const response = await fetch(`${API_BASE_URL}/turfs/?owner=true`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                "Content-Type": "application/json",
            },
            });

            if (response.ok) {
            const data = await response.json();
            setTurfs(data);
            if (data.length > 0) {
                toast.success(
                `Loaded ${data.length} turf${data.length > 1 ? "s" : ""}`
                );
            }
            } else {
            setError("Failed to load turfs. Please try again.");
            toast.error("Failed to load turfs");
            }
        } catch (err) {
            setError("Network error. Please check your connection.");
            console.error("Error fetching turfs:", err);
            toast.error("Network error. Please check your connection.");
        } finally {
            setLoading(false);
        }
        };

        if (!profileLoading) {
        fetchTurfs();
        }
    }, [profileLoading]);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const selected = Array.from(e.target.files);
        setFiles(selected);

        const urls = selected.map((f) => URL.createObjectURL(f));
        setPreviews(urls);
        toast.success(
        `${selected.length} image${selected.length > 1 ? "s" : ""} selected`
        );
    };

    useEffect(() => {
        return () => {
        previews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [previews]);

    const handleCreate = async (ev: FormEvent) => {
        ev.preventDefault();
        setCreating(true);

        if (!form.name.trim() || !form.location.trim()) {
        toast.error("Name and Location are required");
        setCreating(false);
        return;
        }

        const loadingToast = toast.loading("Creating turf...");

        try {
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("location", form.location);
        formData.append("description", form.description);
        formData.append("day_price_per_hour", form.day_price_per_hour || "0");
        formData.append("night_price_per_hour", form.night_price_per_hour || "0");
        formData.append("day_start_time", form.day_start_time);
        formData.append("night_start_time", form.night_start_time);

        // Append images
        files.forEach((file) => {
            formData.append("uploaded_images", file);
        });

        const response = await fetch(`${API_BASE_URL}/turfs/`, {
            method: "POST",
            headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            },
            body: formData,
        });

        if (response.ok) {
            const newTurf = await response.json();
            setTurfs((prev) => [newTurf, ...prev]);
            setShowModal(false);
            setForm({
            name: "",
            location: "",
            description: "",
            day_price_per_hour: "",
            night_price_per_hour: "",
            day_start_time: "06:00",
            night_start_time: "18:00",
            });
            setFiles([]);
            setPreviews([]);
            toast.success("🎉 Turf created successfully!", { id: loadingToast });
        } else {
            const errorData = await response.json();
            toast.error(`Failed to create turf: ${JSON.stringify(errorData)}`, {
            id: loadingToast,
            });
        }
        } catch (err) {
        console.error("Error creating turf:", err);
        toast.error("Network error. Please try again.", { id: loadingToast });
        } finally {
        setCreating(false);
        }
    };

    const handleDelete = async (turfId: number) => {
        const turf = turfs.find((t) => t.id === turfId);

        toast.custom(
        (t) => (
            <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
            <p className="font-semibold text-gray-800 mb-3">
                Delete "{turf?.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-2">
                <button
                onClick={() => {
                    toast.dismiss(t);
                    confirmDelete(turfId);
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                Delete
                </button>
                <button
                onClick={() => toast.dismiss(t)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold transition"
                >
                Cancel
                </button>
            </div>
            </div>
        ),
        { duration: Infinity }
        );
    };

    const confirmDelete = async (turfId: number) => {
        const loadingToast = toast.loading("Deleting turf...");

        try {
        const response = await fetch(`${API_BASE_URL}/turfs/${turfId}/`, {
            method: "DELETE",
            headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            },
        });

        if (response.ok) {
            setTurfs((prev) => prev.filter((t) => t.id !== turfId));
            toast.success("✅ Turf deleted successfully!", { id: loadingToast });
        } else {
            toast.error("Failed to delete turf.", { id: loadingToast });
        }
        } catch (err) {
        console.error("Error deleting turf:", err);
        toast.error("Network error. Please try again.", { id: loadingToast });
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-green-900 via-green-700 to-emerald-600 relative overflow-hidden">
        {/* Football Field Background Pattern */}
        <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-6xl">
            <div className="absolute left-1/2 -translate-x-1/2 w-64 h-64 border-4 border-white rounded-full"></div>
            <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full"></div>
            <div className="absolute left-0 right-0 h-1 bg-white"></div>
            </div>
        </div>

        {/* Floating Football Icons */}
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
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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
                    🏟️ My Turfs
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                    Manage your turf listings and bookings
                    </p>
                </div>
                </div>

                {!profileLoading &&
                (profile?.is_turf_owner || profile?.is_superuser) && (
                    <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                    >
                    <Plus className="w-5 h-5" /> Add New Turf
                    </button>
                )}
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg font-bold">
                        {turfs.length}
                    </span>
                    </div>
                    <div>
                    <p className="text-xs text-gray-600">Total Turfs</p>
                    <p className="text-sm font-bold text-gray-800">Active</p>
                    </div>
                </div>
                </div>

                <div className="bg-linear-to-br from-blue-50 to-sky-50 rounded-lg p-4 border-2 border-blue-200">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">📅</span>
                    </div>
                    <div>
                    <p className="text-xs text-gray-600">Bookings</p>
                    <p className="text-sm font-bold text-gray-800">
                        24 This Week
                    </p>
                    </div>
                </div>
                </div>

                <div className="bg-linear-to-br from-yellow-50 to-amber-50 rounded-lg p-4 border-2 border-yellow-200">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">⭐</span>
                    </div>
                    <div>
                    <p className="text-xs text-gray-600">Rating</p>
                    <p className="text-sm font-bold text-gray-800">4.8/5.0</p>
                    </div>
                </div>
                </div>

                <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-lg p-4 border-2 border-purple-200">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">💰</span>
                    </div>
                    <div>
                    <p className="text-xs text-gray-600">Revenue</p>
                    <p className="text-sm font-bold text-gray-800">₹45,600</p>
                    </div>
                </div>
                </div>
            </div>
            </div>

            {/* Turfs Grid */}
            {loading ? (
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-20 text-center border border-white/20">
                <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Loading your turfs...</p>
            </div>
            ) : error ? (
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-12 text-center border border-red-200">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">❌</span>
                </div>
                <p className="text-red-600 font-semibold">{error}</p>
            </div>
            ) : turfs.length === 0 ? (
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-12 text-center border border-white/20">
                <div className="w-20 h-20 bg-linear-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🏟️</span>
                </div>
                <p className="text-xl font-bold text-gray-800 mb-2">No turfs yet</p>
                <p className="text-sm text-gray-600">
                Click <strong className="text-green-600">Add New Turf</strong> to
                create your first listing.
                </p>
            </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {turfs.map((t) => (
                <div
                    key={t.id}
                    className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/20 group"
                >
                    {/* Image Section */}
                    <div className="h-48 w-full bg-linear-to-br from-green-100 to-emerald-100 relative overflow-hidden">
                    {t.images && t.images.length > 0 ? (
                        <img
                        src={t.images[0].image}
                        alt={t.name}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-green-600">
                        <ImageIcon className="w-16 h-16 mb-2" />
                        <span className="text-sm font-medium">No image</span>
                        </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                        <div
                        className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${
                            t.is_active
                            ? "bg-green-500/90 text-white"
                            : "bg-gray-500/90 text-white"
                        }`}
                        >
                        {t.is_active ? "⚡ Active" : "💤 Inactive"}
                        </div>
                    </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                        ⚽ {t.name}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span>{t.location}</span>
                    </div>

                    {t.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {t.description}
                        </p>
                    )}

                    {/* Pricing Section */}
                    <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-lg p-3 mb-4 border-2 border-green-200">
                        <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                            <Sun className="w-5 h-5 text-yellow-500" />
                            <div>
                            <p className="text-xs text-gray-600">Day Rate</p>
                            <p className="text-sm font-bold text-gray-800">
                                ₹{Number(t.day_price_per_hour).toFixed(0)}/hr
                            </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Moon className="w-5 h-5 text-indigo-500" />
                            <div>
                            <p className="text-xs text-gray-600">Night Rate</p>
                            <p className="text-sm font-bold text-gray-800">
                                ₹{Number(t.night_price_per_hour).toFixed(0)}/hr
                            </p>
                            </div>
                        </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        <button
                        onClick={() =>
                            alert(`Edit turf ${t.id} - Feature coming soon!`)
                        }
                        className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white px-4 py-2 rounded-lg transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg"
                        >
                        <Edit2 className="w-4 h-4" />
                        Edit
                        </button>
                        <button
                        onClick={() => handleDelete(t.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg"
                        >
                        <Trash2 className="w-4 h-4" />
                        Delete
                        </button>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>

        {/* Create Turf Modal */}
        {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowModal(false)}
            />
            <div className="relative bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-2xl p-6 md:p-8 z-50 max-h-[90vh] overflow-y-auto border border-white/20">
                <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-linear-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                    <Plus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Add New Turf
                    </h2>
                    <p className="text-sm text-gray-600">
                        Fill in the details below
                    </p>
                    </div>
                </div>
                <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                    ×
                </button>
                </div>

                <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Turf Name
                    </label>
                    <input
                        name="name"
                        placeholder="Champions Arena"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                        required
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Location
                    </label>
                    <input
                        name="location"
                        placeholder="Downtown Sports Complex"
                        value={form.location}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                        required
                    />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                    </label>
                    <textarea
                    name="description"
                    placeholder="Premium 5-a-side turf with floodlights..."
                    value={form.description}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    rows={3}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Sun className="w-4 h-4 text-yellow-500" />
                        Day Price (₹/hour)
                    </label>
                    <input
                        name="day_price_per_hour"
                        type="number"
                        step="0.01"
                        placeholder="1200"
                        value={form.day_price_per_hour}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    />
                    </div>
                    <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Moon className="w-4 h-4 text-indigo-500" />
                        Night Price (₹/hour)
                    </label>
                    <input
                        name="night_price_per_hour"
                        type="number"
                        step="0.01"
                        placeholder="1500"
                        value={form.night_price_per_hour}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Day Start Time
                    </label>
                    <input
                        name="day_start_time"
                        type="time"
                        value={form.day_start_time}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Night Start Time
                    </label>
                    <input
                        name="night_start_time"
                        type="time"
                        value={form.night_start_time}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    📸 Upload Images
                    </label>
                    <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    />
                    {previews.length > 0 && (
                    <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
                        {previews.map((p, idx) => (
                        <div
                            key={p}
                            className="w-24 h-20 rounded-lg overflow-hidden border-2 border-green-200 shrink-0"
                        >
                            <img
                            src={p}
                            alt={`preview-${idx}`}
                            className="w-full h-full object-cover"
                            />
                        </div>
                        ))}
                    </div>
                    )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition font-semibold"
                    >
                    Cancel
                    </button>
                    <button
                    type="submit"
                    disabled={creating}
                    className="px-6 py-3 rounded-lg bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white disabled:opacity-50 transition font-semibold shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                    {creating ? (
                        <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                        </>
                    ) : (
                        <>
                        <Plus className="w-5 h-5" />
                        Create Turf
                        </>
                    )}
                    </button>
                </div>
                </form>
            </div>
            </div>
        )}
        </div>
    );
    }
