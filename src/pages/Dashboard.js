import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState({ contractsScanned: 0, critical: 0, high: 0, medium: 0, low: 0 });
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch stats & events from API
    setStats({ contractsScanned: 12, critical: 3, high: 5, medium: 2, low: 10 });
    setEvents([
      { ts: Date.now(), msg: "Contract at addr x123 re-scanned — no new issues" },
      { ts: Date.now()-2000, msg: "New deployment detected at addr y456" }
    ]);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {["contractsScanned", "critical", "high", "medium", "low"].map((key, i) => (
          <div key={i} className="bg-white p-4 rounded shadow">
            <h2 className="text-sm uppercase text-gray-500">{key}</h2>
            <p className="text-2xl font-bold">{stats[key]}</p>
          </div>
        ))}
      </div>
      {/* Quick Actions */}
      <div className="flex gap-4 mb-6">
        <Link to="/upload" className="bg-blue-600 text-white py-2 px-4 rounded">Upload Contract</Link>
        <Link to="/monitoring" className="bg-green-600 text-white py-2 px-4 rounded">Monitoring</Link>
        <Link to="/integrations" className="bg-gray-700 text-white py-2 px-4 rounded">Integrations</Link>
      </div>
      {/* Live Feed */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-bold mb-2">Live Monitoring Feed</h2>
        <ul className="space-y-1">
          {events.map((ev, idx) => (
            <li key={idx} className="text-sm text-gray-600">{new Date(ev.ts).toLocaleTimeString()} – {ev.msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}