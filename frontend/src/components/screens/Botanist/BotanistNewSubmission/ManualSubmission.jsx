import { useState } from "react";
import {
  submissionApi,
  draftSubmissionApi,
} from "../../../../api/authApi";

import FormInput from "../../../commons/Form/FormInput";
import FormSelect from "../../../commons/Form/FormSelect";
import FormSectionTitle from "../../../commons/Form/FormSelectionTitle";

const INITIAL_FORM_DATA = {
  name: "",
  family: "",
  species: "",
  location_code: "",
  collection_no: "",
  
  habitat: "",
  habit: "",
  flower_color: "",
  
  collector_name: "",
  collection_group_members: "",
  
  collection_date: "",
  locality: "",
  
  latitude: "",
  longitude: "",
  image: null
};

const ManualSubmission = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  // CREATE PAYLOAD
  // ==========================================

//   const createPayload = () => {
//     return {
//       name: formData.name.trim(),
//       family: formData.family.trim(),
//       species: formData.species.trim(),

//       location_code: formData.location_code.trim(),
//       collection_no: formData.collection_no.trim(),

//       habitat: formData.habitat.trim(),
//       habit: formData.habit.trim(),
//       flower_color: formData.flower_color.trim(),

//       collector_name: formData.collector_name.trim(),
//       collection_group_members:
//         formData.collection_group_members.trim(),

//       collection_date: formData.collection_date || null,
//       locality: formData.locality.trim(),

//       latitude:
//         formData.latitude === ""
//           ? null
//           : Number(formData.latitude),

//       longitude:
//         formData.longitude === ""
//           ? null
//           : Number(formData.longitude),
//     };
//   };
const createFormData = () => {
    const data = new FormData();

    data.append("name", formData.name.trim());
    data.append("family", formData.family.trim());
    data.append("species", formData.species.trim());

    data.append(
        "location_code",
        formData.location_code.trim()
    );

    data.append(
        "collection_no",
        formData.collection_no.trim()
    );

    data.append(
        "habitat",
        formData.habitat.trim()
    );

    data.append(
        "habit",
        formData.habit.trim()
    );

    data.append(
        "flower_color",
        formData.flower_color.trim()
    );

    data.append(
        "collector_name",
        formData.collector_name.trim()
    );

    data.append(
        "collection_group_members",
        formData.collection_group_members.trim()
    );

    data.append(
        "collection_date",
        formData.collection_date || ""
    );

    data.append(
        "locality",
        formData.locality.trim()
    );

    data.append(
        "latitude",
        formData.latitude || ""
    );

    data.append(
        "longitude",
        formData.longitude || ""
    );

    // Add image
    if (formData.image) {
        data.append("image", formData.image);
    }

    return data;
};



//   ==========================================
//   hnadleImageChange
//   ==========================================

const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
        alert("Please select an image file.");
        return;
    }

    // Validate file size - 5 MB
    if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5 MB.");
        return;
    }

    setFormData((prev) => ({
        ...prev,
        image: file,
    }));
};


