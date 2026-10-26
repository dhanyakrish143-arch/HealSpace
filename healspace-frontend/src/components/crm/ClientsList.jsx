import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import ClientModal from './ClientModal';

export default function ClientsList() {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeClientId, setActiveClientId] = useState(null);

  const fetchClients = () => {
    axiosInstance.get('/clients')
      .then((res) => {
        setClients(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-4 text-slate-500">Loading client directory...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Client CRM Directory</h2>
          <p className="text-sm text-slate-500">Manage client profiles, intake forms, and medical emergency details.</p>
        </div>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-slate-300 rounded-lg p-2 text-sm w-full sm:w-64 focus:outline-emerald-500"
        />
      </div>

      {filteredClients.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm">
          No clients match your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredClients.map((client) => (
            <div
              key={client._id}
              onClick={() => setActiveClientId(client._id)}
              className="p-4 border rounded-xl hover:border-emerald-500 hover:shadow-sm cursor-pointer transition space-y-3 bg-white"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">{client.name}</h3>
                  <p className="text-xs text-slate-500">{client.email}</p>
                  {client.phone && <p className="text-xs text-slate-400">{client.phone}</p>}
                </div>
                <span
                  className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                    client.intakeStatus === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  Intake {client.intakeStatus}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {(client.tags || []).map((t, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-md">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center text-xs text-slate-400 border-t pt-2">
                <span>{client.totalSessions || 0} Total Sessions</span>
                <span className="text-emerald-600 font-medium hover:underline">View File →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeClientId && (
        <ClientModal
          clientId={activeClientId}
          onClose={() => setActiveClientId(null)}
          onUpdate={fetchClients}
        />
      )}
    </div>
  );
}