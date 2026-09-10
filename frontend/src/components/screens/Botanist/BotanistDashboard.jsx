import React from "react";
import {
  FaLeaf,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaArrowUp,
  FaArrowDown,
  FaArrowRight,
  FaBell
} from "react-icons/fa";

const BotanistDashboard = () => {
  const stats = [
    {
      title: "TOTAL SUBMISSIONS",
      value: "87",
      change: "+12% vs last month",
      positive: true,
      icon: <FaLeaf size={22} />,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "ACCEPTED",
      value: "61",
      change: "+8% vs last month",
      positive: true,
      icon: <FaCheckCircle size={22} />,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "PENDING REVIEW",
      value: "14",
      change: "-3% vs last month",
      positive: false,
      icon: <FaClock size={22} />,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      title: "REJECTED",
      value: "12",
      change: "",
      positive: false,
      icon: <FaTimesCircle size={22} />,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  const recentActivity = [
    {
      id: "SUB-2024-0087",
      plant: "Adiantum capillus-veneris",
      commonName: "Maidenhair Fern",
      date: "2024-05-28",
      status: "Approved",
    },
    {
      id: "SUB-2024-0086",
      plant: "Berberis lycium",
      commonName: "Amlok",
      date: "2024-05-24",
      status: "Pending",
    },
    {
      id: "SUB-2024-0085",
      plant: "Artemisia absinthium",
      commonName: "Wormwood",
      date: "2024-05-19",
      status: "Rejected",
    },
    {
      id: "SUB-2024-0084",
      plant: "Calotropis procera",
      commonName: "Sodom Apple",
      date: "2024-05-15",
      status: "Approved",
    },
    {
      id: "SUB-2024-0083",
      plant: "Moringa oleifera",
      commonName: "Drumstick Tree",
      date: "2024-05-10",
      status: "Revision",
    },
  ];

  const notifications = [
    {
      message:
        "Adiantum capillus-veneris approved by Dr. Nazia Malik",
      time: "2h ago",
      type: "success",
    },
    {
      message:
        "Revision requested for Moringa oleifera — see comments",
      time: "1d ago",
      type: "error",
    },
    {
      message:
        "New AI model update: improved accuracy for Pakistani flora",
      time: "3d ago",
      type: "info",
    },
  ];

  return (
    <main className="min-h-[calc(100vh-104px)] bg-[#f7faf8] px-5 py-6">

      {/* ================= HEADER ================= */}
      <div className="mb-6 flex items-start justify-between">

        <div>
          <h1 className="text-2xl font-semibold text-[#062b1b]">
            Good morning, Dr. Ahmed 👋
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Monday, 1 June 2026 — Here's your botanical activity summary
          </p>
        </div>

        <button
          className="
            flex items-center gap-2
            rounded-lg
            bg-[#13a34a]
            px-5 py-3
            text-sm font-medium
            text-white
            transition
            hover:bg-[#108b3f]
          "
        >
          <FaLeaf size={18} />
          New Submission
        </button>

      </div>


      {/* ================= STAT CARDS ================= */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat) => (
          <div
            key={stat.title}
            className="
              rounded-xl
              border border-[#dce7e0]
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

                {stat.change && (
                  <div
                    className={`mt-2 flex items-center gap-1 text-xs ${
                      stat.positive
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {stat.positive ? (
                      <FaArrowUp size={14} />
                    ) : (
                      <FaArrowDown size={14} />
                    )}    



                    {stat.change}
                  </div>
                )}

              </div>

              <div
                className={`
                  flex h-10 w-10 items-center justify-center
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


      {/* ================= CHART SECTION ================= */}
      <div className="mb-6 grid grid-cols-1 gap-5 xl:grid-cols-2">

        {/* Monthly Contribution */}
        <div
          className="
            rounded-xl
            border border-[#dce7e0]
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
                Submissions vs accepted records
              </p>
            </div>

            <span
              className="
                rounded-full
                bg-green-100
                px-3 py-1
                text-xs
                font-medium
                text-green-700
              "
            >
              Last 6 months
            </span>

          </div>


          {/* Simple bar chart */}
          <div className="flex h-44 items-end justify-between gap-4 px-3">

            {[
              { month: "Jan", submitted: 4, accepted: 3 },
              { month: "Feb", submitted: 7, accepted: 5 },
              { month: "Mar", submitted: 5, accepted: 4 },
              { month: "Apr", submitted: 9, accepted: 7 },
              { month: "May", submitted: 12, accepted: 10 },
              { month: "Jun", submitted: 8, accepted: 6 },
            ].map((item) => (

              <div
                key={item.month}
                className="flex h-full flex-1 flex-col items-center justify-end"
              >

                <div className="flex h-full items-end gap-1">

                  <div
                    className="w-3 rounded-t-md bg-[#7ee6a5]"
                    style={{
                      height: `${item.submitted * 11}px`,
                    }}
                  />

                  <div
                    className="w-3 rounded-t-md bg-[#13a34a]"
                    style={{
                      height: `${item.accepted * 11}px`,
                    }}
                  />

                </div>

                <span className="mt-2 text-xs text-gray-500">
                  {item.month}
                </span>

              </div>

            ))}

          </div>

        </div>


        {/* Submission Trend */}
        <div
          className="
            rounded-xl
            border border-[#dce7e0]
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
              Weekly activity
            </p>

          </div>


          {/* Simple line chart */}
          <div className="relative h-44">

            {/* Horizontal grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">

              {[12, 9, 6, 3, 0].map((value) => (
                <div
                  key={value}
                  className="flex items-center"
                >
                  <span className="w-7 text-xs text-gray-400">
                    {value}
                  </span>

                  <div className="h-px flex-1 border-t border-dashed border-gray-200" />
                </div>
              ))}

            </div>


            {/* Approximate trend */}
            <svg
              viewBox="0 0 500 170"
              className="absolute left-7 top-0 h-full w-[calc(100%-28px)]"
              preserveAspectRatio="none"
            >

              <path
                d="
                  M0 140
                  C45 100, 70 80, 110 105
                  C145 130, 160 120, 190 70
                  C220 30, 260 30, 290 70
                  C320 110, 340 110, 365 50
                  C395 5, 425 25, 500 80
                "
                fill="none"
                stroke="#13a34a"
                strokeWidth="3"
              />

            </svg>

            <div className="absolute bottom-0 left-7 right-0 flex justify-between">

              {["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"].map(
                (week) => (
                  <span
                    key={week}
                    className="text-xs text-gray-500"
                  >
                    {week}
                  </span>
                )
              )}

            </div>

          </div>

        </div>

      </div>


      {/* ================= BOTTOM SECTION ================= */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[2fr_1fr]">

        {/* Recent Activity */}
        <div
          className="
            overflow-hidden
            rounded-xl
            border border-[#dce7e0]
            bg-white
            shadow-sm
          "
        >

          <div
            className="
              flex items-center justify-between
              border-b border-[#e5ebe7]
              px-5 py-4
            "
          >

            <h2 className="font-medium text-[#062b1b]">
              Recent Activity
            </h2>

            <button
              className="
                flex items-center gap-1
                text-xs font-medium
                text-green-600
                hover:text-green-700
              "
            >
              View all
              <FaArrowRight size={14} />
            </button>

          </div>


          {/* Table */}
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

                {recentActivity.map((item) => (

                  <tr
                    key={item.id}
                    className="border-b border-[#edf1ee] last:border-b-0"
                  >

                    <td className="px-5 py-4 text-xs text-gray-500">
                      {item.id}
                    </td>

                    <td className="px-5 py-4">

                      <p className="text-sm font-medium text-[#062b1b]">
                        {item.plant}
                      </p>

                      <p className="text-xs text-gray-500">
                        {item.commonName}
                      </p>

                    </td>

                    <td className="px-5 py-4 text-xs text-gray-500">
                      {item.date}
                    </td>

                    <td className="px-5 py-4">

                      <StatusBadge status={item.status} />

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>


        {/* Notifications */}
        <div
          className="
            rounded-xl
            border border-[#dce7e0]
            bg-white
            shadow-sm
          "
        >

          <div
            className="
              flex items-center justify-between
              border-b border-[#e5ebe7]
              px-5 py-4
            "
          >

            <h2 className="font-medium text-[#062b1b]">
              Notifications
            </h2>

            <FaBell
              size={17}
              className="text-gray-500"
            />

          </div>


          <div className="space-y-3 p-4">

            {notifications.map((notification, index) => (

              <div
                key={index}
                className="flex gap-3 rounded-lg bg-[#f1f5f2] p-4"
              >

                <div
                  className={`
                    mt-1 h-2 w-2 shrink-0 rounded-full
                    ${
                      notification.type === "success"
                        ? "bg-green-600"
                        : notification.type === "error"
                        ? "bg-red-500"
                        : "bg-blue-500"
                    }
                  `}
                />

                <div>

                  <p className="text-xs leading-5 text-gray-700">
                    {notification.message}
                  </p>

                  <p className="mt-1 text-[11px] text-gray-400">
                    {notification.time}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </main>
  );
};


/* ================= STATUS BADGE ================= */

const StatusBadge = ({ status }) => {

  const styles = {
    Approved: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Rejected: "bg-red-100 text-red-600",
    Revision: "bg-blue-100 text-blue-600",
  };

  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-3 py-1
        text-xs font-medium
        ${styles[status] || "bg-gray-100 text-gray-600"}
      `}
    >
      {status}
    </span>
  );
};

export default BotanistDashboard;