import React from 'react';

const ImageDisplayCard = ({ imageUrl, badgeText }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 group">
      <div className="aspect-[4/4] relative overflow-hidden bg-amber-50 dark:bg-slate-200">
        <img 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102" 
          src={imageUrl } 
          alt="Herbarium specimen"
        />
        {/* <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-700 shadow-sm">
          {badgeText || 'HIGH RESOLUTION SCAN'}
        </div> */}
        <button className="absolute bottom-4 right-4 h-10 w-10 bg-white  rounded-full flex items-center justify-center shadow-lg hover:text-primary transition-colors">
          {/* <span className="material-symbols-outlined">zoomin</span> */}
        </button>
      </div>
    </div>
  );
};

export default ImageDisplayCard;