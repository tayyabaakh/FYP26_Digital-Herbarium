import React from 'react';

// const ImageDisplayCard = ({ imageUrl, badgeText }) => {
//   return (
//     <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 group">
//       <div className="aspect-[3/4] relative overflow-hidden bg-amber-50 dark:bg-slate-200">
//         <img 
//           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102" 
//           src={imageUrl} 
//           alt="Herbarium specimen"
//         />
//         {/* <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-700 shadow-sm">
//           {badgeText || 'HIGH RESOLUTION SCAN'}
//         </div> */}
//         <button className="absolute bottom-4 right-4 h-10 w-10 bg-white  rounded-full flex items-center justify-center shadow-lg hover:text-primary transition-colors">
//           {/* <span className="material-symbols-outlined">zoomin</span> */}
//         </button>
//       </div>
//     </div>
//   );
// };




const ImageDisplayCard = ({ imageUrl }) => {
  return (
    <div className="relative group">
      {/* Decorative corners for a "scanner" look */}
      <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-emerald-500 z-10" />
      <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-emerald-500 z-10" />
      
      <div className="bg-[#161B22] rounded-sm overflow-hidden border border-slate-800 shadow-2xl">
        <div className="aspect-[3/4] relative overflow-hidden cursor-zoom-in">
          <img 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
            src={imageUrl || "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e"} 
            alt="Specimen"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A] via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-4 left-4">
            <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-1 border border-emerald-500/30 rounded">
              RAW_SCAN_V1.02
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};







export default ImageDisplayCard;