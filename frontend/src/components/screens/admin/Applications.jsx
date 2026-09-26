import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

import { 
  getApplicationsApi, 
  approveApplicationApi, 
  rejectApplicationApi,
  deleteApplicationApi 
} from "../../../api/adminApi"; 

import ApplicationMetrics from "./ApplicationMetrices";
import ApplicationRow from "./ApplicationRow";
import ApplicationDetailModal from "./ApplicationDetailModal";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);

  // --- MODAL STATES ---
  const [confirmModal, setConfirmModal] = useState({ show: false, type: "", id: null, name: "" });
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await getApplicationsApi();
      if (response.success) {
        setApplications(response.data);
      }
    } catch (error) {
      console.error("Error retrieving application data stream:", error);
      toast.error(error.response?.data?.message || "Failed to load applicants list from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

const handleApprove = (id, name) => {
  const targetApp = applications.find((app) => (app.applicationId || app.id) === id);
  const applicantName = name || targetApp?.applicantName || targetApp?.full_name || targetApp?.fullName || "this applicant";

  setConfirmModal({ show: true, type: "approve", id, name: applicantName });
};

const handleReject = (id, name) => {
  // Find the app object in case 'name' is missing/undefined
  const targetApp = applications.find((app) => (app.applicationId || app.id) === id);
  const applicantName = name || targetApp?.applicantName || targetApp?.full_name || targetApp?.fullName || "this applicant";

  setRejectionReason("");
  setConfirmModal({ show: true, type: "reject", id, name: applicantName });
};

  // --- EXECUTE ACTIONS FROM DIALOGS ---
  const executeApproval = async () => {
    const { id } = confirmModal;
    setConfirmModal({ show: false, type: "", id: null, name: "" });

    try {
      const res = await approveApplicationApi(id);
      if (res.success) {
        toast.success(res.message || "Applicant successfully approved!");
        fetchApplications(); 
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Approval execution failed.");
    }
  };

  const executeRejection = async () => {
    const { id } = confirmModal;
    setConfirmModal({ show: false, type: "", id: null, name: "" });

    try {
      const res = await rejectApplicationApi(id, rejectionReason);
      if (res.success) {
        toast.success("Application rejected efficiently.");
        fetchApplications();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Rejection execution failed.");
    }
  };

  // --- DELETE HANDLER ---
  const handleDelete = async (id, name) => {
    const targetId = 
      id || 
      selectedApp?.id || 
      selectedApp?.applicationId || 
      selectedApp?.application_id;

    const applicantName = 
      name || 
      selectedApp?.applicantName || 
      selectedApp?.full_name || 
      selectedApp?.fullName || 
      "this applicant";

    if (!targetId) {
      toast.error("Error: Missing Application ID. Cannot proceed with deletion.");
      return;
    }

    if (!window.confirm(`Are you sure you want to permanently delete the application record for ${applicantName}? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await deleteApplicationApi(targetId);
      if (res && res.success) {
        toast.success(res.message || "Application record deleted successfully.");
        if (selectedApp) setSelectedApp(null);
        fetchApplications();
      } else {
        toast.error(res?.message || "Failed to delete application record.");
      }
    } catch (err) {
      console.error("❌ Delete Error details:", err);
      toast.error(err.response?.data?.message || "Failed to delete record.");
    }
  };

  const handleViewDetails = (id) => {
    const target = applications.find((app) => app.applicationId === id || app.id === id);
    if (target) {
      setSelectedApp(target);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = 
      app.applicantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.institution?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicantEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = activeFilter ? app.status === activeFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      
      {/* REACT TOASTIFY CONTAINER */}
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Botanist Application Review</h1>
        <p className="text-sm text-gray-500">Review and manage backend user requests for botanist system credentials.</p>
      </div>

      <ApplicationMetrics 
        data={applications} 
        activeFilter={activeFilter} 
        setActiveFilter={setActiveFilter} 
      />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-white flex items-center gap-3">
          <span className="material-symbols-outlined text-gray-400">search</span>
          <input
            type="text"
            placeholder="Search applicants by name, institution, or email registry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm outline-none placeholder-gray-400 text-gray-700 bg-transparent"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
                <th className="px-6 py-3.5">Applicant</th>
                <th className="px-6 py-3.5">Institution</th>
                <th className="px-6 py-3.5">Qualification</th>
                <th className="px-6 py-3.5">Experience</th>
                <th className="px-6 py-3.5">Applied At</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-400 text-sm">
                    <div className="animate-pulse flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
                      Syncing database state updates...
                    </div>
                  </td>
                </tr>
              ) : filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-400 text-sm">
                    No matching application review logs matched your parameters.
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <ApplicationRow
                    key={app.applicationId || app.id}
                    app={app}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onDelete={handleDelete}
                    onViewDetails={handleViewDetails}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* APPROVAL & REJECTION CONFIRMATION DIALOG MODAL */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 transform transition-all">
            
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`p-3 rounded-xl ${
                  confirmModal.type === "approve"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                <span className="material-symbols-outlined text-2xl">
                  {confirmModal.type === "approve" ? "verified" : "cancel"}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {confirmModal.type === "approve" ? "Approve Application" : "Reject Application"}
                </h3>
                <p className="text-xs text-gray-500">Action cannot be undone automatically</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              {confirmModal.type === "approve" ? (
                <>
                  Are you sure you want to approve <strong>{confirmModal.name}</strong> as a verified Botanist?
                </>
              ) : (
                <>
                  Are you sure you want to reject <strong>{confirmModal.name ? `${confirmModal.name}'s` : "this"}</strong>'s application?
                </>
              )}
            </p>

            {confirmModal.type === "reject" && (
              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                  Rejection Reason (Optional)
                </label>
                <textarea
                  rows="3"
                  placeholder="State the reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full p-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-gray-700 bg-gray-50/50 resize-none"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal({ show: false, type: "", id: null, name: "" })}
                className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
              >
                Cancel
              </button>

              {confirmModal.type === "approve" ? (
                <button
                  type="button"
                  onClick={executeApproval}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all"
                >
                  Confirm Approval
                </button>
              ) : (
                <button
                  type="button"
                  onClick={executeRejection}
                  className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-all"
                >
                  Confirm Rejection
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* DETAIL MODAL COMPONENT */}
      {selectedApp && (
        <ApplicationDetailModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Applications;