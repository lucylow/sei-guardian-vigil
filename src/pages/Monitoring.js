import { useEffect, useState } from "react";

export default function Monitoring() {
  const [monitored, setMonitored] = useState([
    { addr: "sei1abc...", status: "Healthy" },
    { addr: "sei1xyz...", status: "At Risk" },
  ]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Continuous Monitoring</h1>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Contract</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {monitored.map((c, i) => (
            <tr key={i}>
              <td className="p-2">{c.addr}</td>
              <td className="p-2">{c.status}</td>
              <td className="p-2">
                <button className="text-blue-500">Rescan</button>
                <button className="ml-2 text-red-500">Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}