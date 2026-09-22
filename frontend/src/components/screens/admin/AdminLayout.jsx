import React from "react";
import Sidebar from "../../commons/Sidebar/Sidebar";
import Navbar from "../../commons/Sidebar/Navbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  MdDashboard, 
  MdPeople, 
  MdVerifiedUser, 
  MdEco, 
  MdAssignment, 
  MdSettings, 
  MdPerson 
} from "react-icons/md";

const adminNavItems = [
  { 
    id: "dashboard", 
    label: "Dashboard", 
    path: "/admin/dashboard", 
    icon: <MdDashboard size={20} /> 
  },
  { 
    id: "application", 
    label: "Applications", 
    path: "/admin/application", 
    icon: <MdVerifiedUser size={20} /> 
  },
   { 
    id: "verification", 
    label: "Verification", 
    path: "/admin/verification", 
    icon: <MdVerifiedUser size={20} /> 
  },
  { 
    id: "herbarium_records", 
    label: "Herbarium Database", 
    path: "/admin/herbarium-records", 
    icon: <MdEco size={20} /> 
  },

  { 
    id: "settings", 
    label: "System Settings", 
    path: "/admin/settings", 
    icon: <MdSettings size={20} /> 
  },
  { 
    id: "my_profile", 
    label: "My Profile", 
    path: "/admin/profile", 
    icon: <MdPerson size={20} /> 
  },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Map header titles dynamically based on active admin sub-route
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

  const handleLogout = () => {
    // Clear auth session / tokens if stored in localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#f8faf9]">
      {/* 1. Persistent Fixed Sidebar */}
      <Sidebar
        portalLabel="Admin Portal"
        navItems={adminNavItems}
        currentPath={location.pathname}
        onNavigate={(path) => navigate(path)}
        notificationCount={5}
        onLogout={handleLogout}
      />

      {/* 2. Main Content Layout */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Persistent Fixed Header */}
        <Navbar
          title={title}
          subtitle={subtitle}
          user={{ name: "Admin Portal", initials: "AP" }}
          hasUnreadNotifications={true}
          onSearch={(query) => console.log("Admin Global Search:", query)}
        />

        {/* Dynamic Route View */}
        <main className="p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}