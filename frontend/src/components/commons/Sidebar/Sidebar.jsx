import React from "react";
import { MdNotifications, MdLogout } from "react-icons/md";
import { TbFlask } from "react-icons/tb";

const Sidebar = ({
  brandName = "Flora-Digitalis",
  brandSubtitle = "PAKISTAN",
  portalLabel = "Botanist Portal",
  brandIcon: BrandIcon = TbFlask,
  navItems = [],
  currentPath = "",
  onNavigate,
  notificationCount = 0,
  onLogout,
}) => {
  return (
    <aside className="w-64 bg-[#0a2318] text-white flex flex-col justify-between min-h-screen p-4 border-r border-[#133525] select-none">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6">
          <div className="bg-[#1b4332] p-2 rounded-lg text-emerald-400">
            <BrandIcon size={24} />
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight">{brandName}</h1>
            {brandSubtitle && (
              <span className="text-[10px] tracking-widest uppercase text-emerald-400 font-semibold block">
                {brandSubtitle}
              </span>
            )}
          </div>
        </div>

        {/* Portal Tag */}
        {portalLabel && (
          <div className="px-3 mb-6">
            <span className="inline-block px-3 py-1 bg-[#133525] text-emerald-300 text-xs font-medium rounded-full border border-emerald-900/40">
              {portalLabel}
            </span>
          </div>
        )}

        {/* Dynamic Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate && onNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#143d2b] text-emerald-400 border border-emerald-800/50 shadow-sm"
                    : "text-gray-300 hover:bg-[#133525] hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Navigation (Notifications & Logout) */}
      <div className="space-y-1 pt-4 border-t border-[#133525]">
        <button
          onClick={() => onNavigate && onNavigate("/botanist/notifications")}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            currentPath.includes("notifications")
              ? "bg-[#143d2b] text-emerald-400 border border-emerald-800/50"
              : "text-gray-300 hover:bg-[#133525] hover:text-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <MdNotifications size={20} />
            <span>Notifications</span>
          </div>
          {notificationCount > 0 && (
            <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
              {notificationCount}
            </span>
          )}
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-[#133525] hover:text-red-400 transition-all"
        >
          <MdLogout size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;