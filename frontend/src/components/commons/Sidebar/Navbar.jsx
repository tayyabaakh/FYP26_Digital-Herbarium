import React, { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getMeApi } from "../../../api/authApi";

const Navbar = ({
  title = "My Profile",
  subtitle = "Manage your account and credentials",
}) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMeApi();
        console.log( data);
        
        setUser(data.user);
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };

    fetchUser();
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";

    const words = name.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (
      words[0][0] +
      words[words.length - 1][0]
    ).toUpperCase();
  };

  const handleProfileSettings = () => {
    setIsDropdownOpen(false);
    navigate("/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100/80 px-8 flex items-center justify-between sticky top-0 z-20 font-sans">

      {/* Page Title */}
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

      {/* User */}
      <div className="relative">

        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-50 transition-colors"
        >

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-[#00a859] text-white flex items-center justify-center font-bold text-xs">
            {getInitials(user?.name)}
          </div>

          {/* Name */}
          <span className="text-xs font-semibold text-gray-700 max-w-[140px] truncate">
            {user?.name || "Loading..."}
          </span>

          <FiChevronDown
            className="text-gray-400"
            size={14}
          />

        </button>

        {/* Dropdown */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 text-xs text-gray-700 z-30">

            {/* User Details */}
            <div className="px-3 py-3 border-b border-gray-100">

              <div className="flex items-center gap-2">

                <div className="w-9 h-9 rounded-full bg-[#00a859] text-white flex items-center justify-center font-bold text-xs">
                  {getInitials(user?.name)}
                </div>

                <div className="min-w-0">

                  <p className="font-bold text-gray-900 truncate">
                    {user?.name || "User"}
                  </p>

                  <p className="text-[10px] text-gray-400 truncate">
                    {user?.email || ""}
                  </p>

                </div>

              </div>

              <span className="inline-block mt-2 px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-semibold capitalize">
                {user?.role || "user"}
              </span>

            </div>

            {/* Profile */}
            {/* <button
              onClick={handleProfileSettings}
              className="w-full text-left px-3 py-2.5 hover:bg-gray-50 hover:text-emerald-600 font-medium transition-colors"
            >
              Profile Settings
            </button> */}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2.5 hover:bg-red-50 hover:text-red-600 font-medium transition-colors"
            >
              Logout
            </button>

          </div>
        )}

      </div>

    </header>
  );
};

export default Navbar;