// import React from 'react';

// const ImageDisplayCard = ({ imageUrl, badgeText }) => {
//   return (
//     <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 group">
//       <div className="aspect-[4/4] relative overflow-hidden bg-amber-50 dark:bg-slate-200">
//         <img
//           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
//           src={imageUrl }
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

// export default ImageDisplayCard;

import React, { useState, useEffect } from "react";
import { MapContainer, ImageOverlay, useMap } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

// 🚀 CUSTOM COMPONENT: Custom Control Toolbar for Zoom and Refresh Actions
const CustomWorkspaceControls = ({ imageBounds }) => {
  const map = useMap();

  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();
  
  const handleReset = () => {
    if (imageBounds) {
      // Snaps the viewport framework directly back to center bounding dimensions cleanly
      map.fitBounds(imageBounds, { animate: true });
    }
  };

  return (
    <div className="absolute left-6 top-6 z-[1000] flex flex-col gap-1 bg-white p-1.5 rounded-lg border border-gray-300 shadow-md">
      <button 
        onClick={handleZoomIn} 
        className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-100 text-gray-800 font-bold text-lg rounded border border-gray-200 shadow-sm transition-colors"
      >
        +
      </button>
      <button 
        onClick={handleZoomOut} 
        className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-100 text-gray-800 font-bold text-lg rounded border border-gray-200 shadow-sm transition-colors"
      >
        −
      </button>
      <button 
        onClick={handleReset} 
        title="Refresh View"
        className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-100 text-gray-600 text-sm rounded border border-gray-200 shadow-sm transition-colors"
      >
        ⟲
      </button>
    </div>
  );
};

const ImageDisplayCard = ({ plant }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageBounds, setImageBounds] = useState(null);

  const imageUrl = plant?.image_url;

  useEffect(() => {
    if (isFullscreen && imageUrl) {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        const height = img.naturalHeight;
        const width = img.naturalWidth;

        const bounds = [
          [0, 0],
          [height, width],
        ];
        setImageBounds(bounds);
      };
    }
  }, [isFullscreen, imageUrl]);

  if (!imageUrl) {
    return (
      <div className="w-full h-[500px] bg-slate-/40 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-slate-400 border border-white/10">
        <span className="material-icons-outlined text-4xl mb-2 text-slate-500">
          image_not_supported
        </span>
        <p className="text-sm font-medium">No specimen image available</p>
      </div>
    );
  }

  return (
    <>
      {/* 1. Page Preview Container */}
      <div className="w-full  backdrop-blur-sm border border-white/10 rounded-2xl p-4 shadow-xl flex items-center justify-center bg-amber-50">
        <div className="relative max-w-full h-[500px] flex items-center justify-center overflow-hidden rounded-xl group">
          <img
            src={imageUrl}
            alt="Specimen Sheet Preview"
            className="max-w-full max-h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
            <button
              onClick={() => setIsFullscreen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg transition-all"
            >
              Open Interactive Zoom
            </button>
          </div>
        </div>
      </div>

      {/* 2. Full-Screen Light-Themed Leaflet Workspace Popup Overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-[#EAEAEA] flex flex-col animate-in fade-in duration-200">
          {/* Top Control Navigation Header */}
          <header className="w-full flex justify-between items-center px-6 py-3 bg-white border-b border-gray-300 shadow-sm z-50">
            <div>
              <p className="text-[10px] font-mono text-emerald-700 uppercase tracking-widest font-bold">
                KUH WORKSPACE (LEAFLET)
              </p>
              <h3 className="text-xs text-gray-600 font-medium">
                Scroll to Zoom • Click and Drag to Explore Sheet
              </h3>
            </div>
            <button
              onClick={() => setIsFullscreen(false)}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 border border-gray-300 transition-all"
            >
              Close Workspace
            </button>
          </header>

          {/* Leaflet Rendering Engine Workspace Canvas */}
          <div className="flex-1 w-full bg-[#EAEAEA] relative">
            {imageBounds ? (
              <MapContainer
                crs={L.CRS.Simple} 
                bounds={imageBounds} 
                maxZoom={5}        
                minZoom={-3}       
                zoomControl={false}        // 🚀 TWEAK: Turn off default standalone zoom buttons
                attributionControl={false} 
                style={{ width: "100%", height: "calc(100vh - 65px)" }}
              >
                {/* Injects our newly assembled unified action toolbar button panel layout overlays */}
                <CustomWorkspaceControls imageBounds={imageBounds} />

                <ImageOverlay 
                  url={imageUrl} 
                  bounds={imageBounds} 
                  options={{
                    className: "crisp-specimen-render"
                  }}
                />
              </MapContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                Calculating Canvas Dimensions...
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .crisp-specimen-render {
          image-rendering: -webkit-optimize-contrast !important;
          image-rendering: crisp-edges !important;
          image-rendering: pixelated !important;
        }
      `}</style>
    </>
  );
};

export default ImageDisplayCard;
