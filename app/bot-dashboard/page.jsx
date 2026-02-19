'use client';

import { useState, useEffect } from 'react';
import { Card } from 'components/card';

export default function BotDashboard() {
  const [status, setStatus] = useState(null);
  const [opportunities, setOpportunities] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [statusRes, oppsRes] = await Promise.all([
        fetch('/api/bot/status'),
        fetch('/api/bot/opportunities'),
      ]);

      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setStatus(statusData.data);
      }

      if (oppsRes.ok) {
        const oppsData = await oppsRes.json();
        setOpportunities(oppsData.data);
      }

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleStart = async (mode) => {
    try {
      const res = await fetch('/api/bot/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      });

      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Failed to start bot:', err);
    }
  };

  const handleStop = async () => {
    try {
      const res = await fetch('/api/bot/stop', {
        method: 'POST',
      });

      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Failed to stop bot:', err);
    }
  };

  const handleExecute = async (type, opportunityId) => {
    try {
      const res = await fetch('/api/bot/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, opportunityId }),
      });

      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Failed to execute:', err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Crypto & Arbitrage Bot Dashboard</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Crypto & Arbitrage Bot Dashboard</h1>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Crypto & Arbitrage Bot Dashboard</h1>
      
      {/* Disclaimer */}
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        <p className="font-bold">⚠️ IMPORTANT DISCLAIMER</p>
        <p className="text-sm mt-2">
          This is a demonstration/educational tool ONLY. Trading cryptocurrencies and engaging in arbitrage
          involves substantial risk of loss. This tool simulates trades and does NOT execute real transactions.
          Always comply with all applicable laws and regulations. This is NOT financial advice.
        </p>
      </div>

      {/* Bot Controls */}
      <Card title="Bot Controls">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="font-semibold">Status:</span>
            <span className={`px-3 py-1 rounded ${status?.isRunning ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
              {status?.isRunning ? 'Running' : 'Stopped'}
            </span>
            {status?.isRunning && (
              <span className="px-3 py-1 rounded bg-blue-200 text-blue-800">
                Mode: {status?.mode}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            {!status?.isRunning ? (
              <>
                <button
                  onClick={() => handleStart('manual')}
                  className="btn bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Start (Manual Mode)
                </button>
                <button
                  onClick={() => handleStart('autonomous')}
                  className="btn bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Start (Autonomous Mode)
                </button>
              </>
            ) : (
              <button
                onClick={handleStop}
                className="btn bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Stop Bot
              </button>
            )}
          </div>

          {status?.opportunityCounts && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-sm text-gray-600">Crypto Opportunities</p>
                <p className="text-2xl font-bold">{status.opportunityCounts.crypto}</p>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <p className="text-sm text-gray-600">Sports Arbitrage</p>
                <p className="text-2xl font-bold">{status.opportunityCounts.sports}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <p className="text-sm text-gray-600">Prediction Markets</p>
                <p className="text-2xl font-bold">{status.opportunityCounts.predictionMarket}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Crypto Opportunities */}
      {opportunities?.crypto && opportunities.crypto.length > 0 && (
        <Card title="Crypto Launch Opportunities" className="mt-6">
          <div className="space-y-3">
            {opportunities.crypto.map((opp, idx) => (
              <div key={idx} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{opp.symbol} - {opp.name}</h3>
                    <p className="text-sm text-gray-600">Source: {opp.source}</p>
                    <p className="text-sm text-gray-600">Type: {opp.filingType}</p>
                    <p className="text-sm">{opp.description}</p>
                    <p className="text-sm text-gray-500">Detected: {new Date(opp.detectedAt).toLocaleString()}</p>
                    <div className="mt-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        opp.confidence >= 0.75 ? 'bg-green-200 text-green-800' : 
                        opp.confidence >= 0.5 ? 'bg-yellow-200 text-yellow-800' : 
                        'bg-red-200 text-red-800'
                      }`}>
                        Confidence: {(opp.confidence * 100).toFixed(0)}%
                      </span>
                      <span className={`ml-2 px-2 py-1 rounded text-sm ${
                        opp.status === 'executed' ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-800'
                      }`}>
                        {opp.status}
                      </span>
                    </div>
                  </div>
                  {status?.mode === 'manual' && opp.status === 'pending' && (
                    <button
                      onClick={() => handleExecute('crypto', opp.symbol)}
                      className="btn bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                    >
                      Execute (Simulate)
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Sports Arbitrage Opportunities */}
      {opportunities?.sports && opportunities.sports.length > 0 && (
        <Card title="Sports Arbitrage Opportunities" className="mt-6">
          <div className="space-y-3">
            {opportunities.sports.map((opp, idx) => (
              <div key={idx} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{opp.event}</h3>
                    <p className="text-sm text-gray-600">{opp.sport}</p>
                    <p className="text-sm">Expected Profit: <span className="font-bold text-green-600">{opp.profit.toFixed(2)}%</span></p>
                    <p className="text-sm">Bet 1: {opp.stake1}% @ {opp.bestOdds1} ({opp.bestBookmaker1})</p>
                    <p className="text-sm">Bet 2: {opp.stake2}% @ {opp.bestOdds2} ({opp.bestBookmaker2})</p>
                    <p className="text-sm text-gray-500">Start: {new Date(opp.startTime).toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Detected: {new Date(opp.detectedAt).toLocaleString()}</p>
                    <span className={`mt-2 inline-block px-2 py-1 rounded text-sm ${
                      opp.status === 'executed' ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-800'
                    }`}>
                      {opp.status}
                    </span>
                  </div>
                  {status?.mode === 'manual' && opp.status === 'pending' && (
                    <button
                      onClick={() => handleExecute('sports', opp.eventId)}
                      className="btn bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                    >
                      Execute (Simulate)
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Prediction Market Opportunities */}
      {opportunities?.predictionMarket && opportunities.predictionMarket.length > 0 && (
        <Card title="Prediction Market Arbitrage Opportunities" className="mt-6">
          <div className="space-y-3">
            {opportunities.predictionMarket.map((opp, idx) => (
              <div key={idx} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{opp.question}</h3>
                    <p className="text-sm">Expected Profit: <span className="font-bold text-green-600">{opp.profit.toFixed(2)}%</span></p>
                    <p className="text-sm">Buy {opp.buyOutcome} @ {opp.buyPrice?.toFixed(3)} on {opp.buyPlatform}</p>
                    <p className="text-sm">Sell {opp.sellOutcome} @ {opp.sellPrice?.toFixed(3)} on {opp.sellPlatform}</p>
                    <p className="text-sm text-gray-600">Estimated costs: ${opp.estimatedCosts?.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Detected: {new Date(opp.detectedAt).toLocaleString()}</p>
                    <span className={`mt-2 inline-block px-2 py-1 rounded text-sm ${
                      opp.status === 'executed' ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-800'
                    }`}>
                      {opp.status}
                    </span>
                  </div>
                  {status?.mode === 'manual' && opp.status === 'pending' && (
                    <button
                      onClick={() => handleExecute('prediction', opp.marketId)}
                      className="btn bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 text-sm"
                    >
                      Execute (Simulate)
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Execution Log */}
      {status?.executionLog && status.executionLog.length > 0 && (
        <Card title="Recent Executions" className="mt-6">
          <div className="space-y-2">
            {status.executionLog.map((log, idx) => (
              <div key={idx} className="border-b pb-2">
                <div className="flex justify-between">
                  <span className="font-semibold">{log.type}</span>
                  <span className="text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-sm">{log.reason || log.message}</p>
                <span className={`inline-block px-2 py-1 rounded text-xs ${
                  log.status === 'simulated' ? 'bg-blue-100 text-blue-800' : 
                  log.status === 'executed' ? 'bg-green-100 text-green-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
