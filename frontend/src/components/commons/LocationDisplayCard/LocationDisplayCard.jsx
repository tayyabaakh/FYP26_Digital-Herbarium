import React from 'react';

const LocationDisplayCard = ({ lat, lng, accuracy, locality, mapUrl }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-800">
      <h2 className="text-sm font-bold text-slate-200 dark:text-black mb-3 flex items-center gap-2">
        {/* <span className="material-symbols-outlined text-primary text-lg">location\\\</span>  */}
        Georeference
      </h2>
      <div className="aspect-video bg-slate-100 dark:bg-slate-200 rounded-lg overflow-hidden relative">
        <img 
          className="w-full h-full object-cover opacity-60" 
          src={mapUrl} 
          alt={`Map of ${locality}`}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="material-symbols-outlined text-primary text-4xl drop-shadow-md">location_on</span>
        </div>
      </div>
      <div className="mt-3 flex justify-between items-center text-[11px] text-slate-500 font-medium">
        <span>Lat: {lat}</span>
        <span>Long: {lng}</span>
        <span className="text-primary font-bold">Accuracy: {accuracy}</span>
      </div>
    </div>
  );
};

export default LocationDisplayCard;