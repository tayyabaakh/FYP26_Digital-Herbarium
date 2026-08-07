// // import React from 'react'

// // const BotanistNewSubmission = () => {
// //   return (
// //     <>
// //     <div className="flex flex-col p-2 m-2 ml-30 mr-30">
// //     <div className="flex flex-col p-2">
// //       <h1 className="text-2xl font-medium mb-2 ">New Plant Submission</h1>
// //       <p className="text-green-700 text-md font-normal mb-2">Add a new specimen to the Flora-Digitalis herbarium</p>
// //      </div>
// //     {/* <div className="flex flex-col p-2"> */}
        
// //         {/* <form className="flex flex-col gap-4">
// //             <div className="flex flex-col gap-2">
// //                 <label htmlFor="specimenName" className="font-semibold">Specimen Name</label>
// //                 <input type="text" id="specimenName" name="specimenName" className="border border-gray-300 rounded p-2" />
// //             </div>
// //             <div className="flex flex-col gap-2">
// //                 <label htmlFor="specimenDescription" className="font-semibold">Specimen Description</label>
// //                 <textarea id="specimenDescription" name="specimenDescription" className="border border-gray-300 rounded p-2" rows="4"></textarea>
// //             </div>
// //             <div className="flex flex-col gap-2">
// //                 <label htmlFor="specimenImage" className="font-semibold">Specimen Image</label>
// //                 <input type="file" id="specimenImage" name="specimenImage" className="border border-gray-300 rounded p-2" />
// //             </div>
// //             <button type="submit" className="bg-green-700 text-white font-semibold py-2 px-4 rounded hover:bg-green-800 transition duration-300">Submit</button>
// //         </form> */}
// //     {/* </div> */}
// //     <div className="bg-white p-5 rounded-2xl border border-gray-100/80 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
// //           <button class="bg-green-100 text-black-800 font-semibold py-2 px-4 border border-green-700 rounded shadow" image="https://via.placeholder.com/150" alt="Upload Image">
// //   Button
// // </button>
// //         </div>
    
// //     </div>
    
// //     </>
// //   )
// // }

// // export default BotanistNewSubmission


// import { useState } from "react";

// const BotanistNewSubmission = () => {
//   const [submissionMode, setSubmissionMode] = useState("manual");

//   const [formData, setFormData] = useState({
//     scientificName: "",
//     commonName: "",
//     family: "",
//     province: "",
//     habitat: "",
//     collectorName: "",
//     collectionDate: "",
//     latitude: "",
//     longitude: "",
//     description: "",
//     images: [],
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files);

//     setFormData((prev) => ({
//       ...prev,
//       images: files,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     console.log("Submission Data:", formData);
//   };

//   const handleSaveDraft = () => {
//     console.log("Saving draft:", formData);
//   };

//   return (
//     <div className="min-h-full bg-[#f7faf8] px-6 py-7">
//       {/* ================= PAGE HEADER ================= */}
//       <div className="mx-auto max-w-[840px]">
//         <h1 className="text-[22px] font-semibold text-[#092b1b]">
//           New Plant Submission
//         </h1>

//         <p className="mt-1 text-[14px] text-gray-500">
//           Add a new specimen to the Flora-Digitalis herbarium
//         </p>

//         {/* ================= SUBMISSION MODE ================= */}
//         <div className="mt-6 flex gap-3">
//           {/* Manual Entry */}
//           <button
//             type="button"
//             onClick={() => setSubmissionMode("manual")}
//             className={`flex h-[61px] w-[192px] items-center gap-3 rounded-xl border px-5 text-left transition ${
//               submissionMode === "manual"
//                 ? "border-[#16a34a] bg-[#eafff0]"
//                 : "border-[#dce7df] bg-white hover:border-[#b9c9bf]"
//             }`}
//           >
//             <div className="text-[20px]">📋</div>

//             <div>
//               <p className="text-[14px] font-medium text-[#0b2d1d]">
//                 Manual Entry
//               </p>

//               <p className="mt-0.5 text-[11px] text-gray-500">
//                 Fill in all fields manually
//               </p>
//             </div>
//           </button>