//   ==========================================
//   SUBMIT
//   ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const payload = createFormData();

      console.log("Sending submission:", payload);

      for (const [key, value] of payload.entries()) {
            console.log(key, value);
        }

      const response = await submissionApi(payload);

      console.log(
        "Submission successful:",
        response.data
      );

      alert("Plant submission sent successfully!");

      setFormData(INITIAL_FORM_DATA);
    } catch (error) {
      console.error("Submission failed:", error);

      console.error(
        "Backend response:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Failed to submit plant. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // SAVE DRAFT
  // ==========================================

  const handleSaveDraft = async () => {
    try {
      setIsSubmitting(true);

      const payload = {
        ...createFormData(),
        status: "draft",
      };

      console.log("Saving draft:", payload);

      const response = await draftSubmissionApi(payload);

      console.log(
        "Draft saved:",
        response.data
      );

      alert("Draft saved successfully!");
    } catch (error) {
      console.error("Draft save failed:", error);

      alert(
        error.response?.data?.message ||
          "Failed to save draft."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mt-6 rounded-xl border border-[#dce7df] bg-white p-6">

        {/* ==========================================
            TAXONOMIC INFORMATION
        ========================================== */}

        <FormSectionTitle title="Taxonomic Information" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

          <FormInput
            label="Scientific Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Adiantum capillus-veneris"
            required
          />

          <FormInput
            label="Species"
            name="species"
            value={formData.species}
            onChange={handleChange}
            placeholder="e.g. capillus-veneris"
            required
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

          <FormInput
            label="Habit"
            name="habit"
            value={formData.habit}
            onChange={handleChange}
            placeholder="e.g. Herb, Shrub, Tree"
          />

          <FormInput
            label="Flower Color"
            name="flower_color"
            value={formData.flower_color}
            onChange={handleChange}
            placeholder="e.g. White, Yellow, Purple"
          />

        </div>

        {/* ==========================================
            COLLECTION DETAILS
        ========================================== */}

        <div className="mt-7">

          <FormSectionTitle title="Collection Details" />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <FormInput
              label="Collection No."
              name="collection_no"
              value={formData.collection_no}
              onChange={handleChange}
              placeholder="e.g. COL-2026-001"
            />

            <FormInput
              label="Location Code"
              name="location_code"
              value={formData.location_code}
              onChange={handleChange}
              placeholder="e.g. KHI-UOK-001"
            />

            <FormInput
              label="Collector Name"
              name="collector_name"
              value={formData.collector_name}
              onChange={handleChange}
              placeholder="e.g. Dr. Ahmad Khan"
              required
            />

            <FormInput
              label="Collection Group Members"
              name="collection_group_members"
              value={formData.collection_group_members}
              onChange={handleChange}
              placeholder="e.g. Ali, Ahmed, Sara"
            />

          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">

            <FormInput
              label="Collection Date"
              name="collection_date"
              type="date"
              value={formData.collection_date}
              onChange={handleChange}
              required
            />

            <FormInput
              label="Locality"
              name="locality"
              value={formData.locality}
              onChange={handleChange}
              placeholder="e.g. University of Karachi Botanical Garden"
            />

          </div>

          <div className="mt-4">

            <label className="mb-2 block text-[13px] font-medium text-[#0b2d1d]">
              Habitat
            </label>

            <textarea
              name="habitat"
              value={formData.habitat}
              onChange={handleChange}
              rows={3}
              placeholder="e.g. Rocky slopes, riverbanks, forest floor..."
              className="w-full resize-none rounded-lg border border-[#cfe4d5] bg-[#f1fbf4] px-3 py-3 text-[13px] outline-none placeholder:text-[#88a496] focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]"
            />

          </div>

        </div>

        {/* ==========================================
            GEOGRAPHIC INFORMATION
        ========================================== */}

        <div className="mt-7">

          <FormSectionTitle title="Geographic Information" />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <FormInput
              label="Latitude"
              name="latitude"
              type="number"
              step="any"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="e.g. 24.9412"
            />

            <FormInput
              label="Longitude"
              name="longitude"
              type="number"
              step="any"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="e.g. 67.1148"
            />

          </div>

        </div>

        {/* ==========================================
            IMAGE
        ========================================== */}

        <div className="mt-7">

          <FormSectionTitle title="Plant Images" />

          <label
            htmlFor="image"
            className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#cbded1] bg-[#f5faf7] hover:border-[#16a34a]"
          >

            <p className="text-[14px] font-medium text-[#0b2d1d]">
              Upload plant images
            </p>

            <p className="mt-1 text-[11px] text-[#739080]">
              Whole plant, leaves, flowers, seeds — JPG/PNG,
              max 20MB each
            </p>

            <input
              id="image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />
             {formData.image && (
        <p>
            Selected image: {formData.image.name}
        </p>
    )}

          </label>


        </div>

        {/* ==========================================
            ACTIONS
        ========================================== */}

        <div className="mt-7 flex justify-end gap-3">

          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="rounded-lg border border-[#d5e2da] bg-white px-5 py-2.5 text-[13px] font-medium text-[#33483b] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save as Draft
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-[#16a34a] px-6 py-2.5 text-[13px] font-medium text-white hover:bg-[#12863c] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "Submitting..."
              : "Submit for Review"}
          </button>

        </div>

      </div>
    </form>
  );
};

export default ManualSubmission;