import Sidebar from "../../commons/Sidebar/Sidebar";
import { useState } from "react";
import { MdDashboard, MdAddBox, MdHistory, MdPerson } from "react-icons/md";
import BotanistProfile from "./BotanistProfile";
import Navbar from "../../commons/Sidebar/Navbar";


const botanistNavItems = [
  { id: "dashboard", label: "Dashboard", icon: <MdDashboard size={20} /> },
  { id: "new_submission", label: "New Submission", icon: <MdAddBox size={20} /> },
  { id: "my_submissions", label: "My Submissions", icon: <MdHistory size={20} /> },
  { id: "my_profile", label: "My Profile", icon: <MdPerson size={20} /> },
];

export default function BotanistLayout() {
  const [activeTab, setActiveTab] = useState("my_profile");

  return (
    <div className="flex min-h-screen bg-[#f8faf9]">
      {/* 1. Dynamic Reusable Sidebar */}
      <Sidebar
        portalLabel="Botanist Portal"
        navItems={botanistNavItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notificationCount={3}
        onLogout={() => console.log("Logout triggered")}
      />

      {/* 2. Main Work Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Dynamic Header */}
        <Navbar
          title="My Profile"
          subtitle="Manage your account and credentials"
          user={{ name: "Dr. Ahmad Khan", initials: "DA" }}
          hasUnreadNotifications={true}
          onSearch={(query) => console.log("Searching:", query)}
        />

        {/* Main Body View */}
        <main className="p-8 flex-1 overflow-y-auto">
          {activeTab === "my_profile" && <BotanistProfile />}
          {activeTab !== "my_profile" && (
            <div className="text-gray-400 text-sm">View for {activeTab} coming soon...</div>
          )}
        </main>
      </div>
    </div>
  );
}