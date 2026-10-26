import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

export default function AnalyticsView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/analytics/dashboard')
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4 text-slate-500">Calculating practice analytics...</div>;
  if (!data) return <div className="p-4 text-rose-500">Failed to load analytics.</div>;

  const { summary, weeklyVolume } = data;
  const currSym = summary.currency === 'INR' ? '₹' : summary.currency === 'EUR' ? '€' : '$';
  const maxCount = Math.max(...weeklyVolume.map((d) => d.count), 1);

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase">Upcoming Sessions</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{summary.confirmedUpcoming}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase">Total Clients</p>
          <p className="text-2xl font-extrabold text-slate-800 mt-1">{summary.totalClients}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase">Avg Revenue / Client</p>
          <p className="text-2xl font-extrabold text-slate-800 mt-1">{currSym}{summary.avgRevenuePerClient}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase">Cancellation Rate</p>
          <p className="text-2xl font-extrabold text-rose-600 mt-1">{summary.cancellationRate}%</p>
        </div>
      </div>

      {/* Booking Distribution Bar Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Booking Volume by Day of Week</h2>
          <p className="text-xs text-slate-500">Aggregated session volume across your practice calendar.</p>
        </div>

        <div className="pt-4 pb-2">
          <div className="flex items-end justify-between gap-3 h-48 border-b border-slate-100 pb-2">
            {weeklyVolume.map((item) => {
              const heightPercent = (item.count / maxCount) * 100;
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[11px] font-bold text-slate-600">
                    {item.count > 0 ? item.count : ''}
                  </span>
                  <div
                    style={{ height: `${Math.max(heightPercent, 6)}%` }}
                    className={`w-full max-w-[42px] rounded-t-lg transition-all duration-500 ${
                      item.count > 0 ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-100'
                    }`}
                  />
                  <span className="text-xs font-semibold text-slate-500 mt-1">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}