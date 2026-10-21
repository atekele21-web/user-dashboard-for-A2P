import React from 'react';
import { Users, UserPlus, Shield } from 'lucide-react';
import { StorageService } from '../../services/storageService';

export const TeamMembersView: React.FC = () => {
  const team = StorageService.getTeamMembers();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Team Members & Access Control
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Role-based account access for dispatchers, developers, and billing finance managers.
          </p>
        </div>

        <button
          onClick={() => alert('Invite member flow will connect via user management backend.')}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Team Member</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 bg-slate-50 font-semibold">
              <th className="py-3 px-4">User Name</th>
              <th className="py-3 px-4">Email Address</th>
              <th className="py-3 px-4">Assigned Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Last Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {team.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-900">{m.name}</td>
                <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">{m.email}</td>
                <td className="py-3 px-4">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold uppercase">
                    {m.role}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-block text-emerald-700 bg-emerald-50 border border-emerald-200 font-semibold text-[11px] px-2.5 py-0.5 rounded-full">
                    Active
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-slate-500 text-[11px] font-mono">
                  {m.lastActive}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
