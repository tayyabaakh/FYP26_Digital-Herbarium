import { useEffect, useMemo, useState } from "react";
import {
    Search,
    Eye,
    MessageSquare,
    ChevronRight
} from "lucide-react";

import { getMySubmissionsApi } from "../../../../../api/authApi";


const MySubmissions = () => {

    const [submissions, setSubmissions] = useState([]);
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================================
    // FETCH SUBMISSIONS
    // ==========================================

    const fetchSubmissions = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await getMySubmissionsApi();

            setSubmissions(response.submissions || []);

        } catch (error) {

            console.error(
                "Failed to fetch submissions:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load submissions."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        fetchSubmissions();
    }, []);


    // ==========================================
    // STATUS COUNTS
    // ==========================================

    const counts = useMemo(() => {

        return {
            all: submissions.length,

            approved: submissions.filter(
                item => item.status === "approved"
            ).length,

            pending: submissions.filter(
                item => item.status === "pending"
            ).length,

            rejected: submissions.filter(
                item => item.status === "rejected"
            ).length,

            revision: submissions.filter(
                item =>
                    item.status === "revision" ||
                    item.status === "changes_requested"
            ).length
        };

    }, [submissions]);


    // ==========================================
    // FILTER + SEARCH
    // ==========================================

    const filteredSubmissions = useMemo(() => {

        const searchValue =
            search.toLowerCase().trim();


        return submissions.filter((submission) => {

            const matchesSearch =
                !searchValue ||
                submission.name
                    ?.toLowerCase()
                    .includes(searchValue) ||
                submission.family
                    ?.toLowerCase()
                    .includes(searchValue) ||
                submission.species
                    ?.toLowerCase()
                    .includes(searchValue);


            const matchesFilter =
                activeFilter === "all" ||
                submission.status === activeFilter ||
                (
                    activeFilter === "revision" &&
                    (
                        submission.status === "revision" ||
                        submission.status === "changes_requested"
                    )
                );


            return matchesSearch && matchesFilter;

        });

    }, [submissions, search, activeFilter]);


    // ==========================================
    // STATUS BADGE
    // ==========================================

    const getStatusBadge = (status) => {

        const normalizedStatus =
            status?.toLowerCase();


        switch (normalizedStatus) {

            case "approved":
                return (
                    <span className="inline-flex rounded-full bg-[#dcfce7] px-3 py-1 text-[11px] font-medium text-[#15803d]">
                        Approved
                    </span>
                );


            case "pending":
                return (
                    <span className="inline-flex rounded-full bg-[#fef3c7] px-3 py-1 text-[11px] font-medium text-[#b45309]">
                        Pending
                    </span>
                );


            case "rejected":
                return (
                    <span className="inline-flex rounded-full bg-[#fee2e2] px-3 py-1 text-[11px] font-medium text-[#dc2626]">
                        Rejected
                    </span>
                );


            case "revision":
            case "changes_requested":
                return (
                    <span className="inline-flex rounded-full bg-[#dbeafe] px-3 py-1 text-[11px] font-medium text-[#2563eb]">
                        Revision
                    </span>
                );


            case "draft":
                return (
                    <span className="inline-flex rounded-full bg-[#f3f4f6] px-3 py-1 text-[11px] font-medium text-[#4b5563]">
                        Draft
                    </span>
                );


            default:
                return (
                    <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-600">
                        {status || "Unknown"}
                    </span>
                );
        }
    };


    // ==========================================
    // DATE FORMAT
    // ==========================================

    const formatDate = (date) => {

        if (!date) return "—";

        return new Date(date)
            .toISOString()
            .split("T")[0];
    };


    // ==========================================
    // FILTER BUTTON
    // ==========================================

    const FilterButton = ({
        label,
        value,
        count
    }) => {

        const active =
            activeFilter === value;


        return (
            <button
                type="button"
                onClick={() => setActiveFilter(value)}
                className={`
                    rounded-lg border px-4 py-2
                    text-[12px] font-medium
                    transition
                    ${
                        active
                            ? "border-[#16a34a] bg-[#16a34a] text-white"
                            : "border-[#dce7df] bg-white text-[#607568] hover:border-[#b9d4c1]"
                    }
                `}
            >
                {label} ({count})
            </button>
        );
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="min-h-full bg-[#f7faf8] p-6">

                <div className="mb-6">
                    <div className="h-7 w-52 animate-pulse rounded bg-[#e4eee8]" />
                    <div className="mt-2 h-4 w-80 animate-pulse rounded bg-[#e4eee8]" />
                </div>

                <div className="h-12 animate-pulse rounded-xl bg-white" />

                <div className="mt-5 h-72 animate-pulse rounded-xl bg-white" />

            </div>
        );
    }


    // ==========================================
    // UI
    // ==========================================

    return (
        <div className="min-h-full bg-[#f7faf8] p-6">

            {/* ==========================================
                PAGE HEADER
            ========================================== */}

            <div className="mb-5">

                <h1 className="text-[22px] font-semibold text-[#10261a]">
                    My Submissions
                </h1>

                <p className="mt-1 text-[13px] text-[#718579]">
                    Track all your herbarium submissions and admin feedback
                </p>

            </div>


            {/* ==========================================
                SEARCH + FILTERS
            ========================================== */}

            <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">

                {/* SEARCH */}

                <div className="relative w-full xl:w-[320px]">

                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7c9385]"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search submissions..."
                        className="
                            w-full
                            rounded-lg
                            border border-[#dce7df]
                            bg-white
                            py-2.5
                            pl-9
                            pr-3
                            text-[12px]
                            text-[#243b2e]
                            outline-none
                            placeholder:text-[#9aac9f]
                            focus:border-[#16a34a]
                            focus:ring-1
                            focus:ring-[#16a34a]
                        "
                    />

                </div>


                {/* FILTERS */}

                <div className="flex flex-wrap gap-2">

                    <FilterButton
                        label="All"
                        value="all"
                        count={counts.all}
                    />

                    <FilterButton
                        label="Approved"
                        value="approved"
                        count={counts.approved}
                    />

                    <FilterButton
                        label="Pending"
                        value="pending"
                        count={counts.pending}
                    />

                    <FilterButton
                        label="Rejected"
                        value="rejected"
                        count={counts.rejected}
                    />

                    <FilterButton
                        label="Revision"
                        value="revision"
                        count={counts.revision}
                    />

                </div>

            </div>


            {/* ==========================================
                ERROR
            ========================================== */}

            {error && (

                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
                    {error}
                </div>

            )}


            {/* ==========================================
                TABLE
            ========================================== */}

            <div className="overflow-hidden rounded-xl border border-[#dce7df] bg-white">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[950px]">

                        {/* TABLE HEADER */}

                        <thead>

                            <tr className="border-b border-[#dce7df] bg-[#f2f7f4]">

                                <th className="px-5 py-4 text-left text-[11px] font-medium uppercase tracking-wide text-[#587062]">
                                    Submission ID
                                </th>

                                <th className="px-5 py-4 text-left text-[11px] font-medium uppercase tracking-wide text-[#587062]">
                                    Plant Name
                                </th>

                                <th className="px-5 py-4 text-left text-[11px] font-medium uppercase tracking-wide text-[#587062]">
                                    Family
                                </th>

                                <th className="px-5 py-4 text-left text-[11px] font-medium uppercase tracking-wide text-[#587062]">
                                    Date Submitted
                                </th>

                                <th className="px-5 py-4 text-left text-[11px] font-medium uppercase tracking-wide text-[#587062]">
                                    Status
                                </th>

                                <th className="px-5 py-4 text-left text-[11px] font-medium uppercase tracking-wide text-[#587062]">
                                    Feedback
                                </th>

                                <th className="px-5 py-4 text-left text-[11px] font-medium uppercase tracking-wide text-[#587062]">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        {/* TABLE BODY */}

                        <tbody>

                            {filteredSubmissions.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="px-6 py-16 text-center"
                                    >

                                        <div className="text-[14px] font-medium text-[#40594b]">
                                            No submissions found
                                        </div>

                                        <p className="mt-1 text-[12px] text-[#8a9d91]">
                                            Try changing your search or filter.
                                        </p>

                                    </td>

                                </tr>

                            ) : (

                                filteredSubmissions.map((submission) => (

                                    <tr
                                        key={submission.id}
                                        className="border-b border-[#e4ebe6] last:border-b-0 hover:bg-[#fafcfb]"
                                    >

                                        {/* ID */}

                                        <td className="px-5 py-4">

                                            <span className="font-mono text-[11px] text-[#5e7768]">
                                                SUB-
                                                {String(
                                                    submission.id
                                                ).padStart(6, "0")}
                                            </span>

                                        </td>


                                        {/* PLANT */}

                                        <td className="px-5 py-4">

                                            <div className="max-w-[220px]">

                                                <p className="text-[13px] font-medium text-[#111d16]">
                                                    {submission.name || "—"}
                                                </p>

                                                {submission.species && (
                                                    <p className="mt-0.5 text-[11px] italic text-[#8a9b91]">
                                                        {submission.species}
                                                    </p>
                                                )}

                                            </div>

                                        </td>


                                        {/* FAMILY */}

                                        <td className="px-5 py-4">

                                            <span className="text-[12px] text-[#708277]">
                                                {submission.family || "—"}
                                            </span>

                                        </td>


                                        {/* DATE */}

                                        <td className="px-5 py-4">

                                            <span className="text-[12px] text-[#708277]">
                                                {formatDate(
                                                    submission.created_at ||
                                                    submission.collection_date
                                                )}
                                            </span>

                                        </td>


                                        {/* STATUS */}

                                        <td className="px-5 py-4">

                                            {getStatusBadge(
                                                submission.status
                                            )}

                                        </td>


                                        {/* FEEDBACK */}

                                        <td className="px-5 py-4">

                                            {submission.feedback ? (

                                                <button
                                                    type="button"
                                                    className="inline-flex items-center gap-1 text-[12px] font-medium text-[#16a34a] hover:text-[#12863c]"
                                                >

                                                    <MessageSquare
                                                        size={13}
                                                    />

                                                    View

                                                </button>

                                            ) : (

                                                <span className="text-[12px] text-[#a2b0a8]">
                                                    —
                                                </span>

                                            )}

                                        </td>


                                        {/* ACTION */}

                                        <td className="px-5 py-4">

                                            <button
                                                type="button"
                                                title="View submission"
                                                className="rounded-md p-1.5 text-[#718579] transition hover:bg-[#edf6f0] hover:text-[#16a34a]"
                                            >

                                                <Eye size={16} />

                                            </button>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* ==========================================
                FOOTER
            ========================================== */}

            <div className="mt-4 flex items-center justify-between text-[11px] text-[#829389]">

                <span>
                    Showing {filteredSubmissions.length} of{" "}
                    {submissions.length} submissions
                </span>

                <ChevronRight size={14} />

            </div>

        </div>
    );
};


export default MySubmissions;