import React, { useState } from "react";
import Sidebar from "../../commons/Sidebar/Sidebar";
import Navbar from "../../commons/Sidebar/Navbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/slices/authSlice";
import { 
  MdDashboard, 
  MdAddBox, 
  MdHistory, 
  MdPerson, 
  MdLogout 
} from "react-icons/md";
import { usePreventBackLogout } from '../../../hooks/usePreventBackLogout';

const botanistNavItems = [
  { id: "dashboard", label: "Dashboard", path: "/botanist/dashboard", icon: <MdDashboard size={20} /> },
  { id: "new_submission", label: "New Submission", path: "/botanist/new-submission", icon: <MdAddBox size={20} /> },
  { id: "my_submissions", label: "My Submissions", path: "/botanist/my-submissions", icon: <MdHistory size={20} /> },
  { id: "my_profile", label: "My Profile", path: "/botanist/profile", icon: <MdPerson size={20} /> },
];

export default function BotanistLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Modal State for Logout Confirmation
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  usePreventBackLogout();

  const getPageHeaderDetails = () => {
    switch (location.pathname) {
      case "/botanist/dashboard":
        return { title: "Dashboard", subtitle: "Overview of your recent activity and statistics" };
      case "/botanist/new-submission":
        return { title: "New Submission", subtitle: "Submit a new botanical specimen record" };
      case "/botanist/my-submissions":
        return { title: "My Submissions", subtitle: "Track and review your submitted records" };
      case "/botanist/profile":
      default:
        return { title: "My Profile", subtitle: "Manage your account and credentials" };
    }
  };

  const { title, subtitle } = getPageHeaderDetails();

  // Step 1: Triggered when clicking logout in Sidebar
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  // Step 2: Triggered when confirming inside the modal
  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(logout());
    setShowLogoutModal(false);
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-[#f8faf9]">
      <Sidebar
        portalLabel="Botanist Portal"
        navItems={botanistNavItems}
        currentPath={location.pathname}
        onNavigate={(path) => navigate(path)}
        notificationCount={3}
        onLogout={handleLogoutClick}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar
          title={title}
          subtitle={subtitle}
          user={{ name: "Dr. Ahmad Khan", initials: "DA" }}
          hasUnreadNotifications={true}
          onSearch={(query) => console.log("Searching:", query)}
        />

        <main className="p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* --- CENTERED LOGOUT CONFIRMATION DIALOG MODAL --- */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center border border-gray-100 transform transition-all scale-100">
            {/* Warning Icon Container */}
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <MdLogout size={24} />
            </div>

            {/* Modal Heading & Subtitle */}
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Confirm Logout
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to log out of your session?
            </p>

            {/* Modal Buttons */}
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}