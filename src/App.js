import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UploadScan from "./pages/UploadScan";
import ScanResult from "./pages/ScanResult";
import Monitoring from "./pages/Monitoring";
import Integrations from "./pages/Integrations";
import Alerts from "./pages/Alerts";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadScan />} />
          <Route path="/result/:scanId" element={<ScanResult />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/alerts" element={<Alerts />} />
        </Routes>
      </div>
    </Router>
  );
}