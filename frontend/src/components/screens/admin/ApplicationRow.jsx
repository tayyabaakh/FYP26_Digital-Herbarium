import React from "react";
import { Eye, Check, X } from "lucide-react";

const ApplicationRow = ({ app, onApprove, onReject, onViewDetails }) => {
  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.replace(/^(dr\.|ms\.|mr\.)\s+/i, "").split(" ");
    return parts.map((p) => p[0]).join("").toUpperCase().slice(0, 2);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-800";
      case "approved": return "bg-emerald-100 text-emerald-800";
      case "rejected": return "bg-rose-100 text-rose-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toISOString().split("T")[0];
  };

  return (
    <tr className="hover:bg-gray-50/70 transition-colors border-b border-gray-100 text-sm text-gray-700">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs tracking-wider border border-emerald-100">
            {getInitials(app.applicantName)}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{app.applicantName}</div>
            <div className="text-xs text-gray-400 font-normal">{app.applicantEmail}</div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 font-medium text-gray-600">{app.institution}</td>

      <td className="px-6 py-4">
        <div>
          <span className="font-medium text-gray-800">{app.qualification}</span>
          <span className="block text-xs text-gray-400">{app.specialisation || "General Botany"}</span>
        </div>
      </td>

      <td className="px-6 py-4 text-gray-500 font-medium">{app.experience_years} years</td>

      <td className="px-6 py-4 text-gray-500">{formatDate(app.applied_at)}</td>

      <td className="px-6 py-4">
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize tracking-wide ${getStatusStyle(app.status)}`}>
          {app.status}
        </span>
      </td>

      <td className="px-6 py-4 text-right">
        <div className="flex items-center gap-2 justify-end">
          <button 
            onClick={() => onViewDetails(app.applicationId)}
            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
            title="View full documents"
          >
            <Eye className="w-4 h-4" />
          </button>

          {app.status === "pending" && (
            <>
              <button 
                onClick={() => onApprove(app.applicationId, app.applicantName)}
                className="p-1.5 rounded-md hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 transition-colors border border-transparent hover:border-emerald-200"
                title="Approve Botanist"
              >
                <Check className="w-4 h-4" />
              </button>

              <button 
                onClick={() => onReject(app.applicationId)}
                className="p-1.5 rounded-md hover:bg-rose-50 text-rose-500 hover:text-rose-600 transition-colors border border-transparent hover:border-rose-200"
                title="Reject Application"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default ApplicationRow;