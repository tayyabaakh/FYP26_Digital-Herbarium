import { useState } from "react";

const AISubmission = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // ==========================================
  // IMAGE UPLOAD
  // ==========================================

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a JPG or PNG image.");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      alert("Image size must be less than 20MB.");
      return;
    }

    setSelectedImage(file);

    console.log("Selected image:", file);
  };

  // ==========================================
  // AI ANALYSIS
  // ==========================================

  const handleAIAnalysis = async () => {
    if (!selectedImage) {
      alert("Please upload a specimen image first.");
      return;
    }

    try {
      setIsAnalyzing(true);

      console.log(
        "Sending image to AI:",
        selectedImage
      );

      /*
        Future implementation:

        const formData = new FormData();

        formData.append(
          "image",
          selectedImage
        );

        const response = await axiosInstance.post(
          "/api/ai/identify",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log(
          "AI result:",
          response.data
        );
      */

    } catch (error) {
      console.error(
        "AI analysis failed:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to analyze image."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ==========================================
  // REMOVE IMAGE
  // ==========================================

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="mt-6">

      {/* ==========================================
          UPLOAD CARD
      ========================================== */}

      <label
        htmlFor="aiSpecimenImage"
        className="flex min-h-[282px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#dce7df] bg-white transition hover:border-[#16a34a] hover:bg-[#fbfefc]"
      >

        <div className="flex h-[60px] w-[60px] items-center justify-center rounded-2xl bg-[#dcfce7]">

          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#16a34a"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 16V4" />
            <path d="M7 9l5-5 5 5" />
            <path d="M5 20h14" />
          </svg>

        </div>

        <h2 className="mt-5 text-[15px] font-medium text-[#092b1b]">
          Upload Herbarium Specimen Image
        </h2>

        <p className="mt-1 text-[12px] text-gray-500">
          Our AI model will automatically identify the
          plant and extract botanical data
        </p>

        <div className="mt-4 flex gap-2">

          <span className="rounded-full bg-[#f1f5f2] px-3 py-1 text-[11px] text-[#7a8e82]">
            High-resolution scan
          </span>

          <span className="rounded-full bg-[#f1f5f2] px-3 py-1 text-[11px] text-[#7a8e82]">
            Clear labelling
          </span>

          <span className="rounded-full bg-[#f1f5f2] px-3 py-1 text-[11px] text-[#7a8e82]">
            Multiple angles preferred
          </span>

        </div>

        <input
          id="aiSpecimenImage"
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleImageUpload}
          className="hidden"
        />

      </label>

      {/* ==========================================
          SELECTED IMAGE
      ========================================== */}

      {selectedImage && (
        <div className="mt-4 rounded-xl border border-[#dce7df] bg-white p-4">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-[13px] font-medium text-[#092b1b]">
                Selected specimen
              </p>

              <p className="mt-1 text-[12px] text-gray-500">
                {selectedImage.name}
              </p>
            </div>

            <div className="flex gap-2">

              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={isAnalyzing}
                className="rounded-lg border border-[#d5e2da] bg-white px-4 py-2.5 text-[13px] font-medium text-[#33483b]"
              >
                Remove
              </button>

              <button
                type="button"
                onClick={handleAIAnalysis}
                disabled={isAnalyzing}
                className="rounded-lg bg-[#16a34a] px-5 py-2.5 text-[13px] font-medium text-white hover:bg-[#12863c] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isAnalyzing
                  ? "Analyzing..."
                  : "Analyze with AI"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default AISubmission;