import React, { useState, useEffect, useCallback } from "react";
import {
  fetchHerbariumRecords,
  updateHerbariumRecord,
} from "../../../api/plantApi"; // Adjust path as needed
import {
  FiSearch,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiX,
  FiUpload,
  FiAlertCircle,
} from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";

const HerbariumData = () => {
  const [records, setRecords] = useState([]);
  const [familiesOptions, setFamiliesOptions] = useState([]);
  const [scientificNameOptions, setScientificNameOptions] = useState([]);

  // Filter states
  const [search, setSearch] = useState("");
  const [selectedFamily, setSelectedFamily] = useState("");
  const [selectedScientificName, setSelectedScientificName] = useState("");

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // UI Loading state
  const [loading, setLoading] = useState(false);

  // Admin & Editing Modal States
  const [isAdmin, setIsAdmin] = useState(true); // Set based on your auth state/localStorage
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null); // State for View Modal
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);

  // Confirmation Popup State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        search,
        family: selectedFamily,
        scientificName: selectedScientificName,
        page,
        limit: 10,
      };

      const data = await fetchHerbariumRecords(params);
      const { records = [], pagination = {}, filters = {} } = data || {};

      // 3-Tier Hierarchical Sorting: Family -> Genus -> Species
      const sortedRecords = [...records].sort((a, b) => {
        // 1. Compare Family
        const familyA = (a.family || "").toLowerCase();
        const familyB = (b.family || "").toLowerCase();
        const familyCompare = familyA.localeCompare(familyB, undefined, { sensitivity: "base" });
        if (familyCompare !== 0) return familyCompare;

        // 2. If Families are identical, compare Genus (Scientific Name)
        const genusA = (a.scientificName || a.name || "").toLowerCase();
        const genusB = (b.scientificName || b.name || "").toLowerCase();
        const genusCompare = genusA.localeCompare(genusB, undefined, { sensitivity: "base" });
        if (genusCompare !== 0) return genusCompare;

        // 3. If Genus are identical, compare Species
        const speciesA = (a.species || "").toLowerCase();
        const speciesB = (b.species || "").toLowerCase();
        return speciesA.localeCompare(speciesB, undefined, { sensitivity: "base" });
      });

      setRecords(sortedRecords);
      setTotalRecords(pagination.totalRecords || 0);
      setTotalPages(pagination.totalPages || 1);

      // Sort filter options alphabetically (A to Z)
      const sortedFamilies = [...(filters.families || [])].sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" })
      );
      const sortedScientificNames = [...(filters.scientificNames || [])].sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" })
      );

      setFamiliesOptions(sortedFamilies);
      setScientificNameOptions(sortedScientificNames);
    } catch (error) {
      console.error("Error fetching herbarium records:", error);
    } finally {
      setLoading(false);
    }
  }, [search, selectedFamily, selectedScientificName, page, limit]);

  useEffect(() => {
    fetchRecords();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user && user.role === "admin") {
      setIsAdmin(true);
    }
  }, [fetchRecords]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleFamilyChange = (e) => {
    setSelectedFamily(e.target.value);
    setPage(1);
  };

  const handleScientificNameChange = (e) => {
    setSelectedScientificName(e.target.value);
    setPage(1);
  };

  // Open Edit Modal
  const handleOpenEdit = (record) => {
    if (!isAdmin) {
      alert("Access denied. Only administrators can edit herbarium records.");
      return;
    }
    setEditingRecord(record);
    setFormData({ ...record });
    setImageFile(null);
  };

  // Handle Form Field Changes in Modal
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Trigger Confirmation before saving
  const handleInitiateSave = (e) => {
    e.preventDefault();
    setConfirmText("");
    setShowConfirmModal(true);
  };

  const handleConfirmUpdate = async () => {
    try {
      setLoading(true);
      const recordId =
        editingRecord.id ||
        editingRecord.recordID ||
        editingRecord.specimen_id_gh_number;

      const submissionData = new FormData();
      Object.keys(formData).forEach((key) => {
        submissionData.append(key, formData[key] || "");
      });
      if (imageFile) {
        submissionData.append("image", imageFile);
      }

      await updateHerbariumRecord(recordId, submissionData);

      setShowConfirmModal(false);
      setEditingRecord(null);
      fetchRecords();
      toast.success("Record successfully updated in the database!");
    } catch (error) {
      console.error("Error updating record:", error);
      toast.error("Failed to update record in the database.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 font-sans space-y-6">
      <ToastContainer />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plant Records</h1>
          <p className="text-sm text-gray-500 mt-1">
            {totalRecords} verified records in the herbarium database
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1">
          <div className="relative flex-1 max-w-sm">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search by ID, name, species..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#00a859] focus:bg-white transition-all"
            />
          </div>

          <select
            value={selectedFamily}
            onChange={handleFamilyChange}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00a859] focus:bg-white transition-all cursor-pointer"
          >
            <option value="">All Families</option>
            {familiesOptions.map((fam) => (
              <option key={fam} value={fam}>
                {fam}
              </option>
            ))}
          </select>

          <select
            value={selectedScientificName}
            onChange={handleScientificNameChange}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00a859] focus:bg-white transition-all cursor-pointer"
          >
            <option value="">All Genus</option>
            {scientificNameOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">RECORD ID</th>
                <th className="py-3.5 px-4">FAMILY</th>
                <th className="py-3.5 px-4">GENUS</th>
                <th className="py-3.5 px-4">SPECIES</th>
                <th className="py-3.5 px-4">COLLECTOR NAME</th>
                <th className="py-3.5 px-4">COLLECTION DATE</th>
                <th className="py-3.5 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {loading && records.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-400">
                    Loading records...
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-400">
                    No plant records found matching your query.
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr
                    key={record.id || record.recordID}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-medium text-gray-500">
                      {record.recordID || record.specimen_id_gh_number}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium text-[11px]">
                        {record.family || "N/A"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold italic text-gray-900">
                      {record.scientificName || record.name}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      {record.species || "N/A"}
                    </td>
                    <td className="py-3.5 px-4 text-gray-700 font-medium">
                      {record.collectorName || record.collector_name || "N/A"}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 font-mono">
                      {record.collectionDate || record.date || "N/A"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2 text-gray-400">
                        <button
                          onClick={() => setViewingRecord(record)}
                          className="hover:text-gray-700 transition-colors p-1"
                          title="View details"
                        >
                          <FiEye size={15} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(record)}
                          className="hover:text-green-600 transition-colors p-1"
                          title={
                            isAdmin
                              ? "Edit Record (Admin)"
                              : "Admin access required"
                          }
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          className="hover:text-red-500 transition-colors p-1"
                          title="Delete"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
            <div>
              Page <span className="font-semibold text-gray-700">{page}</span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">{totalPages}</span>
            </div>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 border border-gray-200 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 font-medium"
              >
                Previous
              </button>
              <button
                disabled={page === totalPages}
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="px-3 py-1.5 border border-gray-200 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ENLARGED FULL-SPECIMEN VIEW DETAILS MODAL */}
      {viewingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 lg:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-1">
                  {viewingRecord.family || "N/A"}
                </span>
                <h2 className="text-2xl font-serif font-bold text-gray-900">
                  <span className="italic">{viewingRecord.scientificName || viewingRecord.name || "N/A"}</span>{" "}
                  <span className="font-normal text-gray-700">{viewingRecord.species || ""}</span>
                </h2>
                <p className="text-xs text-gray-500 font-mono mt-1">
                  Specimen ID / GH Number: <span className="font-bold text-gray-800">{viewingRecord.recordID || viewingRecord.specimen_id_gh_number}</span>
                </p>
              </div>
              <button
                onClick={() => setViewingRecord(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiX size={22} />
              </button>
            </div>

            {/* Content Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Specimen Image Preview Column */}
              <div className="md:col-span-1 flex flex-col items-center">
                {viewingRecord.imageUrl || viewingRecord.image_url ? (
                  <div className="w-full h-72 bg-gray-50 rounded-xl overflow-hidden border border-gray-200 shadow-sm flex items-center justify-center">
                    <img
                      src={viewingRecord.imageUrl || viewingRecord.image_url}
                      alt="Specimen"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-72 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                    <span className="text-xs font-medium">No Image Specimen Available</span>
                  </div>
                )}
              </div>

              {/* Complete TiDB Fields Grid Column */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-1">
                  Taxonomic & Botanical Information
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                  <div>
                    <span className="block font-semibold text-gray-400 uppercase text-[10px]">Family</span>
                    <span className="font-bold text-emerald-800 text-sm">{viewingRecord.family || "N/A"}</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-gray-400 uppercase text-[10px]">Genus (Name)</span>
                    <span className="font-bold italic text-gray-900 text-sm">{viewingRecord.scientificName || viewingRecord.name || "N/A"}</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-gray-400 uppercase text-[10px]">Species</span>
                    <span className="text-gray-900 font-medium text-sm">{viewingRecord.species || "N/A"}</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-gray-400 uppercase text-[10px]">Author Citation</span>
                    <span className="text-gray-800 text-sm">{viewingRecord.author || "N/A"}</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-gray-400 uppercase text-[10px]">Habit</span>
                    <span className="text-gray-800 text-sm">{viewingRecord.habit || "N/A"}</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-gray-400 uppercase text-[10px]">Flower Color</span>
                    <span className="text-gray-800 text-sm">{viewingRecord.flower_color || "N/A"}</span>
                  </div>
                </div>

                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-1 pt-2">
                  Collection & Locality Data
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                  <div>
                    <span className="block font-semibold text-gray-400 uppercase text-[10px]">Collector Name</span>
                    <span className="text-gray-900 font-medium">{viewingRecord.collectorName || viewingRecord.collector_name || "N/A"}</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-gray-400 uppercase text-[10px]">Collection Number</span>
                    <span className="font-mono text-gray-800">{viewingRecord.collection_no || "N/A"}</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-gray-400 uppercase text-[10px]">Collection Date</span>
                    <span className="font-mono text-gray-800">{viewingRecord.collectionDate || viewingRecord.date || "N/A"}</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-gray-400 uppercase text-[10px]">Collector Group</span>
                    <span className="text-gray-800">{viewingRecord.collector_group_members || "N/A"}</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-gray-400 uppercase text-[10px]">Location Code</span>
                    <span className="font-mono text-gray-800">{viewingRecord.location_code || "N/A"}</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-gray-400 uppercase text-[10px]">Locality / Habitat</span>
                    <span className="text-gray-800">{viewingRecord.habitat || viewingRecord.locality || "N/A"}</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-gray-400 uppercase text-[10px]">Latitude</span>
                    <span className="font-mono text-gray-800">{viewingRecord.latitude ?? "N/A"}</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-gray-400 uppercase text-[10px]">Longitude</span>
                    <span className="font-mono text-gray-800">{viewingRecord.longitude ?? "N/A"}</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-gray-400 uppercase text-[10px]">Folders</span>
                    <span className="font-mono text-gray-800">{viewingRecord.collection_folder || viewingRecord.specimen_folder || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button
                type="button"
                onClick={() => setViewingRecord(null)}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-colors"
              >
                Close Specimen Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl space-y-6 my-8">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Admin Edit Herbarium Record
                </h3>
                <p className="text-xs text-gray-500">
                  Fill in missing fields or update specimen information.
                </p>
              </div>
              <button
                onClick={() => setEditingRecord(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleInitiateSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Family
                  </label>
                  <input
                    type="text"
                    name="family"
                    value={formData.family || ""}
                    onChange={handleFormChange}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00a859] outline-none"
                    placeholder="Enter family"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Genus
                  </label>
                  <input
                    type="text"
                    name="scientificName"
                    value={formData.scientificName || formData.name || ""}
                    onChange={handleFormChange}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00a859] outline-none"
                    placeholder="Enter scientific name"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Species
                  </label>
                  <input
                    type="text"
                    name="species"
                    value={formData.species || ""}
                    onChange={handleFormChange}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00a859] outline-none"
                    placeholder="Enter species"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Collector Name
                  </label>
                  <input
                    type="text"
                    name="collectorName"
                    value={
                      formData.collectorName || formData.collector_name || ""
                    }
                    onChange={handleFormChange}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00a859] outline-none"
                    placeholder="Enter collector name"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Collection Date
                  </label>
                  <input
                    type="text"
                    name="collectionDate"
                    value={formData.collectionDate || formData.date || ""}
                    onChange={handleFormChange}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00a859] outline-none font-mono"
                    placeholder="e.g., 12/1/1962"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Habitat / Locality
                  </label>
                  <input
                    type="text"
                    name="habitat"
                    value={formData.habitat || ""}
                    onChange={handleFormChange}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00a859] outline-none"
                    placeholder="Enter habitat"
                  />
                </div>
              </div>

              {/* Image Upload for missing specimen image */}
              <div className="pt-2 border-t">
                <label className="block font-medium text-gray-700 mb-1">
                  Upload / Replace Specimen Image
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 cursor-pointer hover:bg-emerald-100 transition-colors text-xs font-medium">
                    <FiUpload size={14} />
                    <span>Choose Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-gray-500 italic">
                    {imageFile
                      ? imageFile.name
                      : formData.image_url
                        ? "Current image on file"
                        : "No image uploaded yet"}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00a859] text-white rounded-lg text-xs font-medium hover:bg-[#008f4c] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION SECURITY POPUP */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <FiAlertCircle size={22} />
              <h3 className="text-base font-bold text-gray-900">
                Confirm Update
              </h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to save these changes to this herbarium
              record?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUpdate}
                className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors"
              >
                Yes, Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HerbariumData;