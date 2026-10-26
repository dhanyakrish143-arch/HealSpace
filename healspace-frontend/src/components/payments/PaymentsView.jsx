import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

export default function PaymentsView() {
  const [data, setData] = useState({ totalRevenue: 0, count: 0, currency: 'USD', payments: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/payments/me')
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const printReceipt = (p) => {
    const symbol = p.currency === 'INR' ? '₹' : p.currency === 'EUR' ? '€' : '$';
    const printWindow = window.open('', '_blank');
    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${p.invoiceNumber}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; max-width: 600px; margin: auto; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #059669; padding-bottom: 15px; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; color: #059669; }
            .inv-id { font-family: monospace; font-size: 14px; color: #64748b; }
            .row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
            .divider { border-bottom: 1px solid #e2e8f0; margin: 15px 0; }
            .total { font-size: 20px; font-weight: bold; color: #0f172a; }
            .badge { background: #dcfce7; color: #166534; padding: 3px 8px; border-radius: 999px; font-size: 11px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">HealSpace Receipt</div>
              <div class="inv-id">${p.invoiceNumber}</div>
            </div>
            <div>
              <span class="badge">PAID</span>
            </div>
          </div>
          <div class="row">
            <span><strong>Billed To:</strong></span>
            <span>${p.clientName} (${p.clientEmail})</span>
          </div>
          <div class="row">
            <span><strong>Date Paid:</strong></span>
            <span>${new Date(p.createdAt).toLocaleDateString()}</span>
          </div>
          <div class="row">
            <span><strong>Payment Method:</strong></span>
            <span>${p.paymentMethod}</span>
          </div>
          <div class="divider"></div>
          <div class="row">
            <span>Teletherapy Consultation (1 Session)</span>
            <span>${symbol}${p.amount}</span>
          </div>
          <div class="divider"></div>
          <div class="row total">
            <span>Total Paid</span>
            <span>${symbol}${p.amount}</span>
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  if (loading) return <div className="p-4 text-slate-500">Loading billing overview...</div>;

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Practice Revenue</p>
          <p className="text-3xl font-extrabold text-emerald-600 mt-2">
            {data.currency === 'INR' ? '₹' : data.currency === 'EUR' ? '€' : '$'}
            {data.totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Processed Invoices</p>
          <p className="text-3xl font-extrabold text-slate-800 mt-2">{data.count}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Payment Gateway</p>
          <p className="text-sm font-bold text-slate-700 mt-2">Stripe Instant Payouts</p>
          <span className="inline-block mt-1 text-[11px] bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded">
            Connected (Live)
          </span>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-4">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Invoices & Receipts</h2>
            <p className="text-sm text-slate-500">Client payments processed via online booking checkout.</p>
          </div>
        </div>

        {data.payments.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            No payments collected yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-xs text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-2">Invoice #</th>
                  <th className="py-3 px-2">Client</th>
                  <th className="py-3 px-2">Amount</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Date</th>
                  <th className="py-3 px-2 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.payments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-2 font-mono text-xs font-semibold text-slate-700">
                      {p.invoiceNumber}
                    </td>
                    <td className="py-3 px-2">
                      <p className="font-semibold text-slate-800">{p.clientName}</p>
                      <p className="text-xs text-slate-400">{p.clientEmail}</p>
                    </td>
                    <td className="py-3 px-2 font-bold text-slate-800">
                      {p.currency === 'INR' ? '₹' : p.currency === 'EUR' ? '€' : '$'}{p.amount}
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800 uppercase text-[10px]">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-xs text-slate-500">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => printReceipt(p)}
                        className="text-xs text-emerald-700 font-semibold hover:underline bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded"
                      >
                        Print PDF ⎙
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}