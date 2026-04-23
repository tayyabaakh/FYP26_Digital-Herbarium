export default function SpecimenCard({ title, type, collector, locality, img }) {
  return (
    <div className="h-full w-full max-w-sm bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden flex flex-col group transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
      
      {/* Image Area */}
      <div className="relative h-64 overflow-hidden">
        <img 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          src={img || "https://via.placeholder.com/300x150?text=No+Image"} 
          alt={title} 
        />
        {/* Gradient Overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121414]/90 to-transparent"></div>
        
        <div className="absolute bottom-4 left-6">
          <span className="inline-block text-[10px] tracking-wider uppercase font-bold text-amber-50 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
            {type}
          </span>
          <h3 className="text-2xl font-bold text-amber-50 mt-2 leading-tight">{title}</h3>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-amber-50/60 font-semibold">Collector</p>
            <p className="text-sm text-amber-50 font-medium">{collector}</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-amber-50/60 font-semibold">Locality</p>
            <p className="text-sm text-amber-50 font-medium">{locality}</p>
          </div>
        </div>
        
        {/* Enhanced Button */}
        <button className="mt-auto w-full py-3.5 border border-amber-50/20 text-amber-50 font-semibold uppercase text-xs tracking-[0.2em] hover:bg-amber-50 hover:text-[#121414] transition-all duration-300 rounded-lg">
          View Details
        </button>
      </div>
    </div>
  );
}