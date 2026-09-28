// import React, { useState } from "react";
// import { MdLogout } from "react-icons/md";
// import { TbFlask } from "react-icons/tb";
// import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// const Sidebar = ({
//   brandName = "KUH",
//   brandSubtitle = "Karachi University Herbarium",
//   portalLabel = "Botanist Portal",
//   brandIcon: BrandIcon = TbFlask,
//   navItems = [],
//   currentPath = "",
//   onNavigate,
//   notificationCount = 0,
//   onLogout,
//   defaultOpen = true,
// }) => {
//   const [isOpen, setIsOpen] = useState(defaultOpen);

//   return (
//     <aside
//       className={`relative ${
//         isOpen ? "w-64" : "w-20"
//       } bg-[#0a2318] text-white flex flex-col justify-between min-h-screen p-4 border-r border-[#133525] select-none transition-all duration-300 ease-in-out`}
//     >
//       <div>
//         {/* =====================================================
//             TOP HEADER
//         ====================================================== */}
//         <div
//           className={`flex items-center ${
//             isOpen ? "justify-between" : "justify-center"
//           } px-2 py-2 mb-6`}
//         >
//           {/* =====================================================
//               EXPANDED BRAND
//           ====================================================== */}
//           {isOpen && (
//             <>
//               {/* Brand */}
//               <div className="flex items-center gap-3">
//                 <div className="bg-[#1b4332] p-2 rounded-lg text-emerald-400">
//                   <BrandIcon size={24} />
//                 </div>

//                 <div>
//                   <h1 className="font-bold text-base leading-tight whitespace-nowrap">
//                     {brandName}
//                   </h1>

//                   {brandSubtitle && (
//                     <span className="text-[10px] tracking-widest uppercase text-emerald-400 font-semibold block">
//                       {brandSubtitle}
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* Collapse Button */}
//               <button
//                 type="button"
//                 onClick={() => setIsOpen(false)}
//                 className="w-7 h-7 flex items-center justify-center rounded-full bg-[#1b4332] border border-[#28543f] text-emerald-300 hover:bg-[#28543f] hover:text-white transition-all duration-200 shadow-md"
//                 title="Collapse sidebar"
//               >
//                 <FiChevronLeft size={16} />
//               </button>
//             </>
//           )}

//           {/* =====================================================
//               COLLAPSED BRAND + TOGGLE
//           ====================================================== */}
//           {!isOpen && (
//             <div className="flex flex-col items-center">
//               {/* Expand Button */}
//               <button
//                 type="button"
//                 onClick={() => setIsOpen(true)}
//                 className="w-7 h-7 mb-2 flex items-center justify-center rounded-full bg-[#1b4332] border border-[#28543f] text-emerald-300 hover:bg-[#28543f] hover:text-white transition-all duration-200 shadow-md"
//                 title="Expand sidebar"
//               >
//                 <FiChevronRight size={16} />
//               </button>

//               {/* Flora-Digitalis Icon */}
//               <div className="bg-[#1b4332] p-2 rounded-lg text-emerald-400">
//                 <BrandIcon size={24} />
//               </div>
//             </div>
//           )}
//         </div>

//         {/* =====================================================
//             PORTAL TAG
//         ====================================================== */}
//         {portalLabel && isOpen && (
//           <div className="px-3 mb-6">
//             <span className="inline-block px-3 py-1 bg-[#133525] text-emerald-300 text-xs font-medium rounded-full border border-emerald-900/40">
//               {portalLabel}
//             </span>
//           </div>
//         )}

//         {/* =====================================================
//             NAVIGATION
//         ====================================================== */}
//         <nav className="space-y-1">
//           {navItems.map((item) => {
//             const isActive = currentPath === item.path;

//             return (
//               <button
//                 key={item.id}
//                 type="button"
//                 onClick={() =>
//                   onNavigate && onNavigate(item.path)
//                 }
//                 title={!isOpen ? item.label : undefined}
//                 className={`w-full flex items-center ${
//                   isOpen
//                     ? "gap-3 px-4"
//                     : "justify-center px-2"
//                 } py-3 rounded-xl text-sm font-medium transition-all ${
//                   isActive
//                     ? "bg-[#143d2b] text-emerald-400 border border-emerald-800/50 shadow-sm"
//                     : "text-gray-300 hover:bg-[#133525] hover:text-white"
//                 }`}
//               >
//                 {/* Icon */}
//                 <span className="flex-shrink-0">
//                   {item.icon}
//                 </span>

//                 {/* Label */}
//                 {isOpen && (
//                   <span className="whitespace-nowrap">
//                     {item.label}
//                   </span>
//                 )}
//               </button>
//             );
//           })}
//         </nav>
//       </div>

//       {/* =====================================================
//           FOOTER / LOGOUT
//       ====================================================== */}
//       <div className="space-y-1 pt-4 border-t border-[#133525]">
//         <button
//           type="button"
//           onClick={onLogout}
//           title={!isOpen ? "Logout" : undefined}
//           className={`w-full flex items-center ${
//             isOpen
//               ? "gap-3 px-4"
//               : "justify-center px-2"
//           } py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-[#133525] hover:text-red-400 transition-all`}
//         >
//           <MdLogout size={20} />

//           {isOpen && <span>Logout</span>}
//         </button>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;