//           {/* AI Assisted */}
//           <button
//             type="button"
//             onClick={() => setSubmissionMode("ai")}
//             className={`flex h-[61px] w-[228px] items-center gap-3 rounded-xl border px-5 text-left transition ${
//               submissionMode === "ai"
//                 ? "border-[#16a34a] bg-[#eafff0]"
//                 : "border-[#dce7df] bg-white hover:border-[#b9c9bf]"
//             }`}
//           >
//             <div className="text-[20px]">🤖</div>

//             <div>
//               <p className="text-[14px] font-medium text-[#0b2d1d]">
//                 AI-Assisted
//               </p>

//               <p className="mt-0.5 text-[11px] text-gray-500">
//                 Upload image, auto-fill with AI
//               </p>
//             </div>
//           </button>
//         </div>

//         {/* ================= FORM ================= */}
//         <form onSubmit={handleSubmit}>
//           <div className="mt-6 rounded-xl border border-[#dce7df] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
//             {/* ================= TAXONOMIC INFORMATION ================= */}
//             <FormSectionTitle title="Taxonomic Information" />

//             <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
//               <FormInput
//                 label="Scientific Name"
//                 name="scientificName"
//                 value={formData.scientificName}
//                 onChange={handleChange}
//                 placeholder="e.g. Adiantum capillus-veneris"
//                 required
//               />

//               <FormInput
//                 label="Common Name"
//                 name="commonName"
//                 value={formData.commonName}
//                 onChange={handleChange}
//                 placeholder="e.g. Maidenhair Fern"
//               />

//               <FormSelect
//                 label="Family"
//                 name="family"
//                 value={formData.family}
//                 onChange={handleChange}
//                 required
//                 options={[
//                   "Pteridaceae",
//                   "Asteraceae",
//                   "Fabaceae",
//                   "Poaceae",
//                   "Rosaceae",
//                   "Solanaceae",
//                 ]}
//               />

//               <FormSelect
//                 label="Province"
//                 name="province"
//                 value={formData.province}
//                 onChange={handleChange}
//                 required
//                 options={[
//                   "Sindh",
//                   "Punjab",
//                   "Balochistan",
//                   "Khyber Pakhtunkhwa",
//                   "Gilgit-Baltistan",
//                   "Azad Jammu & Kashmir",
//                 ]}
//               />
//             </div>

//             {/* ================= COLLECTION DETAILS ================= */}
//             <div className="mt-7">
//               <FormSectionTitle title="Collection Details" />

//               <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
//                 <FormInput
//                   label="Habitat"
//                   name="habitat"
//                   value={formData.habitat}
//                   onChange={handleChange}
//                   placeholder="e.g. Rocky slopes, riverbanks"
//                 />

//                 <FormInput
//                   label="Collector Name"
//                   name="collectorName"
//                   value={formData.collectorName}
//                   onChange={handleChange}
//                   placeholder="e.g. Dr. Ahmad Khan"
//                   required
//                 />
//               </div>

//               <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-3">
//                 <FormInput
//                   label="Collection Date"
//                   name="collectionDate"
//                   type="date"
//                   value={formData.collectionDate}
//                   onChange={handleChange}
//                   required
//                 />

//                 <FormInput
//                   label="Latitude"
//                   name="latitude"
//                   value={formData.latitude}
//                   onChange={handleChange}
//                   placeholder="33.7291"
//                 />

//                 <FormInput
//                   label="Longitude"
//                   name="longitude"
//                   value={formData.longitude}
//                   onChange={handleChange}
//                   placeholder="73.0931"
//                 />
//               </div>
//             </div>

//             {/* ================= DESCRIPTION ================= */}
//             <div className="mt-7">
//               <label className="mb-2 block text-[13px] font-medium text-[#0b2d1d]">
//                 Description / Notes
//               </label>

//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 rows={4}
//                 placeholder="Detailed botanical description, morphological features, ecological context..."
//                 className="w-full resize-none rounded-lg border border-[#cfe4d5] bg-[#f1fbf4] px-3 py-3 text-[13px] text-[#163b29] outline-none transition placeholder:text-[#88a496] focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]"
//               />
//             </div>

//             {/* ================= IMAGE UPLOAD ================= */}
//             <div className="mt-7">
//               <FormSectionTitle title="Plant Images" />

