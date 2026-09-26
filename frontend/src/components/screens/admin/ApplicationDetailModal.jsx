import React from "react";
import { X, ExternalLink, Mail, Phone, Building, Award, Briefcase, Calendar, ShieldCheck, Trash2 } from "lucide-react";

const ApplicationDetailModal = ({ app, onClose, onDelete }) => {
  if (!app) return null;

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "approved":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "rejected":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

 const appId = app.id || app.applicationId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-gray-900">Botanist Application Details</h2>
            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border capitalize ${getStatusStyle(app.status)}`}>
              {app.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Personal Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50/70 p-3 rounded-xl border border-gray-100 items-center">
              <div>
                <span className="text-[11px] text-gray-400 font-medium block">Full Name</span>
                <span className="text-sm font-semibold text-gray-800 truncate block">{app.applicantName || "N/A"}</span>
              </div>
              <div>
                <span className="text-[11px] text-gray-400 font-medium block">Application ID</span>
                <span className="text-xs font-mono text-gray-700">#{appId || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-700 truncate">{app.applicantEmail || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-700">{app.phone || app.applicantPhone || "N/A"}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Academic & Professional Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg border border-gray-100 bg-white">
                <Building className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-gray-400 font-medium block leading-none mb-1">Institution</span>
                  <span className="text-xs font-medium text-gray-800 truncate block">{app.institution || "N/A"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-lg border border-gray-100 bg-white">
                <Award className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-gray-400 font-medium block leading-none mb-1">Qualification</span>
                  <span className="text-xs font-medium text-gray-800 truncate block">{app.qualification || "N/A"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-lg border border-gray-100 bg-white">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-gray-400 font-medium block leading-none mb-1">Specialisation</span>
                  <span className="text-xs font-medium text-gray-800 truncate block">{app.specialisation || "N/A"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-lg border border-gray-100 bg-white">
                <Briefcase className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-gray-400 font-medium block leading-none mb-1">Experience</span>
                  <span className="text-xs font-medium text-gray-800 truncate block">
                    {app.experience_years ? `${app.experience_years} Years` : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Submitted Attachments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {app.portfolio_url ? (
                <a
                  href={app.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg border border-emerald-100 bg-emerald-50/40 text-emerald-800 text-xs font-medium hover:bg-emerald-50 transition-colors group"
                >
                  <span>Portfolio / Research Link</span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                </a>
              ) : (
                <div className="p-2.5 rounded-lg border border-gray-100 bg-gray-50 text-xs text-gray-400 italic">
                  No portfolio URL attached.
                </div>
              )}

              {app.document_url ? (
                <a
                  href={app.document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg border border-emerald-100 bg-emerald-50/40 text-emerald-800 text-xs font-medium hover:bg-emerald-50 transition-colors group"
                >
                  <span>Certificate / Document Link</span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                </a>
              ) : (
                <div className="p-2.5 rounded-lg border border-gray-100 bg-gray-50 text-xs text-gray-400 italic">
                  No document/certificate URL attached.
                </div>
              )}
            </div>
          </div>

          {app.status === "rejected" && app.rejection_reason && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 block mb-0.5">
                Rejection Reason
              </span>
              <p className="text-xs text-rose-800 font-medium">{app.rejection_reason}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>Applied on: {formatDate(app.applied_at)}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Show Delete Button only for Approved or Rejected statuses */}
            {(app.status === "approved" || app.status === "rejected") && (
              <button
onClick={() => onDelete(app.id || app.applicationId, app.applicantName || app.full_name)}                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Record
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailModal;