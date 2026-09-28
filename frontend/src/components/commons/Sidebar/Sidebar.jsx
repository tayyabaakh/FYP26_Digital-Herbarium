import React, { useState } from "react";
import { MdLogout } from "react-icons/md";
import { TbFlask } from "react-icons/tb";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

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
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <aside
      className={`relative ${
        isOpen ? "w-64" : "w-20"
      } bg-[#0a2318] text-white flex flex-col justify-between min-h-screen p-4 border-r border-[#133525] select-none transition-all duration-300 ease-in-out`}
    >
      <div>
        {/* =====================================================
            TOP HEADER
        ====================================================== */}
        <div
          className={`flex items-center ${
            isOpen ? "justify-between" : "justify-center"
          } px-2 py-2 mb-6`}
        >
          {/* =====================================================
              EXPANDED BRAND
          ====================================================== */}
          {isOpen && (
            <>
              {/* Brand */}
              <div className="flex items-center gap-3">
                <div className="bg-[#1b4332] p-2 rounded-lg text-emerald-400">
                  <BrandIcon size={24} />
                </div>

                <div>
                  <h1 className="font-bold text-base leading-tight whitespace-nowrap">
                    {brandName}
                  </h1>

                  {brandSubtitle && (
                    <span className="text-[10px] tracking-widest uppercase text-emerald-400 font-semibold block">
                      {brandSubtitle}
                    </span>
                  )}
                </div>
              </div>

              {/* Collapse Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-[#1b4332] border border-[#28543f] text-emerald-300 hover:bg-[#28543f] hover:text-white transition-all duration-200 shadow-md"
                title="Collapse sidebar"
              >
                <FiChevronLeft size={16} />
              </button>
            </>
          )}

          {/* =====================================================
              COLLAPSED BRAND + TOGGLE
          ====================================================== */}
          {!isOpen && (
            <div className="flex flex-col items-center">
              {/* Expand Button */}
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="w-7 h-7 mb-2 flex items-center justify-center rounded-full bg-[#1b4332] border border-[#28543f] text-emerald-300 hover:bg-[#28543f] hover:text-white transition-all duration-200 shadow-md"
                title="Expand sidebar"
              >
                <FiChevronRight size={16} />
              </button>

              {/* Flora-Digitalis Icon */}
              <div className="bg-[#1b4332] p-2 rounded-lg text-emerald-400">
                <BrandIcon size={24} />
              </div>
            </div>
          )}
        </div>

        {/* =====================================================
            PORTAL TAG
        ====================================================== */}
        {portalLabel && isOpen && (
          <div className="px-3 mb-6">
            <span className="inline-block px-3 py-1 bg-[#133525] text-emerald-300 text-xs font-medium rounded-full border border-emerald-900/40">
              {portalLabel}
            </span>
          </div>
        )}

        {/* =====================================================
            NAVIGATION
        ====================================================== */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  onNavigate && onNavigate(item.path)
                }
                title={!isOpen ? item.label : undefined}
                className={`w-full flex items-center ${
                  isOpen
                    ? "gap-3 px-4"
                    : "justify-center px-2"
                } py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#143d2b] text-emerald-400 border border-emerald-800/50 shadow-sm"
                    : "text-gray-300 hover:bg-[#133525] hover:text-white"
                }`}
              >
                {/* Icon */}
                <span className="flex-shrink-0">
                  {item.icon}
                </span>

                {/* Label */}
                {isOpen && (
                  <span className="whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* =====================================================
          FOOTER / LOGOUT
      ====================================================== */}
      <div className="space-y-1 pt-4 border-t border-[#133525]">
        <button
          type="button"
          onClick={onLogout}
          title={!isOpen ? "Logout" : undefined}
          className={`w-full flex items-center ${
            isOpen
              ? "gap-3 px-4"
              : "justify-center px-2"
          } py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-[#133525] hover:text-red-400 transition-all`}
        >
          <MdLogout size={20} />

          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
