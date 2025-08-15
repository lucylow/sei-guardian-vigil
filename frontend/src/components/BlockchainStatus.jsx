import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BlockchainStatus = () => {
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get('/api/status');
        setStatus(response.data);
      } catch (error) {
        console.error('Failed to fetch status:', error);
        setStatus({ error: true });
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const resetMock = async () => {
    try {
      await axios.post('/api/reset-mock');
      window.location.reload();
    } catch (error) {
      console.error('Failed to reset mock mode:', error);
    }
  };

  if (loading) return <div className="p-3 bg-gray-100 rounded">Loading status...</div>;

  return (
    <div className={`p-4 rounded-lg shadow-md ${
      status.mockMode ? 'bg-yellow-100 border-yellow-500' : 'bg-green-100 border-green-500'
    } border-l-4`}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg">
            {status.mockMode ? 'Offline Mock Mode' : 'Live Blockchain Mode'}
          </h3>
          <p className="text-sm">
            {status.mockMode
              ? 'Blockchain operations are simulated'
              : 'Connected to Sei Network'}
          </p>
          <p className="text-xs mt-1">Version: {status.version}</p>
        </div>
        {status.mockMode && (
          <button 
            onClick={resetMock}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
          >
            Connect Live
          </button>
        )}
      </div>
      {status.error && (
        <p className="text-red-500 mt-2">
          Connection error. Please check network settings.
        </p>
      )}
    </div>
  );
};

export default BlockchainStatus;