//               <label
//                 htmlFor="plantImages"
//                 className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#cbded1] bg-[#f5faf7] transition hover:border-[#16a34a] hover:bg-[#effaf2]"
//               >
//                 <div className="mb-3 text-[#6d8876]">
//                   <svg
//                     width="30"
//                     height="30"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="1.7"
//                   >
//                     <path d="M4 7h3l2-2h6l2 2h3v12H4V7Z" />
//                     <circle cx="12" cy="13" r="3.5" />
//                   </svg>
//                 </div>

//                 <p className="text-[14px] font-medium text-[#0b2d1d]">
//                   Upload plant images
//                 </p>

//                 <p className="mt-1 text-[11px] text-[#739080]">
//                   Whole plant, leaves, flowers, seeds — JPG/PNG, max 20MB each
//                 </p>

//                 <input
//                   id="plantImages"
//                   type="file"
//                   multiple
//                   accept="image/jpeg,image/png"
//                   onChange={handleImageUpload}
//                   className="hidden"
//                 />
//               </label>

//               {/* Selected files */}
//               {formData.images.length > 0 && (
//                 <div className="mt-3">
//                   <p className="mb-2 text-xs font-medium text-gray-600">
//                     Selected images
//                   </p>

//                   <div className="space-y-1">
//                     {formData.images.map((file, index) => (
//                       <div
//                         key={index}
//                         className="rounded-md bg-[#f1f7f3] px-3 py-2 text-xs text-gray-600"
//                       >
//                         {file.name}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* ================= BUTTONS ================= */}
//             <div className="mt-7 flex justify-end gap-3">
//               <button
//                 type="button"
//                 onClick={handleSaveDraft}
//                 className="rounded-lg border border-[#d5e2da] bg-white px-5 py-2.5 text-[13px] font-medium text-[#33483b] transition hover:bg-[#f5f8f6]"
//               >
//                 Save as Draft
//               </button>

//               <button
//                 type="submit"
//                 className="rounded-lg bg-[#16a34a] px-6 py-2.5 text-[13px] font-medium text-white transition hover:bg-[#12863c]"
//               >
//                 Submit for Review
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// /* =========================================================
//    REUSABLE FORM COMPONENTS
// ========================================================= */

// const FormSectionTitle = ({ title }) => {
//   return (
//     <div className="mb-4 border-b border-[#dce7df] pb-2">
//       <h2 className="text-[13px] font-medium text-[#0b2d1d]">{title}</h2>
//     </div>
//   );
// };

// const FormInput = ({
//   label,
//   name,
//   value,
//   onChange,
//   placeholder,
//   type = "text",
//   required = false,
// }) => {
//   return (
//     <div>
//       <label className="mb-2 block text-[13px] font-medium text-[#0b2d1d]">
//         {label}
//         {required && <span className="ml-1 text-red-500">*</span>}
//       </label>

//       <input
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         required={required}
//         className="h-10 w-full rounded-lg border border-[#cfe4d5] bg-[#f1fbf4] px-3 text-[13px] text-[#163b29] outline-none transition placeholder:text-[#88a496] focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]"
//       />
//     </div>
//   );
// };

// const FormSelect = ({
//   label,
//   name,
//   value,
//   onChange,
//   options,
//   required = false,
// }) => {
//   return (
//     <div>
//       <label className="mb-2 block text-[13px] font-medium text-[#0b2d1d]">
//         {label}
//         {required && <span className="ml-1 text-red-500">*</span>}
//       </label>

//       <select
//         name={name}
//         value={value}
//         onChange={onChange}
//         required={required}
//         className="h-10 w-full rounded-lg border border-[#cfe4d5] bg-[#f1fbf4] px-3 text-[13px] text-[#163b29] outline-none transition focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]"
//       >
//         <option value="">Select {label}...</option>

//         {options.map((option) => (
//           <option key={option} value={option}>
//             {option}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };

// export default BotanistNewSubmission;


import { useState } from "react";

