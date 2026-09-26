import React, { useState } from "react";
import Sidebar from "../../commons/Sidebar/Sidebar";
import Navbar from "../../commons/Sidebar/Navbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/slices/authSlice";
import { usePreventBackLogout } from '../../../hooks/usePreventBackLogout';
import { 
  MdDashboard, 
  MdPeople, 
  MdVerifiedUser, 
  MdEco, 
  MdAssignment, 
  MdSettings, 
  MdPerson,
  MdLogout 
} from "react-icons/md";

const adminNavItems = [
  { id: "dashboard", label: "Dashboard", path: "/admin/dashboard", icon: <MdDashboard size={20} /> },
  { id: "application", label: "Applications", path: "/admin/application", icon: <MdVerifiedUser size={20} /> },
  { id: "verification", label: "Verification", path: "/admin/verification", icon: <MdVerifiedUser size={20} /> },
  { id: "herbarium_records", label: "Herbarium Database", path: "/admin/herbarium-records", icon: <MdEco size={20} /> },
  // { id: "settings", label: "System Settings", path: "/admin/settings", icon: <MdSettings size={20} /> },
  { id: "my_profile", label: "My Profile", path: "/admin/profile", icon: <MdPerson size={20} /> },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Modal State for Logout Confirmation
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  usePreventBackLogout();

  const getPageHeaderDetails = () => {
    switch (location.pathname) {
      case "/admin/dashboard":
        return { 
          title: "Admin Dashboard", 
          subtitle: "Overview of platform metrics, user activity, and verification queue" 
        };
      case "/admin/application":
        return { 
          title: "Applications", 
          subtitle: "Review, verify, or reject Botanist Applications" 
        };
      case "/admin/verification":
        return { 
          title: "Verification", 
          subtitle: "Review, verify, or reject submitted plant specimen records" 
        };
      case "/admin/herbarium-records":
        return { 
          title: "Herbarium Database", 
          subtitle: "Manage all digitized botanical specimen records in the system" 
        };
      case "/admin/settings":
        return { 
          title: "System Settings", 
          subtitle: "Configure platform defaults, AI thresholds, and database options" 
        };
      case "/admin/profile":
      default:
        return { 
          title: "Admin Profile", 
          subtitle: "Manage your administrator account details and security settings" 
        };
    }
  };

  const { title, subtitle } = getPageHeaderDetails();

  // Triggered when clicking logout in Sidebar
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  // Triggered when confirming inside the modal
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
        portalLabel="Admin Portal"
        navItems={adminNavItems}
        currentPath={location.pathname}
        onNavigate={(path) => navigate(path)}
        notificationCount={5}
        onLogout={handleLogoutClick}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar
          title={title}
          subtitle={subtitle}
          user={{ name: "Admin Portal", initials: "AP" }}
          hasUnreadNotifications={true}
          onSearch={(query) => console.log("Admin Global Search:", query)}
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

            {/* Modal Heading & Description */}
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