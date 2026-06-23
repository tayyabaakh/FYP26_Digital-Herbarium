import React, { useState, useEffect } from "react";
// Import your dedicated endpoints
import { 
  getApplicationsApi, 
  approveApplicationApi, 
  rejectApplicationApi 
} from "../../../api/adminApi"; // <-- Make sure this path points correctly to your endpoints file

import ApplicationMetrics from "./ApplicationMetrices";
import ApplicationRow from "./ApplicationRow";

const BotanistApplicationReview = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState(null); // null means show 'all'

  // Fetch from backend using your custom API utility
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await getApplicationsApi();
      if (response.success) {
        setApplications(response.data);
      }
    } catch (error) {
      console.error("Error retrieving application data stream:", error);
      alert(error.response?.data?.message || "Failed to load applicants list from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // PUT: Handle Approve Action using your api utility
  const handleApprove = async (id, name) => {
    if (!window.confirm(`Are you sure you want to approve ${name} as a verified Botanist?`)) return;
    try {
      const res = await approveApplicationApi(id);
      if (res.success) {
        alert(res.message);
        fetchApplications(); 
      }
    } catch (err) {
      alert(err.response?.data?.message || "Approval execution failed.");
    }
  };

  // PUT: Handle Reject Action using your api utility
  const handleReject = async (id) => {
    const reason = window.prompt("Enter rejection reason (optional):");
    if (reason === null) return; 

    try {
      const res = await rejectApplicationApi(id, reason);
      if (res.success) {
        alert("Application rejected efficiently.");
        fetchApplications();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Rejection execution failed.");
    }
  };

  const handleViewDetails = (id) => {
    alert(`Routing route path detail link identifier: ${id}. Hook this up to a clean detail modal.`);
  };

  // Live client-side structural filters
  const filteredApplications = applications.filter((app) => {
    const matchesSearch = 
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = activeFilter ? app.status === activeFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
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
                    key={app.applicationId}
                    app={app}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onViewDetails={handleViewDetails}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BotanistApplicationReview;