const BotanistNewSubmission = () => {
  const [submissionMode, setSubmissionMode] = useState("manual");
  const [selectedImage, setSelectedImage] = useState(null);

  const [formData, setFormData] = useState({
    scientificName: "",
    commonName: "",
    family: "",
    province: "",
    habitat: "",
    collectorName: "",
    collectionDate: "",
    latitude: "",
    longitude: "",
    description: "",
  });

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // IMAGE UPLOAD
  // ==========================================

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Check file type
    const allowedTypes = ["image/jpeg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a JPG or PNG image.");
      return;
    }

    // Check 20MB limit
    if (file.size > 20 * 1024 * 1024) {
      alert("Image size must be less than 20MB.");
      return;
    }

    setSelectedImage(file);

    console.log("Selected image:", file);
  };

  // ==========================================
  // SUBMIT MANUAL FORM
  // ==========================================

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Plant submission:", formData);
  };

  // ==========================================
  // AI ANALYSIS
  // ==========================================

  const handleAIAnalysis = () => {
    if (!selectedImage) {
      alert("Please upload a specimen image first.");
      return;
    }

    console.log("Sending image to AI:", selectedImage);

    // Later this will call your backend:
    //
    // const formData = new FormData();
    // formData.append("image", selectedImage);
    //
    // axios.post("/api/ai/identify", formData)
    //   .then(response => {
    //      setFormData(response.data);
    //   });
  };

  return (
    <div className="min-h-full bg-[#f7faf8] px-6 py-7">

      {/* ==========================================
          CONTENT CONTAINER
      ========================================== */}

      <div className="mx-auto max-w-[840px]">

        {/* ==========================================
            PAGE TITLE
        ========================================== */}

        <div>
          <h1 className="text-[22px] font-semibold text-[#092b1b]">
            New Plant Submission
          </h1>

          <p className="mt-1 text-[14px] text-gray-500">
            Add a new specimen to the Flora-Digitalis herbarium
          </p>
        </div>

        {/* ==========================================
            MODE SELECTOR
        ========================================== */}

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


        {/* ==========================================
            CONDITIONAL CONTENT
        ========================================== */}

        {submissionMode === "manual" ? (

          /* ========================================
             MANUAL FORM
          ======================================== */

          <ManualSubmissionForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />

        ) : (

          /* ========================================
             AI SCREEN
          ======================================== */

          <AIUploadScreen
            selectedImage={selectedImage}
            handleImageUpload={handleImageUpload}
            handleAIAnalysis={handleAIAnalysis}
          />

        )}

      </div>

    </div>
  );
};


// ==================================================
// AI UPLOAD SCREEN
// ==================================================

const AIUploadScreen = ({
  selectedImage,
  handleImageUpload,
  handleAIAnalysis,
}) => {

  return (
    <div className="mt-6">

      {/* ==========================================
          UPLOAD CARD
      ========================================== */}

      <label
        htmlFor="aiSpecimenImage"
        className="flex min-h-[282px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#dce7df] bg-white transition hover:border-[#16a34a] hover:bg-[#fbfefc]"
      >

        {/* UPLOAD ICON */}

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


        {/* TITLE */}

        <h2 className="mt-5 text-[15px] font-medium text-[#092b1b]">
          Upload Herbarium Specimen Image
        </h2>


        {/* DESCRIPTION */}

        <p className="mt-1 text-[12px] text-gray-500">
          Our AI model will automatically identify the plant and extract botanical data
        </p>


        {/* TAGS */}

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


        {/* HIDDEN FILE INPUT */}

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

            <button
              type="button"
              onClick={handleAIAnalysis}
              className="rounded-lg bg-[#16a34a] px-5 py-2.5 text-[13px] font-medium text-white hover:bg-[#12863c]"
            >
              Analyze with AI
            </button>

          </div>

        </div>

      )}

    </div>
  );
};


// ==================================================
// MANUAL SUBMISSION FORM
// ==================================================

