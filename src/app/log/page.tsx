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

export default function ConsolePage() {
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filter, setFilter] = useState<'all' | 'POST' | 'GET'>('all');

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

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchLogs, 3000); // Refresh every 3 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const filteredLogs = logs.filter(log => 
    filter === 'all' ? true : log.method === filter
  );

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'POST': return 'text-green-400';
      case 'GET': return 'text-blue-400';
      case 'PUT': return 'text-yellow-400';
      case 'DELETE': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono text-sm">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between max-w-[1800px] mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-green-400">
              📡 Webhook Console
            </h1>
            <span className="text-xs text-gray-500">
              {filteredLogs.length} {filter !== 'all' ? filter : ''} requests
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Filter */}
            <div className="flex gap-1 bg-gray-800 rounded p-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  filter === 'all' 
                    ? 'bg-gray-700 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('POST')}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  filter === 'POST' 
                    ? 'bg-green-700 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                POST
              </button>
              <button
                onClick={() => setFilter('GET')}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  filter === 'GET' 
                    ? 'bg-blue-700 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                GET
              </button>
            </div>

            {/* Auto-refresh toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-xs text-gray-400">
                Auto-refresh (3s)
              </span>
            </label>

            {/* Refresh button */}
            <button
              onClick={fetchLogs}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs transition-colors"
            >
              🔄 Refresh
            </button>

            {/* Navigation */}
            <a
              href="/message"
              className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs transition-colors"
            >
              💬 Messages
            </a>
            <a
              href="/"
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs transition-colors"
            >
              📊 Dashboard
            </a>
          </div>
        </div>
      </div>

      {/* Console Output */}
      <div className="max-w-[1800px] mx-auto p-4">
        {loading ? (
          <div className="text-center text-gray-500 py-8">
            <div className="animate-pulse">Loading logs...</div>
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-8">
            Error: {error}
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="mb-2">No logs yet.</div>
            <div className="text-xs">Send a request to /api/webhook to see logs here.</div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log, index) => (
              <div
                key={log._id}
                className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors"
              >
                {/* Log Header */}
                <div className="flex items-start justify-between mb-3 pb-2 border-b border-gray-800">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-xs">
                      [{formatTimestamp(log.timestamp)}]
                    </span>
                    <span className={`font-bold ${getMethodColor(log.method)}`}>
                      {log.method}
                    </span>
                    <span className="text-gray-400">
                      /api/webhook
                    </span>
                    {log.ip && (
                      <span className="text-gray-600 text-xs">
                        from {log.ip}
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600 text-xs">
                    #{filteredLogs.length - index}
                  </div>
                </div>

                {/* Request Body */}
                {log.body && Object.keys(log.body).length > 0 && (
                  <div className="mb-3">
                    <div className="text-yellow-500 text-xs mb-1 font-semibold">
                      📦 Request Body:
                    </div>
                    <pre className="bg-gray-950 border border-gray-800 rounded p-3 overflow-x-auto text-xs leading-relaxed">
                      <code className="text-gray-300">
                        {JSON.stringify(log.body, null, 2)}
                      </code>
                    </pre>
                  </div>
                )}

                {/* Query Parameters */}
                {log.query && Object.keys(log.query).length > 0 && (
                  <div className="mb-3">
                    <div className="text-blue-400 text-xs mb-1 font-semibold">
                      🔍 Query Parameters:
                    </div>
                    <pre className="bg-gray-950 border border-gray-800 rounded p-3 overflow-x-auto text-xs">
                      <code className="text-gray-300">
                        {JSON.stringify(log.query, null, 2)}
                      </code>
                    </pre>
                  </div>
                )}

                {/* Headers (collapsed by default, expandable) */}
                <details className="group">
                  <summary className="cursor-pointer text-gray-500 text-xs hover:text-gray-400 transition-colors">
                    <span className="inline-flex items-center gap-1">
                      <span className="group-open:rotate-90 transition-transform inline-block">
                        ▶
                      </span>
                      📋 Headers ({Object.keys(log.headers).length})
                    </span>
                  </summary>
                  <div className="mt-2">
                    <pre className="bg-gray-950 border border-gray-800 rounded p-3 overflow-x-auto text-xs">
                      <code className="text-gray-400">
                        {JSON.stringify(log.headers, null, 2)}
                      </code>
                    </pre>
                  </div>
                </details>

                {/* User Agent */}
                {log.userAgent && (
                  <div className="mt-2 text-gray-600 text-xs">
                    🖥️ {log.userAgent}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom padding */}
      <div className="h-8"></div>
    </div>
  );
}