import React, { useState } from "react";
import { MdLogout } from "react-icons/md";
import { TbFlask } from "react-icons/tb";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Sidebar = ({
  brandName = "KUH",
  brandSubtitle = "Karachi University Herbarium",
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

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <aside
      className={`
        relative
        flex
        flex-col
        justify-between
        min-h-screen
        bg-[#0a2318]
        text-white
        border-r
        border-[#133525]
        select-none
        overflow-hidden
        p-4
        transition-[width]
        duration-300
        ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isOpen ? "w-64" : "w-20"}
      `}
    >
      {/* =====================================================
          TOP SECTION
      ====================================================== */}
      <div>
        {/* =====================================================
            HEADER
        ====================================================== */}
        <div
          className={`
            relative
            flex
            mb-6
            transition-[height]
            duration-300
            ease-in-out
            ${isOpen ? "h-12" : "h-[76px]"}
          `}
        >
          {/* =================================================
              COLLAPSED TOGGLE
          ================================================= */}
          <button
            type="button"
            onClick={toggleSidebar}
            title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            className={`
              absolute
              z-10
              w-6
              h-6
              flex
              items-center
              justify-center
              rounded-full
              bg-[#1b4332]
              border
              border-[#28543f]
              text-emerald-300
              hover:bg-[#28543f]
              hover:text-white
              shadow-md
              transition-all
              duration-200
              ease-in-out
              ${
                isOpen
                  ? "right-0 top-1"
                  : "left-1/2 -translate-x-1/2 top-0"
              }
            `}
          >
            {isOpen ? (
              <FiChevronLeft size={16} />
            ) : (
              <FiChevronRight size={16} />
            )}
          </button>

          {/* =================================================
              BRAND
          ================================================= */}
          <div
            className={`
              flex
              items-center
              transition-all
              duration-300
              ease-in-out
              ${
                isOpen
                  ? "gap-3"
                  : "absolute left-1/2 -translate-x-1/2 top-9"
              }
            `}
          >
            {/* Brand Icon */}
            <div
              className="
                flex-shrink-0
                w-10
                h-10
                flex
                items-center
                justify-center
                bg-[#1b4332]
                rounded-lg
                text-emerald-400
              "
            >
              <BrandIcon size={24} />
            </div>

            {/* Brand Information */}
            <div
              className={`
                overflow-hidden
                whitespace-nowrap
                transition-[max-width,opacity,transform]
                duration-300
                ease-in-out
                mt-2
                ${
                  isOpen
                    ? "max-w-[170px] opacity-100 translate-x-0"
                    : "max-w-0 opacity-0 -translate-x-3"
                }
              `}
            >
              <h1 className="font-bold text-base leading-tight">
                {brandName}
              </h1>

              {brandSubtitle && (
                <span className="block text-[9px] tracking-widest uppercase text-emerald-400 font-semibold">
                  {brandSubtitle}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* =====================================================
            PORTAL TAG
        ====================================================== */}
        <div
          className={`
            overflow-hidden
            px-3
            transition-[max-height,opacity,margin]
            duration-300
            ease-in-out
            ${
              isOpen
                ? "max-h-10 opacity-100 mb-6"
                : "max-h-0 opacity-0 mb-0"
            }
          `}
        >
          {portalLabel && (
            <span className="inline-block px-3 py-1 bg-[#133525] text-emerald-300 text-xs font-medium rounded-full border border-emerald-900/40 whitespace-nowrap">
              {portalLabel}
            </span>
          )}
        </div>

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
                onClick={() => onNavigate?.(item.path)}
                title={!isOpen ? item.label : undefined}
                className={`
                  w-full
                  h-12
                  flex
                  items-center
                  rounded-xl
                  text-sm
                  font-medium
                  overflow-hidden
                  transition-[background-color,color,padding,gap]
                  duration-200
                  ease-in-out
                  ${
                    isOpen
                      ? "gap-3 px-4"
                      : "justify-center px-2"
                  }
                  ${
                    isActive
                      ? "bg-[#143d2b] text-emerald-400 border border-emerald-800/50 shadow-sm"
                      : "text-gray-300 hover:bg-[#133525] hover:text-white"
                  }
                `}
              >
                {/* Icon */}
                <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                  {item.icon}
                </span>

                {/* Label */}
                <span
                  className={`
                    overflow-hidden
                    whitespace-nowrap
                    transition-[max-width,opacity,transform]
                    duration-200
                    ease-in-out
                    ${
                      isOpen
                        ? "max-w-[160px] opacity-100 translate-x-0"
                        : "max-w-0 opacity-0 -translate-x-2"
                    }
                  `}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* =====================================================
          FOOTER / LOGOUT
      ====================================================== */}
      <div className="pt-4 border-t border-[#133525]">
        <button
          type="button"
          onClick={onLogout}
          title={!isOpen ? "Logout" : undefined}
          className={`
            w-full
            h-12
            flex
            items-center
            rounded-xl
            text-sm
            font-medium
            text-gray-300
            overflow-hidden
            transition-[background-color,color,padding,gap]
            duration-200
            ease-in-out
            ${
              isOpen
                ? "gap-3 px-4"
                : "justify-center px-2"
            }
            hover:bg-[#133525]
            hover:text-red-400
          `}
        >
          <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
            <MdLogout size={20} />
          </span>

          <span
            className={`
              overflow-hidden
              whitespace-nowrap
              transition-[max-width,opacity,transform]
              duration-200
              ease-in-out
              ${
                isOpen
                  ? "max-w-[100px] opacity-100 translate-x-0"
                  : "max-w-0 opacity-0 -translate-x-2"
              }
            `}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;