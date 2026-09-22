import React, { useState, useEffect, useCallback } from "react";
import { fetchHerbariumRecords } from "../../../api/plantApi"; // Adjust import path as needed
import { FiSearch, FiEye, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";

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

    const fetchRecords = useCallback(async () => {
        try {
            setLoading(true);
            const params = {
                search,
                family: selectedFamily,
                scientificName: selectedScientificName,
                page,
                limit:10
            };

            const data = await fetchHerbariumRecords(params);

            const { records = [], pagination = {}, filters = {} } = data || {};

            setRecords(records);
            setTotalRecords(pagination.totalRecords || 0);
            setTotalPages(pagination.totalPages || 1);

            setFamiliesOptions(filters.families || []);
            setScientificNameOptions(filters.scientificNames || []);
        } catch (error) {
            console.error("Error fetching herbarium records:", error);
        } finally {
            setLoading(false);
        }
    }, [search, selectedFamily, selectedScientificName, page, limit]);

    useEffect(() => {
        fetchRecords();
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

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? "N/A" : date.toISOString().split("T")[0];
    };

    return (
        <div className="max-w-7xl mx-auto p-6 font-sans space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Plant Records</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {totalRecords} verified records in the herbarium database
                    </p>
                </div>
            
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1">
                    <div className="relative flex-1 max-w-sm">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
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
                        <option value="">All Scientific Names</option>
                        {scientificNameOptions.map((name) => (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                <th className="py-3.5 px-4">RECORD ID</th>
                                <th className="py-3.5 px-4">SCIENTIFIC NAME</th>
                                <th className="py-3.5 px-4">SPECIES</th>
                                <th className="py-3.5 px-4">FAMILY</th>
                                <th className="py-3.5 px-4">COLLECTOR NAME</th>
                                <th className="py-3.5 px-4">COLLECTION DATE</th>
                                <th className="py-3.5 px-4 text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs">
                            {loading ? (
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
                                    <tr key={ record.id ||record.recordID} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3.5 px-4 font-mono font-medium text-gray-500">
                                            {record.recordID}
                                        </td>
                                        <td className="py-3.5 px-4 font-semibold italic text-gray-900">
                                            {record.scientificName}
                                        </td>
                                        <td className="py-3.5 px-4 text-gray-600">
                                            {record.species || "N/A"}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium text-[11px]">
                                                {record.family}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-gray-700 font-medium">
                                            {record.collectorName || "N/A"}
                                        </td>
                                        <td className="py-3.5 px-4 text-gray-500 font-mono">
                                            {formatDate(record.collectionDate)}
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <div className="inline-flex items-center gap-2 text-gray-400">
                                                <button className="hover:text-gray-700 transition-colors p-1">
                                                    <FiEye size={15} />
                                                </button>
                                                <button className="hover:text-green-600 transition-colors p-1">
                                                    <FiEdit2 size={15} />
                                                </button>
                                                <button className="hover:text-red-500 transition-colors p-1">
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

                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
                        <div>
                            Page <span className="font-semibold text-gray-700">{page}</span> of{" "}
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
                                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                className="px-3 py-1.5 border border-gray-200 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 font-medium"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HerbariumData;