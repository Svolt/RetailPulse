import React, { useState } from 'react';
import { 
  FileCheck2, 
  Search, 
  ShieldCheck, 
  Download, 
  Filter,
  Clock,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuditLogView: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter(log => 
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.target.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportAudit = () => {
    const headers = 'ID,Timestamp,Actor,Role,Action,Target,Details,IP Address\n';
    const rows = auditLogs.map(l => 
      `"${l.id}","${l.timestamp}","${l.actor}","${l.actorRole}","${l.action}","${l.target}","${l.details}","${l.ipAddress}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `audit_trail_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5EAE1] shadow-2xs">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#172018]">
            Immutable Compliance & Security Audit Trail
          </h1>
          <p className="text-xs text-[#697565] mt-0.5">
            Cryptographically sealed log of administrative claim approvals, manual point adjustments, and bank payout batches.
          </p>
        </div>
        <button
          onClick={handleExportAudit}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#172018] bg-[#F5F7F3] hover:bg-[#EAEFE6] border border-[#DDE4D8] rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-[#153B2B]" />
          <span>Export Audit Log</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-[#FFFFFF] p-3 rounded-xl border border-[#E5EAE1] flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-[#697565] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search action, actor, target entity..."
            className="w-full text-xs bg-[#F5F7F3] border border-[#E5EAE1] rounded-lg pl-9 pr-3 py-1.5 text-[#172018] focus:outline-none focus:ring-1 focus:ring-[#153B2B]"
          />
        </div>
        <span className="text-xs text-[#697565] font-tabular">{filteredLogs.length} Verified Records</span>
      </div>

      {/* Audit Table */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5EAE1] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFBF9] text-[#697565] border-b border-[#E5EAE1]">
                <th className="py-3 px-4 font-semibold">Timestamp / Log ID</th>
                <th className="py-3 px-4 font-semibold">Actor / Role</th>
                <th className="py-3 px-4 font-semibold">Action Trigger</th>
                <th className="py-3 px-4 font-semibold">Target Entity</th>
                <th className="py-3 px-4 font-semibold">Audit Details</th>
                <th className="py-3 px-4 font-semibold">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAE1]">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-[#FAFBF9] transition-colors">
                  <td className="py-3.5 px-4 font-tabular">
                    <div className="font-semibold text-[#172018]">{log.timestamp}</div>
                    <div className="text-[10px] text-[#94A3B8] font-mono">{log.id}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-[#172018]">{log.actor}</div>
                    <div className="text-[10px] text-[#697565] uppercase">{log.actorRole}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[10px] font-bold bg-[#EAEFE6] text-[#153B2B] px-2 py-0.5 rounded">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#172018]">
                    {log.target}
                  </td>
                  <td className="py-3.5 px-4 text-[#697565] max-w-sm truncate">
                    {log.details}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#94A3B8]">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
