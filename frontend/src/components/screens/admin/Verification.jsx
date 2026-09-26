import React, { useState, useEffect } from 'react';
import {toast,ToastContainer} from 'react-toastify';
import { 
  getAllSubmissionsAdminApi, 
  approveSubmissionApi, 
  rejectSubmissionApi 
} from '../../../api/authApi';

import { BACKEND_URL } from '../../../api/api';
import { 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  ZoomIn, 
  Loader2,
  AlertTriangle,
  X
} from 'lucide-react';

const VerificationCenter = () => {
  const [submissions, setSubmissions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewerComments, setReviewerComments] = useState('');

  // Modal States
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const [checklist, setChecklist] = useState({
    scientificName: true,
    imagesClear: true,
    gpsAccurate: true,
    habitatComplete: true,
    collectorVerified: false,
    familyCorrect: false,
  });

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const data = await getAllSubmissionsAdminApi('pending');
      if (data.success) {
        setSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
      toast.error('Failed to load pending submissions');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder-plant.jpg";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
    if (imagePath.startsWith("/")) return `${BACKEND_URL}${imagePath}`;
    return `${BACKEND_URL}/${imagePath}`;
  };

  const handleChecklistChange = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const currentSubmission = submissions[currentIndex];

  // Confirmed Approval
  const handleConfirmApprove = async () => {
    if (!currentSubmission) return;
    try {
      setActionLoading(true);
      const res = await approveSubmissionApi(currentSubmission.id, reviewerComments);
      if (res.success || res.status === 200) {
        toast.success(`Submission SUB-${String(currentSubmission.id).padStart(4, '0')} approved successfully!`);
        setShowApproveModal(false);
        removeCurrentSubmissionFromState();
      }
    } catch (err) {
      console.error('Approval failed:', err);
      toast.error(err.response?.data?.message || 'Error approving submission');
    } finally {
      setActionLoading(false);
    }
  };

  // Confirmed Rejection
  const handleConfirmReject = async () => {
    if (!currentSubmission) return;
    if (!rejectionReason.trim()) {
      toast.error('Please state a reason for rejection.');
      return;
    }

    try {
      setActionLoading(true);
      const res = await rejectSubmissionApi(currentSubmission.id, {
        rejection_reason: rejectionReason,
        reviewer_comments: reviewerComments
      });

      if (res.success || res.status === 200) {
        toast.success(`Submission SUB-${String(currentSubmission.id).padStart(4, '0')} rejected & email sent.`);
        setShowRejectModal(false);
        setRejectionReason('');
        removeCurrentSubmissionFromState();
      }
    } catch (err) {
      console.error('Rejection failed:', err);
      toast.error(err.response?.data?.message || 'Error rejecting submission');
    } finally {
      setActionLoading(false);
    }
  };

  const removeCurrentSubmissionFromState = () => {
    const updated = submissions.filter((_, idx) => idx !== currentIndex);
    setSubmissions(updated);
    if (currentIndex >= updated.length && updated.length > 0) {
      setCurrentIndex(updated.length - 1);
    }
    setReviewerComments('');
  };

  const handleNext = () => {
    if (currentIndex < submissions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedImage(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSelectedImage(0);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-slate-100 max-w-xl mx-auto mt-12">
             <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        <CheckCircle className="mx-auto h-12 w-12 text-emerald-500 mb-3" />
        <h3 className="text-lg font-semibold text-slate-800">All caught up!</h3>
        <p className="text-sm text-slate-500">There are no pending submissions awaiting verification.</p>
      </div>
    );
  }

  const rawImage = currentSubmission?.image_url || currentSubmission?.image;
  const gallery = Array.isArray(rawImage) ? rawImage : [rawImage].filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 bg-slate-50 min-h-screen relative">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Verification Center</h1>
          <p className="text-sm text-slate-500">
            {submissions.length} submission{submissions.length > 1 ? 's' : ''} awaiting review
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium">
          <button 
            onClick={handlePrev} 
            disabled={currentIndex === 0}
            className="p-1 hover:bg-slate-100 rounded disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-slate-600">
            {currentIndex + 1} / {submissions.length}
          </span>
          <button 
            onClick={handleNext} 
            disabled={currentIndex === submissions.length - 1}
            className="p-1 hover:bg-slate-100 rounded disabled:opacity-30 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Media & Specimen Info */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-4">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 group">
              <img 
                src={getImageUrl(gallery[selectedImage])} 
                alt={currentSubmission?.species || "Herbarium Specimen"}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=800&auto=format&fit=crop";
                }}
              />
              <button className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 text-white rounded-lg backdrop-blur-sm transition-all">
                <ZoomIn className="h-4 w-4" />
              </button>
              {gallery.length > 0 && (
                <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-md backdrop-blur-sm">
                  {selectedImage + 1}/{gallery.length}
                </span>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-1">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === idx ? 'border-emerald-600 ring-2 ring-emerald-600/20' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold italic text-slate-800">
                  {currentSubmission.name || currentSubmission.species || "Unidentified Species"}
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Family: {currentSubmission.family || "N/A"}
                </p>
              </div>
              <span className="capitalize bg-amber-50 text-amber-700 font-medium text-xs px-3 py-1 rounded-full border border-amber-200/60">
                {currentSubmission.status || "Pending"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Family</span>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{currentSubmission.family || 'N/A'}</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Locality / Code</span>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">
                  {currentSubmission.locality || currentSubmission.location_code || 'N/A'}
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Collected Date</span>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">
                  {currentSubmission.collection_date 
                    ? new Date(currentSubmission.collection_date).toLocaleDateString() 
                    : 'N/A'}
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Collector</span>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{currentSubmission.collector_name || 'N/A'}</p>
              </div>

              <div className="col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">GPS Coordinates</span>
                <p className="text-sm font-mono font-medium text-slate-700 mt-0.5">
                  {currentSubmission.latitude && currentSubmission.longitude 
                    ? `${currentSubmission.latitude}° N, ${currentSubmission.longitude}° E` 
                    : 'N/A'}
                </p>
              </div>
            </div>

            {currentSubmission.habitat && (
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Habitat & Observations</span>
                <p className="text-sm text-slate-600 leading-relaxed">{currentSubmission.habitat}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Verification Action Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
            <h3 className="text-md font-bold text-slate-800">Verification Checklist</h3>

            <div className="space-y-3">
              {[
                { id: 'scientificName', label: 'Scientific name is correct and verified' },
                { id: 'imagesClear', label: 'Images are clear and representative' },
                { id: 'gpsAccurate', label: 'GPS coordinates are accurate' },
                { id: 'habitatComplete', label: 'Habitat description is complete' },
                { id: 'collectorVerified', label: 'Collector information is verified' },
                { id: 'familyCorrect', label: 'Family classification is correct' },
              ].map((item) => (
                <label 
                  key={item.id} 
                  onClick={() => handleChecklistChange(item.id)}
                  className="flex items-center space-x-3 cursor-pointer group"
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                    checklist[item.id] ? 'bg-emerald-600 text-white' : 'bg-slate-200 group-hover:bg-slate-300'
                  }`}>
                    {checklist[item.id] && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-sm text-slate-700 font-medium">{item.label}</span>
                </label>
              ))}
            </div>

            <hr className="border-slate-100" />

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Reviewer Notes (Optional Internal Feedback)</label>
              <textarea
                rows={3}
                value={reviewerComments}
                onChange={(e) => setReviewerComments(e.target.value)}
                placeholder="Add verification notes or administrative details..."
                className="w-full text-sm p-3 rounded-xl bg-emerald-50/40 border border-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 placeholder-slate-400 text-slate-700 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowApproveModal(true)}
                disabled={actionLoading}
                className="flex items-center justify-center space-x-1.5 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Approve Submission</span>
              </button>

              <button
                onClick={() => setShowRejectModal(true)}
                disabled={actionLoading}
                className="flex items-center justify-center space-x-1.5 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" />
                <span>Reject Submission</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-3">
            <h3 className="text-md font-bold text-slate-800 mb-2">Submission Info</h3>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Submission ID</span>
              <span className="text-slate-700 font-semibold font-mono">
                SUB-{String(currentSubmission.id).padStart(4, '0')}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Submitted By</span>
              <span className="text-slate-700 font-semibold">
                {currentSubmission.botanist_name || currentSubmission.collector_name || 'Botanist'}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Submission Date</span>
              <span className="text-slate-700 font-semibold">
                {currentSubmission.created_at ? new Date(currentSubmission.created_at).toISOString().split('T')[0] : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- APPROVAL CONFIRMATION DIALOG --- */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 text-emerald-600">
                <CheckCircle className="h-6 w-6" />
                <h3 className="font-bold text-slate-800 text-lg">Confirm Approval</h3>
              </div>
              <button 
                onClick={() => setShowApproveModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-slate-600">
              Are you sure you want to approve submission <strong className="font-mono text-slate-800">SUB-{String(currentSubmission.id).padStart(4, '0')}</strong> ({currentSubmission.name || currentSubmission.species})? This record will be indexed into the public herbarium.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApprove}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                {actionLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Yes, Approve</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- REJECTION CONFIRMATION & REASON DIALOG --- */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 text-rose-600">
                <AlertTriangle className="h-6 w-6" />
                <h3 className="font-bold text-slate-800 text-lg">Reject Submission</h3>
              </div>
              <button 
                onClick={() => setShowRejectModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-slate-600">
              Please state the reason for rejecting submission <strong className="font-mono text-slate-800">SUB-{String(currentSubmission.id).padStart(4, '0')}</strong>. An automated notification email containing this reason will be sent to the submitting botanist.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Reason for Rejection <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Image quality is blurry, botanical identification incomplete, or invalid location coordinates..."
                className="w-full text-sm p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 placeholder-slate-400 text-slate-800 resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={actionLoading || !rejectionReason.trim()}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {actionLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Confirm & Send Rejection</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default VerificationCenter;