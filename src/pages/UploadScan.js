import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UploadScan() {
  const [file, setFile] = useState(null);
  const [addr, setAddr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const triggerScan = async () => {
    setLoading(true);
    // POST file or address to /scan endpoint
    setTimeout(() => {
      navigate(`/result/demo123`);
    }, 800);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Upload Contract / Scan by Address</h1>
      <div className="bg-white p-4 rounded shadow space-y-3">
        <input type="file" accept=".wasm,.sol,.zip" onChange={(e) => setFile(e.target.files[0])} />
        <div className="flex items-center gap-2">
          <input type="text" placeholder="Contract Address" value={addr} onChange={(e) => setAddr(e.target.value)} className="border p-2 flex-1"/>
        </div>
        <button disabled={loading} onClick={triggerScan} className="bg-blue-600 text-white py-2 px-4 rounded">
          {loading ? "Scanning..." : "Scan Now"}
        </button>
      </div>
    </div>
  );
}