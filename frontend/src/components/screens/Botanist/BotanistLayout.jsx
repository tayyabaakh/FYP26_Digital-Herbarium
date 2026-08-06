import React from "react";
import Sidebar from "../../commons/Sidebar/Sidebar";
import Navbar from "../../commons/Sidebar/Navbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { MdDashboard, MdAddBox, MdHistory, MdPerson } from "react-icons/md";

const botanistNavItems = [
  { id: "dashboard", label: "Dashboard", path: "/botanist/dashboard", icon: <MdDashboard size={20} /> },
  { id: "new_submission", label: "New Submission", path: "/botanist/new-submission", icon: <MdAddBox size={20} /> },
  { id: "my_submissions", label: "My Submissions", path: "/botanist/my-submissions", icon: <MdHistory size={20} /> },
  { id: "my_profile", label: "My Profile", path: "/botanist/profile", icon: <MdPerson size={20} /> },
];

export default function BotanistLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Map route titles dynamically based on current path
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

  return (
    <div className="flex min-h-screen bg-[#f8faf9]">
      {/* 1. Persistent Fixed Sidebar */}
      <Sidebar
        portalLabel="Botanist Portal"
        navItems={botanistNavItems}
        currentPath={location.pathname}
        onNavigate={(path) => navigate(path)}
        notificationCount={3}
        onLogout={() => {
          // Add your logout logic here
          navigate("/login");
        }}
      />

      {/* 2. Main Layout Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Persistent Fixed Header */}
        <Navbar
          title={title}
          subtitle={subtitle}
          user={{ name: "Dr. Ahmad Khan", initials: "DA" }}
          hasUnreadNotifications={true}
          onSearch={(query) => console.log("Searching:", query)}
        />

        {/* Dynamic Route View Placeholder */}
        <main className="p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}