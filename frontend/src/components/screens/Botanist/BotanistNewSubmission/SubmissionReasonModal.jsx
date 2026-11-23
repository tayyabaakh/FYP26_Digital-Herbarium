import React from "react";

export default function SubmissionReasonModal({ open, reason, setReason, onCancel, onConfirm, submitting }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 px-4">
      <div role="dialog" aria-modal="true" aria-labelledby="reason-title" className="w-full max-w-lg rounded-2xl bg-white p-7 shadow-2xl">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 id="reason-title" className="text-lg font-semibold text-[#092b1b]">Reason for Submission</h2>
          <button type="button" disabled={submitting} onClick={onCancel} aria-label="Close">✕</button>
        </div>
        <p className="mt-5 text-sm text-gray-500"> Explain why this specimen is being submitted for review. Your reason will be sent with the submission.</p>
        <label htmlFor="submission-reason" className="mt-5 block text-xs font-semibold uppercase text-gray-600">Reason for submission (optional)</label>
        <textarea id="submission-reason" rows={4} maxLength={2000} value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g., Submitting a new specimen for verification..." className="mt-2 w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-emerald-600" />
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onCancel} disabled={submitting} className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm">Cancel</button>
          <button type="button" onClick={onConfirm} disabled={submitting} className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{submitting ? "Submitting..." : "Confirm & Submit"}</button>
        </div>
      </div>
    </div>
  );
}
