import React, { useState } from "react";
import { 
  MdEdit, 
  MdCameraAlt, 
  MdMail, 
  MdPhone, 
  MdLocationOn 
} from "react-icons/md";
import { FiExternalLink } from "react-icons/fi";
import { FaGraduationCap } from "react-icons/fa";

// Initial static mock data (Ready to be replaced with API props later)
const INITIAL_PROFILE_DATA = {
  name: "Dr. Ahmad Hassan Khan",
  initials: "AK",
  title: "PhD Botany (Ethnobotany) · University of Karachi — Department of Botany",
  email: "ahmad.khan@unikarachi.edu.pk",
  phone: "+92 300 1234567",
  location: "Karachi, Sindh",
  bio: "Specialising in Pakistani medicinal flora with extensive fieldwork across Sindh, Punjab and KPK. Published 34 peer-reviewed papers on indigenous plant utilisation and biodiversity conservation.",
  researchGateUrl: "https://researchgate.net",
  stats: {
    totalSubmissions: 87,
    acceptedRecords: 61,
    acceptanceRate: "70%",
    yearsActive: 4,
  },
  credentials: {
    qualification: "PhD Botany (Ethnobotany)",
    specialisation: "Ethnobotany, Plant Taxonomy",
    experience: "12 years",
    institution: "University of Karachi — Department of Botany",
  },
};

const BotanistProfile = ({ profile = INITIAL_PROFILE_DATA }) => {
  // Toggle states for Account Settings
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsAlerts: false,
    publicProfile: true,
    twoFactorAuth: false,
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5 font-sans">
      
      {/* 1. Header Profile Info Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          
          <div className="flex items-start gap-4">
            {/* Avatar block with badge camera icon */}
            <div className="relative">
              <div className="w-20 h-20 bg-[#00a859] text-white font-bold text-2xl rounded-2xl flex items-center justify-center shadow-sm">
                {profile.initials}
              </div>
              <button 
                type="button" 
                className="absolute -bottom-1 -right-1 bg-[#008647] hover:bg-[#006e3a] text-white p-1.5 rounded-full border-2 border-white transition-colors"
                title="Change Avatar"
              >
                <MdCameraAlt size={13} />
              </button>
            </div>

            {/* Profile main details */}
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                {profile.name}
              </h2>
              <p className="text-xs font-medium text-gray-500">
                {profile.title}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1">
                <span className="flex items-center gap-1.5">
                  <MdMail className="text-gray-400" size={14} /> 
                  {profile.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <MdPhone className="text-gray-400" size={14} /> 
                  {profile.phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <MdLocationOn className="text-gray-400" size={14} /> 
                  {profile.location}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <button className="flex items-center gap-1.5 px-3.5 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs">
            <MdEdit size={14} /> Edit Profile
          </button>
        </div>

        {/* Bio Section */}
        <div className="mt-5 border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-600 leading-relaxed max-w-4xl">
            {profile.bio}
          </p>
          
          <div className="mt-3">
            <a
              href={profile.researchGateUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#00a859] hover:underline"
            >
              <FiExternalLink size={13} /> ResearchGate Profile
            </a>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100/80 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="text-3xl font-bold text-[#00a859]">
            {profile.stats.totalSubmissions}
          </div>
          <div className="text-[11px] font-semibold text-gray-400 mt-1 uppercase tracking-wider">
            Total Submissions
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100/80 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="text-3xl font-bold text-[#00a859]">
            {profile.stats.acceptedRecords}
          </div>
          <div className="text-[11px] font-semibold text-gray-400 mt-1 uppercase tracking-wider">
            Accepted Records
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100/80 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="text-3xl font-bold text-[#00a859]">
            {profile.stats.acceptanceRate}
          </div>
          <div className="text-[11px] font-semibold text-gray-400 mt-1 uppercase tracking-wider">
            Acceptance Rate
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100/80 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="text-3xl font-bold text-[#00a859]">
            {profile.stats.yearsActive}
          </div>
          <div className="text-[11px] font-semibold text-gray-400 mt-1 uppercase tracking-wider">
            Years Active
          </div>
        </div>
      </div>

      {/* 3. Bottom Grid: Credentials & Account Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Credentials Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <FaGraduationCap className="text-gray-700" size={18} />
              <h3 className="text-sm font-bold text-gray-900">Credentials</h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-start pb-3 border-b border-gray-100">
                <span className="text-gray-400 font-medium">Qualification</span>
                <span className="text-gray-800 font-bold text-right">
                  {profile.credentials.qualification}
                </span>
              </div>

              <div className="flex justify-between items-start pb-3 border-b border-gray-100">
                <span className="text-gray-400 font-medium">Specialisation</span>
                <span className="text-gray-800 font-bold text-right">
                  {profile.credentials.specialisation}
                </span>
              </div>

              <div className="flex justify-between items-start pb-3 border-b border-gray-100">
                <span className="text-gray-400 font-medium">Experience</span>
                <span className="text-gray-800 font-bold text-right">
                  {profile.credentials.experience}
                </span>
              </div>

              <div className="flex justify-between items-start pt-1">
                <span className="text-gray-400 font-medium">Institution</span>
                <span className="text-gray-800 font-bold text-right max-w-[210px] leading-tight">
                  {profile.credentials.institution}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-4">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Account Settings</h3>

          {/* Toggle: Email Notifications */}
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-xs font-bold text-gray-800">Email Notifications</p>
              <p className="text-[11px] text-gray-400">Submission status updates</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle("emailNotifications")}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                settings.emailNotifications ? "bg-[#00a859]" : "bg-gray-200"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                  settings.emailNotifications ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Toggle: SMS Alerts */}
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-xs font-bold text-gray-800">SMS Alerts</p>
              <p className="text-[11px] text-gray-400">Critical review alerts</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle("smsAlerts")}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                settings.smsAlerts ? "bg-[#00a859]" : "bg-gray-200"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                  settings.smsAlerts ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Toggle: Public Profile */}
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-xs font-bold text-gray-800">Public Profile</p>
              <p className="text-[11px] text-gray-400">Visible in contributor list</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle("publicProfile")}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                settings.publicProfile ? "bg-[#00a859]" : "bg-gray-200"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                  settings.publicProfile ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Toggle: Two-Factor Auth */}
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-xs font-bold text-gray-800">Two-Factor Auth</p>
              <p className="text-[11px] text-gray-400">Enhanced account security</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle("twoFactorAuth")}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                settings.twoFactorAuth ? "bg-[#00a859]" : "bg-gray-200"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                  settings.twoFactorAuth ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Red Change Password Button */}
          <div className="pt-2">
            <button 
              type="button"
              className="w-full py-2 border border-red-400 text-red-500 font-semibold text-xs rounded-lg hover:bg-red-50 transition-colors"
            >
              Change Password
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BotanistProfile;