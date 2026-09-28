import React, { useEffect, useState } from "react";

import {
    MdEdit,
    MdMail,
    MdPhone,
    MdDescription,
    MdClose,
    MdSave
} from "react-icons/md";

import {
    FiExternalLink
} from "react-icons/fi";

import {
    FaGraduationCap,
    FaBuilding,
    FaBriefcase
} from "react-icons/fa";

import {
    getMyProfileApi,
    updateMyProfileApi
} from "../../../api/profileApi";


const UserProfile = () => {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showEditModal, setShowEditModal] = useState(false);

    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [saveSuccess, setSaveSuccess] = useState("");


    // =========================================================
    // FETCH PROFILE
    // =========================================================

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getMyProfileApi();

            setData(response);

        } catch (err) {
            console.error(
                "Failed to fetch profile:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load profile"
            );

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchProfile();
    }, []);


    // =========================================================
    // SAVE PROFILE
    // =========================================================

    const handleSaveProfile = async (formData) => {

        try {

            setSaving(true);
            setSaveError("");
            setSaveSuccess("");

            await updateMyProfileApi(formData);

            // Fetch fresh data from database
            await fetchProfile();

            setSaveSuccess(
                "Profile updated successfully."
            );

            setShowEditModal(false);

        } catch (err) {

            console.error(
                "Failed to update profile:",
                err
            );

            setSaveError(
                err.response?.data?.message ||
                "Failed to update profile"
            );

        } finally {
            setSaving(false);
        }
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl p-8 text-center">
                    <p className="text-sm text-gray-500">
                        Loading profile...
                    </p>
                </div>
            </div>
        );
    }


    // =========================================================
    // ERROR
    // =========================================================

    if (error) {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl p-8 text-center">
                    <p className="text-sm text-red-500">
                        {error}
                    </p>
                </div>
            </div>
        );
    }


    if (!data) return null;


    const {
        user,
        profile,
        stats
    } = data;


    // =========================================================
    // INITIALS
    // =========================================================

    const initials = user.name
        ?.split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();


    return (
        <>
            <div className="max-w-6xl mx-auto space-y-5 font-sans">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="bg-white rounded-2xl p-6 border border-gray-100/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">

                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">

                        <div className="flex items-start gap-4">

                            {/* Avatar */}

                            <div className="w-20 h-20 bg-[#00a859] text-white font-bold text-2xl rounded-2xl flex items-center justify-center shadow-sm">
                                {initials}
                            </div>


                            {/* User information */}

                            <div className="space-y-1">

                                <div className="flex items-center gap-2">

                                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                                        {user.name}
                                    </h2>

                                    <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase">
                                        {user.role}
                                    </span>

                                </div>


                                {/* Email + phone */}

                                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1">

                                    <span className="flex items-center gap-1.5">

                                        <MdMail
                                            className="text-gray-400"
                                            size={14}
                                        />

                                        {user.email}

                                    </span>


                                    {profile.phone && (
                                        <span className="flex items-center gap-1.5">

                                            <MdPhone
                                                className="text-gray-400"
                                                size={14}
                                            />

                                            {profile.phone}

                                        </span>
                                    )}

                                </div>


                                {/* =================================================
                                    DESCRIPTION
                                ================================================= */}

                                <div className="pt-2">

                                    {profile.description ? (

                                        <div className="max-w-2xl">

                                            <p className="text-xs text-gray-600 leading-relaxed">
                                                {profile.description}
                                            </p>

                                        </div>

                                    ) : (

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowEditModal(true)
                                            }
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00a859] hover:text-[#008f4c] transition-colors"
                                        >

                                            <MdDescription size={15} />

                                            Add a description

                                        </button>

                                    )}

                                </div>

                            </div>

                        </div>


                        {/* Edit Profile */}

                        <button
                            type="button"
                            onClick={() =>
                                setShowEditModal(true)
                            }
                            className="flex items-center gap-1.5 px-3.5 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                        >

                            <MdEdit size={14} />

                            Edit Profile

                        </button>

                    </div>


                    {/* Portfolio */}

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


                {/* =================================================
                    STATISTICS
                ================================================= */}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                    <StatCard
                        value={stats.totalSubmissions}
                        label="Total Submissions"
                    />

                    <StatCard
                        value={stats.acceptedRecords}
                        label="Accepted Records"
                    />

                    <StatCard
                        value={`${stats.acceptanceRate}%`}
                        label="Acceptance Rate"
                    />

                    <StatCard
                        value={stats.yearsActive}
                        label="Years Active"
                    />

                </div>


                {/* =================================================
                    DETAILS
                ================================================= */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* Credentials */}

                    <div className="bg-white p-6 rounded-2xl border border-gray-100/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">

                        <div className="flex items-center gap-2 mb-5">

                            <FaGraduationCap
                                className="text-gray-700"
                                size={18}
                            />

                            <h3 className="text-sm font-bold text-gray-900">
                                Credentials
                            </h3>

                        </div>


                        <div className="space-y-4 text-xs">

                            <Credential
                                label="Qualification"
                                value={profile.qualification}
                            />

                            <Credential
                                label="Specialisation"
                                value={profile.specialisation}
                            />

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


                    {/* About */}

                    {/* <div className="bg-white p-6 rounded-2xl border border-gray-100/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">

                        <div className="flex items-center gap-2 mb-5">

                            <MdDescription
                                className="text-gray-700"
                                size={18}
                            />

                            <h3 className="text-sm font-bold text-gray-900">
                                About
                            </h3>

                        </div>


                        {profile.description ? (

                            <p className="text-xs text-gray-600 leading-relaxed">
                                {profile.description}
                            </p>

                        ) : (

                            <p className="text-xs text-gray-400 italic">
                                No description has been added yet.
                            </p>

                        )}

                    </div> */}

                </div>

            </div>


            {/* =====================================================
                EDIT PROFILE MODAL
            ====================================================== */}

            {showEditModal && (
                <EditProfileModal
                    user={user}
                    profile={profile}
                    onClose={() =>
                        setShowEditModal(false)
                    }
                    onSave={handleSaveProfile}
                    saving={saving}
                    error={saveError}
                />
            )}
        </>
    );
};


