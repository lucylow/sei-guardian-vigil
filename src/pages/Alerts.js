import { useState } from "react";

export default function Alerts() {
  const [alerts, setAlerts] = useState([
    { id: 1, severity: "critical", msg: "Critical vulnerability found in contract sei1abc...", ts: Date.now() },
    { id: 2, severity: "high", msg: "High risk detected in contract sei1xyz...", ts: Date.now()-10000 }
  ]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Alerts & Notifications</h1>
      <div className="bg-white p-4 rounded shadow">
        <ul className="space-y-2">
          {alerts.map(alert => (
            <li key={alert.id} className={`p-2 rounded ${alert.severity === "critical" ? "bg-red-100" : "bg-orange-100"}`}>
              <div className="flex justify-between items-center">
                <span className="font-bold">{alert.severity.toUpperCase()}</span>
                <span className="text-xs text-gray-500">{new Date(alert.ts).toLocaleTimeString()}</span>
              </div>
              <div className="text-sm">{alert.msg}</div>
              <div className="mt-2 flex gap-2">
                <button className="bg-blue-600 text-white px-2 py-1 rounded text-xs">Acknowledge</button>
                <button className="bg-green-600 text-white px-2 py-1 rounded text-xs">Re-Scan</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}