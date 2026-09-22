import React, { useEffect, useState } from "react";
import {
    MdEdit,
    MdCameraAlt,
    MdMail,
    MdPhone
} from "react-icons/md";
import { FiExternalLink } from "react-icons/fi";
import { FaGraduationCap } from "react-icons/fa";
import { getMyProfileApi } from "../../../api/profileApi";

const UserProfile = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await getMyProfileApi();
                setData(response);
            } catch (err) {
                console.error("Failed to fetch profile:", err);
                setError(
                    err.response?.data?.message || "Failed to load profile"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl p-8 text-center">
                    <p className="text-sm text-gray-500">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl p-8 text-center">
                    <p className="text-sm text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const { user, profile, stats } = data;

    const initials = user.name
        ?.split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();

    return (
        <div className="max-w-6xl mx-auto space-y-5 font-sans">
            {/* HEADER */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex items-start gap-4">
                        <div className="relative">
                            <div className="w-20 h-20 bg-[#00a859] text-white font-bold text-2xl rounded-2xl flex items-center justify-center shadow-sm">
                                {initials}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                                    {user.name}
                                </h2>
                                <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase">
                                    {user.role}
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1">
                                <span className="flex items-center gap-1.5">
                                    <MdMail className="text-gray-400" size={14} />
                                    {user.email}
                                </span>

                                {profile.phone && (
                                    <span className="flex items-center gap-1.5">
                                        <MdPhone className="text-gray-400" size={14} />
                                        {profile.phone}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="flex items-center gap-1.5 px-3.5 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <MdEdit size={14} />
                        Edit Profile
                    </button>
                </div>

                {profile.portfolioUrl && (
                    <div className="mt-4 border-t border-gray-100 pt-3">
                        <a
                            href={profile.portfolioUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#00a859] hover:underline"
                        >
                            <FiExternalLink size={13} />
                            Portfolio / Link
                        </a>
                    </div>
                )}
            </div>

            {/* STATISTICS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard value={stats.totalSubmissions} label="Total Submissions" />
                <StatCard value={stats.acceptedRecords} label="Accepted Records" />
                <StatCard value={`${stats.acceptanceRate}%`} label="Acceptance Rate" />
                <StatCard value={stats.yearsActive} label="Years Active" />
            </div>

            {/* DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white p-6 rounded-2xl border border-gray-100/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center gap-2 mb-5">
                        <FaGraduationCap className="text-gray-700" size={18} />
                        <h3 className="text-sm font-bold text-gray-900">Credentials</h3>
                    </div>

                    <div className="space-y-4 text-xs">
                        <Credential label="Qualification" value={profile.qualification} />
                        <Credential label="Specialisation" value={profile.specialisation} />
                        <Credential
                            label="Experience"
                            value={
                                profile.experienceYears
                                    ? `${profile.experienceYears} years`
                                    : null
                            }
                        />
                        <Credential
                            label="Institution"
                            value={profile.institution}
                            last
                        />
                    </div>
                </div>

                <AccountSettings />
            </div>
        </div>
    );
};

const StatCard = ({ value, label }) => (
    <div className="bg-white p-5 rounded-2xl border border-gray-100/80 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="text-3xl font-bold text-[#00a859]">{value}</div>
        <div className="text-[11px] font-semibold text-gray-400 mt-1 uppercase tracking-wider">
            {label}
        </div>
    </div>
);

const Credential = ({ label, value, last = false }) => {
    if (!value) return null;

    return (
        <div
            className={`flex justify-between items-start ${
                !last ? "pb-3 border-b border-gray-100" : "pt-1"
            }`}
        >
            <span className="text-gray-400 font-medium">{label}</span>
            <span className="text-gray-800 font-bold text-right max-w-[210px] leading-tight">
                {value}
            </span>
        </div>
    );
};

const AccountSettings = () => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-4">
            <h3 className="text-sm font-bold text-gray-900 mb-2">Account Actions</h3>
            <button
                type="button"
                className="w-full py-2 border border-red-400 text-red-500 font-semibold text-xs rounded-lg hover:bg-red-50 transition-colors"
            >
                Change Password
            </button>
        </div>
    );
};

export default UserProfile;