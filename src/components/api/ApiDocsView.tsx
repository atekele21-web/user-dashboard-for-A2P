import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export const ApiDocsView: React.FC = () => {
  const [copiedLang, setCopiedLang] = useState<string | null>(null);

  const curlExample = `curl -X POST https://api.simconnect.et/v1/sms/send \\
  -H "Authorization: Bearer sim_live_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "sender_id": "IbexTechno",
    "recipient": "+251911223344",
    "message": "Your verification code is 849201. Valid for 10 minutes."
  }'`;

  const nodeExample = `import axios from 'axios';

const response = await axios.post(
  'https://api.simconnect.et/v1/sms/send',
  {
    sender_id: 'IbexTechno',
    recipient: '+251911223344',
    message: 'Your verification code is 849201. Valid for 10 minutes.',
  },
  {
    headers: {
      Authorization: 'Bearer ' + process.env.SIMCONNECT_API_KEY,
    },
  }
);

console.log('Dispatched message ID:', response.data.message_id);`;

  const pythonExample = `import requests
import os

url = "https://api.simconnect.et/v1/sms/send"
headers = {
    "Authorization": f"Bearer {os.getenv('SIMCONNECT_API_KEY')}",
    "Content-Type": "application/json"
}
payload = {
    "sender_id": "IbexTechno",
    "recipient": "+251911223344",
    "message": "Your verification code is 849201. Valid for 10 minutes."
}

resp = requests.post(url, json=payload, headers=headers)
print(resp.json())`;

  const handleCopy = (code: string, lang: string) => {
    navigator.clipboard.writeText(code);
    setCopiedLang(lang);
    setTimeout(() => setCopiedLang(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Developer API Documentation
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Quick integration guide for integrating SIMConnect SMS A2P endpoints into your application stack.
        </p>
      </div>

      {/* Endpoint specs */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-md bg-blue-50 text-blue-700 border border-blue-200">
            POST
          </span>
          <span className="font-mono text-sm font-bold text-slate-900">/v1/sms/send</span>
          <span className="text-xs text-slate-500 font-medium">· Single & Bulk Dispatch</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <p className="font-bold text-slate-900">Request Parameters</p>
            <ul className="text-slate-700 space-y-1.5 list-disc list-inside">
              <li><code className="text-blue-700 font-mono font-semibold">sender_id</code> (string, required): Authorized Sender ID</li>
              <li><code className="text-blue-700 font-mono font-semibold">recipient</code> (string, required): +251 9/7...</li>
              <li><code className="text-blue-700 font-mono font-semibold">message</code> (string, required): Body text</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <p className="font-bold text-slate-900">Response Format (JSON)</p>
            <pre className="text-[11px] font-mono text-emerald-700 leading-relaxed">
{`{
  "status": "success",
  "message_id": "msg_89210",
  "segments": 1,
  "cost_etb": 0.35
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Code Snippets */}
      <div className="space-y-4">
        {/* cURL */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xs">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-300">cURL Example</span>
            <button
              onClick={() => handleCopy(curlExample, 'curl')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1.5 font-medium cursor-pointer"
            >
              {copiedLang === 'curl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLang === 'curl' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
            {curlExample}
          </pre>
        </div>

        {/* Node.js */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xs">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-300">Node.js (Axios)</span>
            <button
              onClick={() => handleCopy(nodeExample, 'node')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1.5 font-medium cursor-pointer"
            >
              {copiedLang === 'node' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLang === 'node' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
            {nodeExample}
          </pre>
        </div>

        {/* Python */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xs">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-300">Python (Requests)</span>
            <button
              onClick={() => handleCopy(pythonExample, 'python')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1.5 font-medium cursor-pointer"
            >
              {copiedLang === 'python' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLang === 'python' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
            {pythonExample}
          </pre>
        </div>
      </div>
    </div>
  );
};
