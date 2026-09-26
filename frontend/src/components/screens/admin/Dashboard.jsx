import React, { useEffect, useState } from 'react';
import { 
  Users, UserCheck, FileText, Clock, CheckCircle2, XCircle, 
  Search, Bell, TrendingUp 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

const RADIAN = Math.PI / 180;
const COLORS = ['#059669', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0'];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your actual API call endpoint
    fetch('http://localhost:4000/api/admin/dashboard-stats')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) setData(resData.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading Dashboard Metrics...</div>;
  }

  const { stats, trends, familyDistribution, topContributors, pendingActions } = data || {};

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 text-gray-800 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">System overview — Flora-Digitalis Pakistan</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-9 pr-4 py-1.5 text-sm rounded-lg bg-gray-100 border border-transparent focus:bg-white focus:border-emerald-500 outline-none w-64"
            />
          </div>
          <button className="p-2 rounded-full hover:bg-gray-200 relative text-gray-600">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-2 border-l pl-4 border-gray-300">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-medium text-sm">
              AF
            </div>
            <span className="text-sm font-semibold text-gray-700">Admin Faisal</span>
          </div>
        </div>
      </div>

      {/* Timestamp Badge */}
      <div className="flex justify-end">
        <span className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1 rounded-full font-medium border border-emerald-200">
          Last updated: 2 min ago
        </span>
      </div>

      {/* 6 Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        
        {/* Total Users */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Users</p>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">{stats?.totalUsers || '1,248'}</h2>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users className="w-5 h-5" /></div>
          </div>
          <p className="text-xs text-emerald-600 flex items-center gap-1 mt-3 font-medium">
            <TrendingUp className="w-3 h-3" /> +5% vs last month
          </p>
        </div>

        {/* Botanists */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Botanists</p>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">{stats?.totalBotanists || '340'}</h2>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><UserCheck className="w-5 h-5" /></div>
          </div>
          <p className="text-xs text-emerald-600 flex items-center gap-1 mt-3 font-medium">
            <TrendingUp className="w-3 h-3" /> +8% vs last month
          </p>
        </div>

        {/* Pending Apps */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pending Apps</p>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">{stats?.pendingApps || '12'}</h2>
            </div>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><FileText className="w-5 h-5" /></div>
          </div>
        </div>

        {/* Pending Subs */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pending Subs</p>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">{stats?.pendingSubs || '38'}</h2>
            </div>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Clock className="w-5 h-5" /></div>
          </div>
        </div>

        {/* Approved Records */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Approved Records</p>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">{stats?.approvedRecords || '12,481'}</h2>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle2 className="w-5 h-5" /></div>
          </div>
          <p className="text-xs text-emerald-600 flex items-center gap-1 mt-3 font-medium">
            <TrendingUp className="w-3 h-3" /> +14% vs last month
          </p>
        </div>

        {/* Rejected */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Rejected</p>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">{stats?.rejectedCount || '284'}</h2>
            </div>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg"><XCircle className="w-5 h-5" /></div>
          </div>
        </div>

      </div>

      {/* Middle Section: Submission Trends & Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Line / Area Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 text-base">Submission Trends</h3>
          <p className="text-xs text-gray-400 mb-6">Monthly overview across all botanists</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends || [
                { month: 'Jan', Submitted: 30, Approved: 20 },
                { month: 'Feb', Submitted: 35, Approved: 25 },
                { month: 'Mar', Submitted: 42, Approved: 32 },
                { month: 'Apr', Submitted: 38, Approved: 30 },
                { month: 'May', Submitted: 55, Approved: 45 },
                { month: 'Jun', Submitted: 60, Approved: 50 },
              ]}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="Submitted" stroke="#059669" fillOpacity={0.1} fill="#059669" strokeWidth={2} />
                <Area type="monotone" dataKey="Approved" stroke="#10B981" fillOpacity={0.05} fill="#10B981" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4 text-xs font-medium text-gray-600">
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-700"></span> Submitted</span>
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Approved</span>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-base">Plant Family Distribution</h3>
            <p className="text-xs text-gray-400 mb-4">Top 4 families in database</p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={familyDistribution || [
                      { family: 'Poaceae', count: 340 },
                      { family: 'Fabaceae', count: 280 },
                      { family: 'Asteraceae', count: 210 },
                      { family: 'Rosaceae', count: 165 },
                      { family: 'Others', count: 405 },
                    ]}
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 mt-2">
            {(familyDistribution || [
              { family: 'Poaceae', count: 340 },
              { family: 'Fabaceae', count: 280 },
              { family: 'Asteraceae', count: 210 },
              { family: 'Rosaceae', count: 165 },
              { family: 'Others', count: 405 },
            ]).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  {item.family}
                </span>
                <span className="font-semibold text-gray-800">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Section: Top Contributors & Pending Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Contributors Table */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900 text-base">Top Contributors</h3>
            <a href="#" className="text-xs font-semibold text-emerald-600 hover:underline">View all →</a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider font-semibold">
                  <th className="pb-3">Botanist</th>
                  <th className="pb-3 text-center">Submissions</th>
                  <th className="pb-3">Acceptance Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(topContributors || [
                  { name: 'Dr. Ahmad Khan', institution: 'Univ. Karachi', submissions: 87, acceptanceRate: 94 },
                  { name: 'Dr. Fatima Malik', institution: 'Quaid-i-Azam Univ.', submissions: 74, acceptanceRate: 91 },
                  { name: 'Prof. Sohail Ahmed', institution: 'Univ. Punjab', submissions: 68, acceptanceRate: 88 },
                  { name: 'Dr. Nadia Hassan', institution: 'Peshawar Univ.', submissions: 55, acceptanceRate: 85 },
                  { name: 'Dr. Tariq Mehmood', institution: 'PCSIR Karachi', submissions: 42, acceptanceRate: 90 },
                ]).map((contributor, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition">
                    <td className="py-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">
                        {contributor.name.split(' ')[1]?.[0] || 'B'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{contributor.name}</p>
                        <p className="text-[10px] text-gray-400">{contributor.institution}</p>
                      </div>
                    </td>
                    <td className="py-3 text-center font-bold text-gray-800">{contributor.submissions}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-emerald-600 h-full rounded-full" 
                            style={{ width: `${contributor.acceptanceRate}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-gray-700 text-[11px]">{contributor.acceptanceRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Actions List */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900 text-base">Pending Actions</h3>
            <span className="bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-200">
              4 pending
            </span>
          </div>

          <div className="space-y-3">
            {(pendingActions || [
              { id: 'APP-2024-034', title: 'Dr. Zara Iqbal', type: 'Botanist Application', date: '2024-05-30' },
              { id: 'SUB-2024-0091', title: 'Cassia fistula', type: 'Plant Submission', date: '2024-05-29' },
              { id: 'APP-2024-033', title: 'Dr. Bilal Akhtar', type: 'Botanist Application', date: '2024-05-28' },
              { id: 'SUB-2024-0090', title: 'Ficus benghalensis', type: 'Plant Submission', date: '2024-05-27' },
            ]).map((action, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 bg-gray-50/30 transition">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-gray-400">{action.id}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      action.type.includes('Botanist') 
                        ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>
                      {action.type}
                    </span>
                  </div>
                  <p className="font-bold text-gray-900 text-sm mt-1">{action.title}</p>
                  <p className="text-[10px] text-gray-400">{action.date}</p>
                </div>

                <button className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition shadow-sm">
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}