const ManualSubmissionForm = ({
  formData,
  handleChange,
  handleSubmit,
}) => {

  return (
    <form onSubmit={handleSubmit}>

      <div className="mt-6 rounded-xl border border-[#dce7df] bg-white p-6">

        {/* TAXONOMIC INFORMATION */}

        <FormSectionTitle title="Taxonomic Information" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

          <FormInput
            label="Scientific Name"
            name="scientificName"
            value={formData.scientificName}
            onChange={handleChange}
            placeholder="e.g. Adiantum capillus-veneris"
            required
          />

          <FormInput
            label="Common Name"
            name="commonName"
            value={formData.commonName}
            onChange={handleChange}
            placeholder="e.g. Maidenhair Fern"
          />

          <FormSelect
            label="Family"
            name="family"
            value={formData.family}
            onChange={handleChange}
            options={[
              "Pteridaceae",
              "Asteraceae",
              "Fabaceae",
              "Poaceae",
              "Rosaceae",
              "Solanaceae",
            ]}
            required
          />

          <FormSelect
            label="Province"
            name="province"
            value={formData.province}
            onChange={handleChange}
            options={[
              "Sindh",
              "Punjab",
              "Balochistan",
              "Khyber Pakhtunkhwa",
              "Gilgit-Baltistan",
              "Azad Jammu & Kashmir",
            ]}
            required
          />

        </div>


        {/* COLLECTION DETAILS */}

        <div className="mt-7">

          <FormSectionTitle title="Collection Details" />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <FormInput
              label="Habitat"
              name="habitat"
              value={formData.habitat}
              onChange={handleChange}
              placeholder="e.g. Rocky slopes, riverbanks"
            />

            <FormInput
              label="Collector Name"
              name="collectorName"
              value={formData.collectorName}
              onChange={handleChange}
              placeholder="e.g. Dr. Ahmad Khan"
              required
            />

          </div>


          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">

            <FormInput
              label="Collection Date"
              name="collectionDate"
              type="date"
              value={formData.collectionDate}
              onChange={handleChange}
              required
            />

            <FormInput
              label="Latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="33.7291"
            />

            <FormInput
              label="Longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="73.0931"
            />

          </div>

        </div>


        {/* DESCRIPTION */}

        <div className="mt-7">

          <label className="mb-2 block text-[13px] font-medium text-[#0b2d1d]">
            Description / Notes
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Detailed botanical description, morphological features, ecological context..."
            className="w-full resize-none rounded-lg border border-[#cfe4d5] bg-[#f1fbf4] px-3 py-3 text-[13px] outline-none placeholder:text-[#88a496] focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]"
          />

        </div>


        {/* IMAGE */}

        <div className="mt-7">

          <FormSectionTitle title="Plant Images" />

          <label
            htmlFor="plantImages"
            className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#cbded1] bg-[#f5faf7] hover:border-[#16a34a]"
          >

            <p className="text-[14px] font-medium text-[#0b2d1d]">
              Upload plant images
            </p>

            <p className="mt-1 text-[11px] text-[#739080]">
              Whole plant, leaves, flowers, seeds — JPG/PNG, max 20MB each
            </p>

            <input
              id="plantImages"
              type="file"
              multiple
              accept="image/jpeg,image/png"
              className="hidden"
            />

          </label>

        </div>


        {/* BUTTONS */}

        <div className="mt-7 flex justify-end gap-3">

          <button
            type="button"
            className="rounded-lg border border-[#d5e2da] bg-white px-5 py-2.5 text-[13px] font-medium text-[#33483b]"
          >
            Save as Draft
          </button>

          <button
            type="submit"
            className="rounded-lg bg-[#16a34a] px-6 py-2.5 text-[13px] font-medium text-white hover:bg-[#12863c]"
          >
            Submit for Review
          </button>

        </div>

      </div>

    </form>
  );
};


// ==================================================
// SECTION TITLE
// ==================================================

const FormSectionTitle = ({ title }) => {

  return (
    <div className="mb-4 border-b border-[#dce7df] pb-2">

      <h2 className="text-[13px] font-medium text-[#0b2d1d]">
        {title}
      </h2>

    </div>
  );
};


// ==================================================
// INPUT
// ==================================================

const FormInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) => {

  return (
    <div>

      <label className="mb-2 block text-[13px] font-medium text-[#0b2d1d]">

        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}

      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="h-10 w-full rounded-lg border border-[#cfe4d5] bg-[#f1fbf4] px-3 text-[13px] outline-none placeholder:text-[#88a496] focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]"
      />

    </div>
  );
};


// ==================================================
// SELECT
// ==================================================

const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}) => {

  return (
    <div>

      <label className="mb-2 block text-[13px] font-medium text-[#0b2d1d]">

        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}

      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="h-10 w-full rounded-lg border border-[#cfe4d5] bg-[#f1fbf4] px-3 text-[13px] outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]"
      >

        <option value="">
          Select {label}...
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}

      </select>

    </div>
  );
};


export default BotanistNewSubmission;