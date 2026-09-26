import React, { useState, useEffect } from 'react';
import { 
  MdSearch, 
  MdVisibility, 
  MdClose, 
  MdCalendarToday, 
  MdLocationOn, 
  MdPerson, 
  MdEco, 
  MdFeedback 
} from 'react-icons/md';
import { getMySubmissionsApi } from '../../../../../api/authApi';
import { BACKEND_URL } from '../../../../../api/api';

export default function MySubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal States
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    fetchMySubmissions();
  }, []);

  const fetchMySubmissions = async () => {
    try {
      setLoading(true);
      const res = await getMySubmissionsApi();
      if (res.success || res.submissions) {
        setSubmissions(res.submissions || []);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper for image resolution
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder-plant.jpg";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
    if (imagePath.startsWith("/")) return `${BACKEND_URL}${imagePath}`;
    return `${BACKEND_URL}/${imagePath}`;
  };

  // Filter Logic
  const filteredSubmissions = submissions.filter((item) => {
    const matchesSearch = 
      (item.species || item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.family || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (`SUB-${item.id}`).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'All' || 
      (item.status || '').toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Count by Status
  const countByStatus = (status) => {
    if (status === 'All') return submissions.length;
    return submissions.filter((s) => (s.status || '').toLowerCase() === status.toLowerCase()).length;
  };

  const handleOpenDetails = (submission) => {
    setSelectedSubmission(submission);
    setActiveImageIndex(0);
  };

  const handleCloseModal = () => {
    setSelectedSubmission(null);
  };

  // Extract Image Gallery
  const rawImages = selectedSubmission?.image_url || selectedSubmission?.image || selectedSubmission?.images;
  const gallery = Array.isArray(rawImages) 
    ? rawImages 
    : [rawImages].filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Submissions</h1>
        <p className="text-sm text-gray-500">Track all your herbarium submissions and admin feedback</p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search submissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Approved', 'Pending', 'Rejected', 'Revision'].map((status) => {
            const count = countByStatus(status);
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-bold text-gray-400 tracking-wider uppercase">
                <th className="py-4 px-6">Submission ID</th>
                <th className="py-4 px-6">Plant Name</th>
                <th className="py-4 px-6">Family</th>
                <th className="py-4 px-6">Date Submitted</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Feedback</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-400">Loading submissions...</td>
                </tr>
              ) : filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-400">No submissions found.</td>
                </tr>
              ) : (
                filteredSubmissions.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Submission ID */}
                    <td className="py-4 px-6 font-mono text-xs font-semibold text-gray-600">
                      SUB-{String(item.id).padStart(4, '0')}
                    </td>

                    {/* Plant Name */}
                    <td className="py-4 px-6">
                      <p className="font-semibold italic text-gray-800">
                        {item.species || item.name || 'Unidentified'}
                      </p>
                      {item.author && <p className="text-xs text-gray-400 font-normal">{item.author}</p>}
                    </td>

                    {/* Family */}
                    <td className="py-4 px-6 text-gray-600 font-medium">
                      {item.family || '—'}
                    </td>

                    {/* Date Submitted */}
                    <td className="py-4 px-6 text-gray-500 text-xs">
                      {item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : '—'}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                        item.status?.toLowerCase() === 'approved' 
                          ? 'bg-emerald-100/70 text-emerald-700'
                          : item.status?.toLowerCase() === 'rejected'
                          ? 'bg-rose-100/70 text-rose-700'
                          : item.status?.toLowerCase() === 'revision'
                          ? 'bg-amber-100/70 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.status || 'Pending'}
                      </span>
                    </td>

                    {/* Feedback */}
                    <td className="py-4 px-6 text-xs text-gray-500 max-w-xs truncate">
                      {item.reviewer_comments || item.feedback || '—'}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleOpenDetails(item)}
                        className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
                        title="View Submission Details"
                      >
                        <MdVisibility size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 text-xs text-gray-400 flex justify-between items-center">
          <span>Showing {filteredSubmissions.length} of {submissions.length} submissions</span>
        </div>
      </div>

     {/* --- ENHANCED SUBMISSION DETAILS POPUP MODAL --- */}
{selectedSubmission && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
    <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-gray-100 relative p-6 space-y-6">
      
      {/* Modal Header */}
      <div className="flex items-start justify-between border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-md">
              SUB-{String(selectedSubmission.id).padStart(4, '0')}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
              selectedSubmission.status?.toLowerCase() === 'approved' 
                ? 'bg-emerald-100 text-emerald-700'
                : selectedSubmission.status?.toLowerCase() === 'rejected'
                ? 'bg-rose-100 text-rose-700'
                : selectedSubmission.status?.toLowerCase() === 'revision'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-slate-100 text-slate-600'
            }`}>
              {selectedSubmission.status || 'Pending'}
            </span>
          </div>
          <h2 className="text-2xl font-bold italic text-gray-800">
            {selectedSubmission.name || selectedSubmission.species || 'N/A'}
          </h2>
        </div>
        
        <button
          onClick={handleCloseModal}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <MdClose size={22} />
        </button>
      </div>

      {/* Full Aspect Ratio Image Container */}
      <div className="space-y-3">
        <div className="w-full bg-amber-50 rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center min-h-[300px] max-h-[500px]">
          <img
            src={getImageUrl(gallery[activeImageIndex])}
            alt={selectedSubmission.name || 'Plant specimen'}
            className="w-full h-auto max-h-[500px] object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=800&auto=format&fit=crop";
            }}
          />
        </div>

        {/* Gallery Thumbnails */}
        {gallery.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                  activeImageIndex === idx ? 'border-emerald-600 ring-2 ring-emerald-600/20' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* All Form Fields Section Grid */}
      <div className="space-y-4">
        
        {/* Section 1: Taxonomy & Identification */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Taxonomy & Identification</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Plant Name</span>
              <span className="text-xs font-semibold text-gray-800 italic">{selectedSubmission.name || 'N/A'}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Family</span>
              <span className="text-xs font-semibold text-gray-800">{selectedSubmission.family || 'N/A'}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Location Code</span>
              <span className="text-xs font-semibold text-gray-800">{selectedSubmission.location_code || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Collection Details */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Collection Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Collection No.</span>
              <span className="text-xs font-semibold text-gray-800">{selectedSubmission.collection_no || 'N/A'}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Collector Name</span>
              <span className="text-xs font-semibold text-gray-800">{selectedSubmission.collector_name || 'N/A'}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Collection Date</span>
              <span className="text-xs font-semibold text-gray-800">
                {selectedSubmission.collection_date 
                  ? new Date(selectedSubmission.collection_date).toLocaleDateString() 
                  : 'N/A'}
              </span>
            </div>
            <div className="sm:col-span-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Group Members</span>
              <span className="text-xs font-semibold text-gray-800">{selectedSubmission.collection_group_members || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Section 3: Botanical Characteristics */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Botanical Characteristics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Habit</span>
              <span className="text-xs font-semibold text-gray-800">{selectedSubmission.habit || 'N/A'}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Flower Color</span>
              <span className="text-xs font-semibold text-gray-800">{selectedSubmission.flower_color || 'N/A'}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Habitat</span>
              <span className="text-xs font-semibold text-gray-800">{selectedSubmission.habitat || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Section 4: Location & Geography */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Location & Coordinates</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Locality</span>
              <span className="text-xs font-semibold text-gray-800">{selectedSubmission.locality || 'N/A'}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Latitude</span>
              <span className="text-xs font-mono font-semibold text-gray-800">{selectedSubmission.latitude || 'N/A'}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Longitude</span>
              <span className="text-xs font-mono font-semibold text-gray-800">{selectedSubmission.longitude || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Section 5: Admin Feedback (If Any) */}
        {(selectedSubmission.reviewer_comments || selectedSubmission.feedback) && (
          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/60 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
              <MdFeedback size={16} />
              <span>Admin Feedback / Reviewer Notes</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              {selectedSubmission.reviewer_comments || selectedSubmission.feedback}
            </p>
          </div>
        )}

      </div>

      {/* Modal Footer */}
      <div className="pt-2 flex justify-end border-t border-gray-100">
        <button
          onClick={handleCloseModal}
          className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}
    </div>
  );
}