// =============================================================
// EDIT PROFILE MODAL
// =============================================================

const EditProfileModal = ({
    user,
    profile,
    onClose,
    onSave,
    saving,
    error
}) => {

    const [form, setForm] = useState({
        name: user.name || "",
        email: user.email || "",
        phone: profile.phone || "",
        qualification: profile.qualification || "",
        specialisation: profile.specialisation || "",
        experienceYears:
            profile.experienceYears ?? "",
        institution: profile.institution || "",
        portfolioUrl: profile.portfolioUrl || "",
        description: profile.description || ""
    });


    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    const handleSubmit = (e) => {

        e.preventDefault();

        onSave({
            name: form.name,
            phone: form.phone,
            qualification: form.qualification,
            specialisation: form.specialisation,
            experienceYears: form.experienceYears,
            institution: form.institution,
            portfolioUrl: form.portfolioUrl,
            description: form.description
        });
    };


    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">

                    <div>

                        <h2 className="text-base font-bold text-gray-900">
                            Edit Profile
                        </h2>

                        <p className="text-[11px] text-gray-400 mt-0.5">
                            Update your personal and professional information
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >

                        <MdClose size={20} />

                    </button>

                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <form onSubmit={handleSubmit}>

                    <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">

                        {/* Error */}

                        {error && (
                            <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-xs text-rose-700 font-medium">
                                {error}
                            </div>
                        )}


                        {/* Personal Information */}

                        <div>

                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">
                                Personal Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <FormField
                                    label="Full Name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />


                                <FormField
                                    label="Email"
                                    name="email"
                                    value={form.email}
                                    disabled
                                    type="email"
                                />


                                <FormField
                                    label="Phone"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="e.g. +92 300 1234567"
                                />

                            </div>

                        </div>


                        {/* Professional Information */}

                        <div>

                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">
                                Academic & Professional Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <FormField
                                    label="Qualification"
                                    name="qualification"
                                    value={form.qualification}
                                    onChange={handleChange}
                                    placeholder="e.g. MSc Botany"
                                />


                                <FormField
                                    label="Specialisation"
                                    name="specialisation"
                                    value={form.specialisation}
                                    onChange={handleChange}
                                    placeholder="e.g. Plant Taxonomy"
                                />


                                <FormField
                                    label="Experience (Years)"
                                    name="experienceYears"
                                    value={form.experienceYears}
                                    onChange={handleChange}
                                    type="number"
                                    min="0"
                                    placeholder="e.g. 5"
                                />


                                <FormField
                                    label="Institution"
                                    name="institution"
                                    value={form.institution}
                                    onChange={handleChange}
                                    placeholder="University / Institution"
                                />


                                <div className="md:col-span-2">

                                    <FormField
                                        label="Portfolio / Research URL"
                                        name="portfolioUrl"
                                        value={form.portfolioUrl}
                                        onChange={handleChange}
                                        placeholder="https://..."
                                    />

                                </div>

                            </div>

                        </div>


                        {/* Description */}

                        <div>

                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                                About / Description
                            </label>

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={5}
                                maxLength={1000}
                                placeholder="Write a short description about yourself, your botanical expertise, research interests, or professional background..."
                                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 resize-none transition-all"
                            />

                            <div className="flex justify-end mt-1">

                                <span className="text-[10px] text-gray-400">
                                    {form.description.length}/1000
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-2">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#00a859] rounded-lg hover:bg-[#008f4c] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >

                            <MdSave size={15} />

                            {saving
                                ? "Saving..."
                                : "Save Changes"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};


// =============================================================
// FORM FIELD
// =============================================================

const FormField = ({
    label,
    name,
    value,
    onChange,
    type = "text",
    placeholder = "",
    disabled = false,
    required = false,
    min
}) => {

    return (
        <div>

            <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">
                {label}
                {required && (
                    <span className="text-red-500 ml-0.5">
                        *
                    </span>
                )}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                min={min}
                className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-all ${
                    disabled
                        ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                        : "bg-white text-gray-800 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                }`}
            />

        </div>
    );
};


// =============================================================
// STAT CARD
// =============================================================

const StatCard = ({
    value,
    label
}) => (

    <div className="bg-white p-5 rounded-2xl border border-gray-100/80 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)]">

        <div className="text-3xl font-bold text-[#00a859]">
            {value}
        </div>

        <div className="text-[11px] font-semibold text-gray-400 mt-1 uppercase tracking-wider">
            {label}
        </div>

    </div>
);


// =============================================================
// CREDENTIAL
// =============================================================

const Credential = ({
    label,
    value,
    last = false
}) => {

    if (!value) return null;

    return (
        <div
            className={`flex justify-between items-start ${
                !last
                    ? "pb-3 border-b border-gray-100"
                    : "pt-1"
            }`}
        >

            <span className="text-gray-400 font-medium">
                {label}
            </span>

            <span className="text-gray-800 font-bold text-right max-w-[210px] leading-tight">
                {value}
            </span>

        </div>
    );
};


export default UserProfile;