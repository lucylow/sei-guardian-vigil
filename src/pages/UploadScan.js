import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SentinelNavigation from "../components/SentinelNavigation";

export default function UploadScan() {
  const [file, setFile] = useState(null);
  const [addr, setAddr] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanType, setScanType] = useState("file"); // "file" or "address"
  const navigate = useNavigate();

  const triggerScan = async () => {
    setLoading(true);
    // POST file or address to /scan endpoint
    setTimeout(() => {
      navigate(`/result/demo123`);
    }, 800);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SentinelNavigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Scan Smart Contract</h1>
          <p className="text-gray-600">Upload a contract file or scan by blockchain address</p>
        </div>

        {/* Scan Type Toggle */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setScanType("file")}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                scanType === "file"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              📁 Upload File
            </button>
            <button
              onClick={() => setScanType("address")}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                scanType === "address"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🔗 Scan by Address
            </button>
          </div>

          {scanType === "file" ? (
            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className="text-6xl mb-4">📁</div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop your contract file here
                </p>
                <p className="text-gray-600 mb-4">
                  Supports .wasm, .sol, .zip files up to 50MB
                </p>
                <input
                  type="file"
                  accept=".wasm,.sol,.zip"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Choose File
                </label>
              </div>
              
              {file && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✅</span>
                    <span className="font-medium text-green-800">{file.name}</span>
                    <span className="text-green-600 ml-2">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="contract-address" className="block text-sm font-medium text-gray-700 mb-2">
                  Contract Address
                </label>
                <input
                  id="contract-address"
                  type="text"
                  placeholder="sei1..."
                  value={addr}
                  onChange={(e) => setAddr(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter a valid SEI blockchain contract address
                </p>
              </div>
            </div>
          )}

          {/* Scan Button */}
          <div className="mt-6">
            <button
              disabled={loading || (!file && !addr)}
              onClick={triggerScan}
              className={`w-full py-3 px-6 rounded-md font-medium transition-colors ${
                loading || (!file && !addr)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Scanning...
                </div>
              ) : (
                "🔍 Scan Now"
              )}
            </button>
          </div>
        </div>

        {/* Scan Options */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Scan Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input type="checkbox" id="ai-analysis" className="mr-3" defaultChecked />
              <label htmlFor="ai-analysis" className="text-sm text-gray-700">
                Enable AI-powered vulnerability analysis
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="explainable" className="mr-3" defaultChecked />
              <label htmlFor="explainable" className="text-sm text-gray-700">
                Generate explainable AI reports
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="continuous" className="mr-3" />
              <label htmlFor="continuous" className="text-sm text-gray-700">
                Enable continuous monitoring
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="notifications" className="mr-3" defaultChecked />
              <label htmlFor="notifications" className="text-sm text-gray-700">
                Send vulnerability alerts
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}