import { useState } from "react";
import ManualSubmission from "./ManualSubmission";
import AISubmission from "./AISubmission";

const BotanistNewSubmission = () => {
  const [submissionMode, setSubmissionMode] = useState("manual");

  return (
    <div className="min-h-full bg-[#f7faf8] px-6 py-7">
      <div className="mx-auto max-w-[840px]">

        {/* PAGE TITLE */}
        <div>
          <h1 className="text-[22px] font-semibold text-[#092b1b]">
            New Plant Submission
          </h1>

          <p className="mt-1 text-[14px] text-gray-500">
            Add a new specimen to the Flora-Digitalis herbarium
          </p>
        </div>

        {/* MODE SELECTOR */}
        <div className="mt-6 flex gap-3">

          {/* MANUAL ENTRY */}
          <button
            type="button"
            onClick={() => setSubmissionMode("manual")}
            className={`flex h-[61px] w-[192px] items-center gap-3 rounded-xl border px-5 text-left transition ${
              submissionMode === "manual"
                ? "border-[#16a34a] bg-[#eafff0]"
                : "border-[#dce7df] bg-white hover:border-[#b9c9bf]"
            }`}
          >
            <div className="text-[20px]">
              📋
            </div>

            <div>
              <p className="text-[14px] font-medium text-[#0b2d1d]">
                Manual Entry
              </p>

              <p className="mt-0.5 text-[11px] text-gray-500">
                Fill in all fields manually
              </p>
            </div>
          </button>

          {/* AI ASSISTED */}
          <button
            type="button"
            onClick={() => setSubmissionMode("ai")}
            className={`flex h-[61px] w-[230px] items-center gap-3 rounded-xl border px-5 text-left transition ${
              submissionMode === "ai"
                ? "border-[#16a34a] bg-[#eafff0]"
                : "border-[#dce7df] bg-white hover:border-[#b9c9bf]"
            }`}
          >
            <div className="text-[20px]">
              🤖
            </div>

            <div>
              <p className="text-[14px] font-medium text-[#0b2d1d]">
                AI-Assisted
              </p>

              <p className="mt-0.5 text-[11px] text-gray-500">
                Upload image, auto-fill with AI
              </p>
            </div>
          </button>
        </div>

        {/* CONTENT */}
        {submissionMode === "manual" ? (
          <ManualSubmission />
        ) : (
          <AISubmission />
        )}

      </div>
    </div>
  );
};

export default BotanistNewSubmission;