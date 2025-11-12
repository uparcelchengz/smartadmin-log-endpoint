'use client';

import { useState, useEffect } from 'react';

interface WebhookLog {
  _id: string;
  timestamp: string;
  method: string;
  headers: Record<string, string>;
  body: any;
  query: Record<string, string>;
  ip?: string;
  userAgent?: string;
}

export default function Home() {
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('/api/webhook');
  const [formattedTimestamps, setFormattedTimestamps] = useState<Record<string, string>>({});

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/logs?limit=100');
      if (!response.ok) throw new Error('Failed to fetch logs');
      const data = await response.json();
      setLogs(data.logs);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const clearAllLogs = async () => {
    if (!confirm('Are you sure you want to delete all logs?')) return;
    
    try {
      const response = await fetch('/api/logs', { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to clear logs');
      await fetchLogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear logs');
    }
  };

  useEffect(() => {
    fetchLogs();
    // Set webhook URL on client side only
    setWebhookUrl(`${window.location.origin}/api/webhook`);
  }, []);

  // Format timestamps on the client only to avoid SSR/locale mismatches
  useEffect(() => {
    if (!logs || logs.length === 0) return;
    try {
      const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
      const formatter = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' });
      const map: Record<string, string> = {};
      logs.forEach((l) => {
        try {
          map[l._id] = formatter.format(new Date(l.timestamp));
        } catch (e) {
          map[l._id] = l.timestamp;
        }
      });
      setFormattedTimestamps(map);
    } catch (e) {
      // Fallback: leave timestamps as raw ISO strings
    }
  }, [logs]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchLogs, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            SmartAdmin Webhook Logger Dashboard
          </h1>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Your Webhook Endpoint:
            </p>
            <div className="flex gap-2">
              <code className="flex-1 bg-white dark:bg-gray-900 px-3 py-2 rounded border border-blue-300 dark:border-blue-700 text-sm text-gray-800 dark:text-gray-200 break-all">
                {webhookUrl}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(webhookUrl)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm whitespace-nowrap"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <a
              href="/log"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              📡 Console View
            </a>
            <a
              href="/message"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              💬 Message Terminal
            </a>
            <button
              onClick={fetchLogs}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Logs
            </button>
            <button
              onClick={clearAllLogs}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Clear All
            </button>
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Auto-refresh (5s)
              </span>
            </label>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Logs</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{logs.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">POST Requests</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {logs.filter(log => log.method === 'POST').length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Latest</h3>
            <p className="text-sm font-medium text-gray-900 dark:text-white mt-2">
              {logs.length > 0 ? (formattedTimestamps[logs[0]._id] ?? logs[0].timestamp) : 'No logs yet'}
            </p>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading logs...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">Error: {error}</div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No logs yet. Send a POST request to your webhook endpoint to see logs here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {logs.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {formattedTimestamps[log._id] ?? log.timestamp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          log.method === 'POST' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {log.method}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {log.ip}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Log Detail Modal */}
        {selectedLog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Log Details</h2>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Timestamp</h3>
                  <p className="text-gray-900 dark:text-white">{formattedTimestamps[selectedLog._id] ?? selectedLog.timestamp}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Method</h3>
                  <p className="text-gray-900 dark:text-white">{selectedLog.method}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Body</h3>
                  <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm text-gray-900 dark:text-gray-100">
                    {JSON.stringify(selectedLog.body, null, 2)}
                  </pre>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Headers</h3>
                  <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm text-gray-900 dark:text-gray-100">
                    {JSON.stringify(selectedLog.headers, null, 2)}
                  </pre>
                </div>
                {Object.keys(selectedLog.query).length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Query Parameters</h3>
                    <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm text-gray-900 dark:text-gray-100">
                      {JSON.stringify(selectedLog.query, null, 2)}
                    </pre>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">User Agent</h3>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedLog.userAgent}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
