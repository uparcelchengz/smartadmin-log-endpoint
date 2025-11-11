'use client';

import { useState, useEffect, useRef } from 'react';

interface WebhookLog {
  _id: string;
  timestamp: string;
  body: any;
}

export default function MessageTerminal() {
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/logs?limit=100');
      if (!response.ok) throw new Error('Failed to fetch logs');
      const data = await response.json();
      // Reverse to show oldest first (newest at bottom like real terminal)
      setLogs(data.logs.reverse());
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchLogs, 2000); // Refresh every 2 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ms = String(date.getMilliseconds()).padStart(3, '0');
    return `${hours}:${minutes}:${seconds}.${ms}`;
  };

  const getMessage = (log: WebhookLog) => {
    if (log.body && typeof log.body.message === 'string') {
      return log.body.message;
    }
    return '⚠️ Received something (no message field)';
  };

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-3">
      {/* Terminal Header */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-950 border-t border-x border-gray-800 px-3 py-1.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">●</span>
            <span className="text-gray-500">webhook-messages</span>
          </div>
          <div className="flex items-center gap-3 text-[10px]">
            <label className="flex items-center gap-1.5 cursor-pointer text-gray-600 hover:text-gray-400">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-2.5 h-2.5"
              />
              <span>auto</span>
            </label>
            <a href="/" className="text-gray-600 hover:text-gray-400">dash</a>
            <span className="text-gray-800">|</span>
            <a href="/log" className="text-gray-600 hover:text-gray-400">console</a>
          </div>
        </div>

        {/* Terminal Body */}
        <div 
          ref={scrollRef}
          className="bg-black border border-gray-800 p-3 min-h-[600px] max-h-[calc(100vh-120px)] overflow-y-auto text-xs leading-relaxed"
        >
          <div className="mb-2 text-gray-700">
            <span className="text-gray-600">user@webhook</span>
            <span className="text-gray-700">:</span>
            <span className="text-blue-600">~</span>
            <span className="text-gray-700">$</span>
            <span className="text-gray-500 ml-1">tail -f /var/log/webhooks/messages.log</span>
          </div>
          
          {loading ? (
            <div className="text-gray-700 text-[11px]">Loading...</div>
          ) : logs.length === 0 ? (
            <div className="text-gray-700 text-[11px]">[waiting for messages...]</div>
          ) : (
            <div>
              {logs.map((log) => (
                <div key={log._id} className="text-[11px] leading-snug py-0.5">
                  <span className="text-blue-500 select-none font-normal">
                    [{formatTimestamp(log.timestamp)}]
                  </span>
                  <span className="ml-2 text-green-500 font-light">
                    {getMessage(log)}
                  </span>
                </div>
              ))}
              
              {/* Blinking cursor */}
              <div className="flex items-center mt-1 text-[11px]">
                <span className="text-blue-500 select-none">
                  [{formatTimestamp(new Date().toISOString())}]
                </span>
                <span className="ml-2 inline-block w-1.5 h-3 bg-green-500 animate-pulse"></span>
              </div>
            </div>
          )}
        </div>

        {/* Terminal Footer */}
        <div className="bg-gray-950 border-b border-x border-gray-800 px-3 py-1 text-[10px] text-gray-400">
          <span>{logs.length} messages</span>
          <span className="mx-2">•</span>
          <span>auto-refresh: {autoRefresh ? 'ON' : 'OFF'}</span>
        </div>
      </div>

      {/* Custom styles for scrollbar and auto-scroll */}
      <style jsx>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #000;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #1f2937;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #374151;
        }
      `}</style>
    </div>
  );
}
