import React from "react";

const ApplicationMetrics = ({ data = [], activeFilter, setActiveFilter }) => {
  const total = data.length;
  const pending = data.filter((app) => app.status === "pending").length;
  const approved = data.filter((app) => app.status === "approved").length;
  const rejected = data.filter((app) => app.status === "rejected").length;

  const cards = [
    { label: "Total Applications", count: total, filterValue: null, color: "text-gray-700", border: "border-gray-200" },
    { label: "Pending", count: pending, filterValue: "pending", color: "text-amber-600", border: "border-amber-200 bg-amber-50/30" },
    { label: "Approved", count: approved, filterValue: "approved", color: "text-emerald-600", border: "border-emerald-200 bg-emerald-50/30" },
    { label: "Rejected", count: rejected, filterValue: "rejected", color: "text-rose-600", border: "border-rose-200 bg-rose-50/30" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => (
        <button
          key={idx}
          onClick={() => setActiveFilter(card.filterValue)}
          className={`flex items-baseline justify-between p-4 rounded-xl border text-left transition-all ${card.border} ${
            activeFilter === card.filterValue 
              ? "ring-2 ring-emerald-600 shadow-sm font-semibold" 
              : "hover:shadow-sm"
          }`}
        >
          <div>
            <span className={`block text-2xl font-bold ${card.color}`}>{card.count}</span>
            <span className="text-xs text-gray-500 font-medium">{card.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ApplicationMetrics;