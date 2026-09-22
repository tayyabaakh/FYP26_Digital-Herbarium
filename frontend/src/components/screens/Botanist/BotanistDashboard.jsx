import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaLeaf,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaArrowRight,
  FaBell,
  FaRobot,
  FaSyncAlt,
} from "react-icons/fa";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";

import { getBotanistDashboardApi } from "../../../api/dashboardApi";


const BotanistDashboard = () => {
  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);


  // =========================================================
  // FETCH DASHBOARD
  // =========================================================

  const fetchDashboard = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await getBotanistDashboardApi();

      setDashboard(data);

    } catch (error) {
      console.error(
        "Failed to fetch botanist dashboard:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load dashboard data."
      );

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  // =========================================================
  // INITIAL FETCH
  // =========================================================

  useEffect(() => {
    fetchDashboard();
  }, []);


  // =========================================================
  // LOADING STATE
  // =========================================================

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-104px)] items-center justify-center bg-[#f7faf8]">

        <div className="text-center">

          <div
            className="
              mx-auto
              mb-3
              h-8
              w-8
              animate-spin
              rounded-full
              border-4
              border-green-200
              border-t-green-600
            "
          />

          <p className="text-sm text-gray-500">
            Loading your dashboard...
          </p>

        </div>

      </main>
    );
  }


  // =========================================================
  // ERROR STATE
  // =========================================================

  if (error) {
    return (
      <main
        className="
          flex
          min-h-[calc(100vh-104px)]
          items-center
          justify-center
          bg-[#f7faf8]
          px-5
        "
      >

        <div
          className="
            w-full
            max-w-md
            rounded-xl
            border
            border-red-200
            bg-white
            p-6
            text-center
            shadow-sm
          "
        >

          <div
            className="
              mx-auto
              mb-4
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-red-100
            "
          >
            <FaTimesCircle
              size={22}
              className="text-red-500"
            />
          </div>


          <h2 className="text-lg font-semibold text-[#062b1b]">
            Unable to load dashboard
          </h2>


          <p className="mt-2 text-sm text-gray-500">
            {error}
          </p>


          <button
            onClick={() => fetchDashboard()}
            className="
              mt-5
              inline-flex
              items-center
              gap-2
              rounded-lg
              bg-[#13a34a]
              px-5
              py-2.5
              text-sm
              font-medium
              text-white
              transition
              hover:bg-[#108b3f]
            "
          >
            <FaSyncAlt size={14} />

            Try Again
          </button>

        </div>

      </main>
    );
  }


  // =========================================================
  // NO DASHBOARD DATA
  // =========================================================

  if (!dashboard) {
    return null;
  }


  // =========================================================
  // DATA FROM API
  // =========================================================

  const {
    user = {},
    stats = {},
    recentActivity = [],
    monthlyContribution = [],
    submissionTrend = [],
    aiStats = {},
  } = dashboard;


  // =========================================================
  // CURRENT DATE
  // =========================================================

  const currentDate = new Date().toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );


  // =========================================================
  // GREETING
  // =========================================================

  const currentHour = new Date().getHours();

  let greeting = "Good morning";

  if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good afternoon";
  } else if (currentHour >= 17) {
    greeting = "Good evening";
  }


  // =========================================================
  // STAT CARDS
  // =========================================================

  const statCards = [
    {
      title: "TOTAL SUBMISSIONS",
      value: Number(stats.totalSubmissions || 0),
      icon: <FaLeaf size={22} />,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },

    {
      title: "APPROVED",
      value: Number(stats.approved || 0),
      icon: <FaCheckCircle size={22} />,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },

    {
      title: "PENDING REVIEW",
      value: Number(stats.pending || 0),
      icon: <FaClock size={22} />,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },

    {
      title: "REJECTED",
      value: Number(stats.rejected || 0),
      icon: <FaTimesCircle size={22} />,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];


  // =========================================================
  // APPROVAL RATE
  // =========================================================
  // IMPORTANT:
  // This is NOT a hook.
  // Therefore it is safe to calculate after
  // the loading/error conditional returns.

  const totalSubmissions = Number(
    stats.totalSubmissions || 0
  );

  const approvedSubmissions = Number(
    stats.approved || 0
  );

  const acceptanceRate =
    totalSubmissions === 0
      ? 0
      : Math.round(
          (approvedSubmissions / totalSubmissions) * 100
        );


  // =========================================================
  // MONTHLY CHART DATA
  // =========================================================

  const monthlyChartData = monthlyContribution.map(
    (item) => {

      let monthLabel = item.month;

      if (item.month) {

        const date = new Date(
          `${item.month}-01`
        );

        if (!Number.isNaN(date.getTime())) {

          monthLabel = date.toLocaleDateString(
            "en-US",
            {
              month: "short",
            }
          );

        }
      }

      return {
        month: monthLabel,

        submitted: Number(
          item.submitted || 0
        ),

        approved: Number(
          item.approved || 0
        ),
      };
    }
  );


  // =========================================================
  // WEEKLY CHART DATA
  // =========================================================

  const weeklyChartData = submissionTrend.map(
    (item, index) => ({
      week: `W${index + 1}`,

      submissions: Number(
        item.submissions || 0
      ),
    })
  );


  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {

    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString(
      "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };


  // =========================================================
  // RENDER
  // =========================================================

  return (
    <main className="min-h-[calc(100vh-104px)] bg-[#f7faf8] px-5 py-6">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          mb-6
          flex
          flex-col
          gap-4
          md:flex-row
          md:items-start
          md:justify-between
        "
      >

        <div>

          <h1 className="text-2xl font-semibold text-[#062b1b]">

            {greeting},{" "}

            {user.name || "Botanist"} 👋

          </h1>


          <p className="mt-1 text-sm text-gray-500">
            {currentDate} — Here's your botanical activity summary
          </p>


          {user.institution && (
            <p className="mt-1 text-xs text-gray-400">
              {user.institution}
            </p>
          )}

        </div>


        <div className="flex items-center gap-3">


          {/* Refresh Button */}

          <button
            onClick={() => fetchDashboard(true)}
            disabled={refreshing}
            title="Refresh dashboard"
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-lg
              border
              border-[#dce7e0]
              bg-white
              text-gray-500
              shadow-sm
              transition
              hover:bg-gray-50
              hover:text-green-600
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >

            <FaSyncAlt
              size={15}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

          </button>


          {/* New Submission */}

          <button
            onClick={() =>
              navigate("/botanist/new-submission")
            }
            className="
              flex
              items-center
              gap-2
              rounded-lg
              bg-[#13a34a]
              px-5
              py-3
              text-sm
              font-medium
              text-white
              transition
              hover:bg-[#108b3f]
            "
          >

            <FaLeaf size={18} />

            New Submission

          </button>

        </div>

      </div>


      {/* =====================================================
          STAT CARDS
      ===================================================== */}

      <div
        className="
          mb-6
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >

        {statCards.map((stat) => (

          <div
            key={stat.title}
            className="
              rounded-xl
              border
              border-[#dce7e0]
              bg-white
              p-5
              shadow-sm
            "
          >

            <div className="flex items-start justify-between">

              <div>

                <p className="text-xs font-medium tracking-wide text-gray-500">
                  {stat.title}
                </p>


                <h2 className="mt-2 text-3xl font-semibold text-[#062b1b]">
                  {stat.value}
                </h2>

              </div>


              <div
                className={`
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-lg
                  ${stat.iconBg}
                  ${stat.iconColor}
                `}
              >
                {stat.icon}
              </div>

            </div>

          </div>

        ))}

      </div>


      {/* =====================================================
          SECONDARY STATISTICS
      ===================================================== */}

      <div
        className="
          mb-6
          grid
          grid-cols-1
          gap-4
          md:grid-cols-3
        "
      >


        {/* Approval Rate */}

        <div
          className="
            rounded-xl
            border
            border-[#dce7e0]
            bg-white
            p-5
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs font-medium tracking-wide text-gray-500">
                APPROVAL RATE
              </p>


              <h2 className="mt-2 text-3xl font-semibold text-[#062b1b]">
                {acceptanceRate}%
              </h2>

            </div>


            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-lg
                bg-green-100
                text-green-600
              "
            >
              <FaCheckCircle size={20} />
            </div>

          </div>


          <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">

            <div
              className="
                h-full
                rounded-full
                bg-[#13a34a]
                transition-all
              "
              style={{
                width: `${acceptanceRate}%`,
              }}
            />

          </div>

        </div>


        {/* AI Statistics */}

        <div
          className="
            rounded-xl
            border
            border-[#dce7e0]
            bg-white
            p-5
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs font-medium tracking-wide text-gray-500">
                AI-ASSISTED SUBMISSIONS
              </p>


              <h2 className="mt-2 text-3xl font-semibold text-[#062b1b]">

                {Number(
                  aiStats.aiSubmissions || 0
                )}

              </h2>

            </div>


            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-lg
                bg-blue-100
                text-blue-600
              "
            >
              <FaRobot size={20} />
            </div>

          </div>


          <p className="mt-3 text-xs text-gray-500">

            Average confidence:{" "}

            <span className="font-medium text-gray-700">

              {(
                Number(
                  aiStats.averageConfidence || 0
                ) * 100
              ).toFixed(1)}

              %

            </span>

          </p>

        </div>


        {/* Botanist Information */}

        <div
          className="
            rounded-xl
            border
            border-[#dce7e0]
            bg-white
            p-5
            shadow-sm
          "
        >

          <p className="text-xs font-medium tracking-wide text-gray-500">
            SPECIALISATION
          </p>


          <h2 className="mt-2 text-base font-semibold text-[#062b1b]">
            {user.specialisation || "Not specified"}
          </h2>


          <p className="mt-2 text-xs text-gray-500">
            {user.qualification || "Qualification not specified"}
          </p>

        </div>

      </div>


      {/* =====================================================
          CHARTS
      ===================================================== */}

      <div className="mb-6 grid grid-cols-1 gap-5 xl:grid-cols-2">


        {/* Monthly Contribution */}

        <div
          className="
            rounded-xl
            border
            border-[#dce7e0]
            bg-white
            p-5
            shadow-sm
          "
        >

          <div className="mb-5 flex items-start justify-between">

            <div>

              <h2 className="text-base font-medium text-[#062b1b]">
                Monthly Contribution
              </h2>


              <p className="mt-1 text-xs text-gray-500">
                Submissions vs approved records
              </p>

            </div>


            <span
              className="
                rounded-full
                bg-green-100
                px-3
                py-1
                text-xs
                font-medium
                text-green-700
              "
            >
              Last 6 months
            </span>

          </div>


          {monthlyChartData.length === 0 ? (

            <div className="flex h-64 items-center justify-center">

              <p className="text-sm text-gray-400">
                No monthly submission data available.
              </p>

            </div>

          ) : (

            <div className="h-64">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={monthlyChartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 5,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="month"
                    tick={{
                      fontSize: 11,
                    }}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{
                      fontSize: 11,
                    }}
                  />

                  <Tooltip />

                  <Legend />


                  <Bar
                    dataKey="submitted"
                    name="Submitted"
                    fill="#7ee6a5"
                    radius={[
                      4,
                      4,
                      0,
                      0,
                    ]}
                  />


                  <Bar
                    dataKey="approved"
                    name="Approved"
                    fill="#13a34a"
                    radius={[
                      4,
                      4,
                      0,
                      0,
                    ]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          )}

        </div>


        {/* Submission Trend */}

        <div
          className="
            rounded-xl
            border
            border-[#dce7e0]
            bg-white
            p-5
            shadow-sm
          "
        >

          <div className="mb-5">

            <h2 className="text-base font-medium text-[#062b1b]">
              Submission Trend
            </h2>


            <p className="mt-1 text-xs text-gray-500">
              Weekly submission activity
            </p>

          </div>


          {weeklyChartData.length === 0 ? (

            <div className="flex h-64 items-center justify-center">

              <p className="text-sm text-gray-400">
                No weekly submission data available.
              </p>

            </div>

          ) : (

            <div className="h-64">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={weeklyChartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 5,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="week"
                    tick={{
                      fontSize: 11,
                    }}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{
                      fontSize: 11,
                    }}
                  />

                  <Tooltip />


                  <Line
                    type="monotone"
                    dataKey="submissions"
                    name="Submissions"
                    stroke="#13a34a"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          )}

        </div>

      </div>


      {/* =====================================================
          BOTTOM SECTION
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-5
          xl:grid-cols-[2fr_1fr]
        "
      >


        {/* Recent Activity */}

        <div
          className="
            overflow-hidden
            rounded-xl
            border
            border-[#dce7e0]
            bg-white
            shadow-sm
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-[#e5ebe7]
              px-5
              py-4
            "
          >

            <div>

              <h2 className="font-medium text-[#062b1b]">
                Recent Activity
              </h2>


              <p className="mt-1 text-xs text-gray-400">
                Your latest specimen submissions
              </p>

            </div>


            <button
              onClick={() =>
                navigate("/botanist/submissions")
              }
              className="
                flex
                items-center
                gap-1
                text-xs
                font-medium
                text-green-600
                hover:text-green-700
              "
            >

              View all

              <FaArrowRight size={14} />

            </button>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b border-[#e5ebe7]">

                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">
                    ID
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">
                    PLANT NAME
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">
                    DATE
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">
                    STATUS
                  </th>

                </tr>

              </thead>


              <tbody>

                {recentActivity.length === 0 ? (

                  <tr>

                    <td
                      colSpan="4"
                      className="px-5 py-10 text-center"
                    >

                      <FaLeaf
                        size={25}
                        className="mx-auto mb-3 text-gray-300"
                      />


                      <p className="text-sm text-gray-500">
                        No submissions yet.
                      </p>


                      <button
                        onClick={() =>
                          navigate(
                            "/botanist/new-submission"
                          )
                        }
                        className="
                          mt-2
                          text-xs
                          font-medium
                          text-green-600
                          hover:text-green-700
                        "
                      >
                        Create your first submission
                      </button>

                    </td>

                  </tr>

                ) : (

                  recentActivity.map((item) => (

                    <tr
                      key={item.id}
                      className="
                        border-b
                        border-[#edf1ee]
                        last:border-b-0
                        transition
                        hover:bg-[#f8fbf9]
                      "
                    >

                      <td className="px-5 py-4 text-xs text-gray-500">

                        SUB-

                        {String(item.id).padStart(
                          4,
                          "0"
                        )}

                      </td>


                      <td className="px-5 py-4">

                        <p className="text-sm font-medium text-[#062b1b]">

                          {item.name ||
                            "Unnamed specimen"}

                        </p>


                        <p className="text-xs text-gray-500">

                          {item.species ||
                            item.family ||
                            "Species not specified"}

                        </p>

                      </td>


                      <td className="px-5 py-4 text-xs text-gray-500">

                        {formatDate(
                          item.collection_date ||
                            item.created_at
                        )}

                      </td>


                      <td className="px-5 py-4">

                        <StatusBadge
                          status={item.status}
                        />

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* Dashboard Summary */}

        <div
          className="
            rounded-xl
            border
            border-[#dce7e0]
            bg-white
            shadow-sm
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-[#e5ebe7]
              px-5
              py-4
            "
          >

            <div>

              <h2 className="font-medium text-[#062b1b]">
                Dashboard Summary
              </h2>


              <p className="mt-1 text-xs text-gray-400">
                Current account overview
              </p>

            </div>


            <FaBell
              size={17}
              className="text-gray-500"
            />

          </div>


          <div className="space-y-4 p-5">


            <SummaryRow
              label="Total submissions"
              value={stats.totalSubmissions || 0}
            />


            <SummaryRow
              label="Approved"
              value={stats.approved || 0}
              valueClass="text-green-600"
            />


            <SummaryRow
              label="Pending review"
              value={stats.pending || 0}
              valueClass="text-yellow-600"
            />


            <SummaryRow
              label="Rejected"
              value={stats.rejected || 0}
              valueClass="text-red-500"
            />


            <div className="my-4 border-t border-[#e5ebe7]" />


            <SummaryRow
              label="Approval rate"
              value={`${acceptanceRate}%`}
              valueClass="text-green-600"
            />


            <SummaryRow
              label="AI-assisted"
              value={
                aiStats.aiSubmissions || 0
              }
            />


            {user.experienceYears && (

              <SummaryRow
                label="Experience"
                value={`${user.experienceYears} years`}
              />

            )}

          </div>

        </div>

      </div>

    </main>
  );
};


// ============================================================
// SUMMARY ROW
// ============================================================

const SummaryRow = ({
  label,
  value,
  valueClass = "text-[#062b1b]",
}) => {

  return (
    <div className="flex items-center justify-between">

      <span className="text-xs text-gray-500">
        {label}
      </span>


      <span
        className={`text-sm font-semibold ${valueClass}`}
      >
        {value}
      </span>

    </div>
  );
};


// ============================================================
// STATUS BADGE
// ============================================================

const StatusBadge = ({ status }) => {

  const normalizedStatus =
    String(status || "").toLowerCase();


  const styles = {
    approved:
      "bg-green-100 text-green-700",

    pending:
      "bg-yellow-100 text-yellow-700",

    rejected:
      "bg-red-100 text-red-600",

    draft:
      "bg-gray-100 text-gray-600",
  };


  const labels = {
    approved: "Approved",
    pending: "Pending",
    rejected: "Rejected",
    draft: "Draft",
  };


  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-3
        py-1
        text-xs
        font-medium
        ${
          styles[normalizedStatus] ||
          "bg-gray-100 text-gray-600"
        }
      `}
    >

      {labels[normalizedStatus] ||
        status ||
        "Unknown"}

    </span>
  );
};


export default BotanistDashboard;