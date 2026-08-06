import React, { useState } from "react";
import { FiSearch, FiBell, FiChevronDown } from "react-icons/fi";

const Navbar = ({
  title = "My Profile",
  subtitle = "Manage your account and credentials",
  user = {
    name: "Dr. Ahmad Khan",
    initials: "DA",
  },
  onSearch,
  hasUnreadNotifications = true,
  onNotificationClick,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100/80 px-8 flex items-center justify-between sticky top-0 z-20 font-sans">
      {/* Dynamic Title & Subtitle */}
      <div>
        <h1 className="text-lg font-bold text-gray-900 leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs font-medium text-gray-400 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Controls Area */}
      <div className="flex items-center gap-4">
        {/* Search Input Bar */}
        <div className="relative">
          <FiSearch
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            size={15}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200/80 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all w-56"
          />
        </div>

        {/* Notification Bell */}
        <button
          onClick={onNotificationClick}
          className="relative p-2 text-gray-500 hover:text-emerald-600 rounded-xl hover:bg-gray-50 transition-colors"
          title="Notifications"
        >
          <FiBell size={18} />
          {hasUnreadNotifications && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
          )}
        </button>

        {/* User Profile Pill / Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#00a859] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              {user.initials}
            </div>
            <span className="text-xs font-semibold text-gray-700 max-w-[120px] truncate">
              {user.name}
            </span>
            <FiChevronDown className="text-gray-400" size={14} />
          </button>

          {/* Quick User Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 text-xs text-gray-700 z-30">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="font-bold text-gray-900">{user.name}</p>
                <p className="text-[10px] text-gray-400 truncate">Authenticated User</p>
              </div>
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 hover:text-emerald-600 font-medium transition-colors"
              >
                Profile Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;