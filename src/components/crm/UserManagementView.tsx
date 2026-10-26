import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  Upload, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Mail, 
  Phone, 
  Store, 
  ChevronRight, 
  X, 
  KeyRound, 
  MoreHorizontal,
  RefreshCw,
  FileSpreadsheet,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserAccount, PlatformRole, UserAccountStatus, StoreContext } from '../../types';

export const UserManagementView: React.FC = () => {
  const { sessionToken, hasPermission } = useAuth();

  const [users, setUsers] = useState<UserAccount[]>([]);
  const [stores, setStores] = useState<StoreContext[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals & Drawers
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [createdInviteUrl, setCreatedInviteUrl] = useState<string | null>(null);

  // Create User Form State
  const [createName, setCreateName] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createPhone, setCreatePhone] = useState('');
  const [createRole, setCreateRole] = useState<PlatformRole>('Retailer');
  const [createStoreIds, setCreateStoreIds] = useState<string[]>([]);
  const [createTerritory, setCreateTerritory] = useState('West Mumbai Commercial Zone');
  const [createDistributor, setCreateDistributor] = useState('Reliance Trade Logistics Ltd');
  const [createIsInvite, setCreateIsInvite] = useState(true);
  const [createError, setCreateError] = useState<string | null>(null);

  // Bulk Import State
  const [csvContent, setCsvContent] = useState('');
  const [conflictMode, setConflictMode] = useState<'skip' | 'update'>('skip');
  const [importSummary, setImportSummary] = useState<any | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${sessionToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (e) {
      console.error('[UserManagement] fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStores = async () => {
    try {
      const res = await fetch('/api/stores');
      if (res.ok) {
        const data = await res.json();
        setStores(data.stores || []);
      }
    } catch (e) {
      // Ignore
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStores();
  }, [sessionToken]);

  const filteredUsers = users.filter(u => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      u.name.toLowerCase().includes(q) || 
      u.email.toLowerCase().includes(q) || 
      u.phone.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q);
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`
        },
        body: JSON.stringify({
          name: createName,
          email: createEmail,
          phone: createPhone,
          role: createRole,
          storeIds: createStoreIds,
          territory: createTerritory,
          distributor: createDistributor,
          isInvite: createIsInvite
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error || 'Failed to create user account');
        return;
      }

      setUsers(prev => [data.user, ...prev]);
      if (data.activationUrl) {
        setCreatedInviteUrl(data.activationUrl);
      } else {
        setIsCreateModalOpen(false);
        resetCreateForm();
      }
    } catch (err: any) {
      setCreateError(err.message || 'Network error');
    }
  };

  const resetCreateForm = () => {
    setCreateName('');
    setCreateEmail('');
    setCreatePhone('');
    setCreateRole('Retailer');
    setCreateStoreIds([]);
    setCreatedInviteUrl(null);
    setCreateError(null);
  };

  const handleUpdateStatus = async (userId: string, newStatus: UserAccountStatus) => {
    try {
      const res = await fetch(`/api/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`
        },
        body: JSON.stringify({ status: newStatus, reason: 'Administrative user console update' })
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(prev => prev.map(u => u.id === userId ? data.user : u));
        if (selectedUser?.id === userId) setSelectedUser(data.user);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResendInvite = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}/resend-invite`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${sessionToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        alert(`New single-use invitation generated:\n${data.activationUrl}`);
        fetchUsers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleBulkImport = async () => {
    setImportError(null);
    setImportSummary(null);

    if (!csvContent.trim()) {
      setImportError('Please enter or paste CSV content.');
      return;
    }

    try {
      const res = await fetch('/api/users/bulk-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`
        },
        body: JSON.stringify({ csvText: csvContent, conflictResolution: conflictMode })
      });
      const data = await res.json();
      if (!res.ok) {
        setImportError(data.error || 'Bulk import failed.');
        return;
      }

      setImportSummary(data);
      fetchUsers();
    } catch (e: any) {
      setImportError(e.message || 'Import error');
    }
  };

  const handleDownloadTemplate = () => {
    window.location.href = '/api/users/csv-template';
  };

  const getStatusBadge = (status: UserAccountStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16A34A] bg-[#EAF7EE] px-2 py-0.5 rounded-md">
            <CheckCircle2 className="w-3 h-3" /> Active
          </span>
        );
      case 'pending_invite':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-md">
            <Clock className="w-3 h-3" /> Invite Pending
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#DC2626] bg-[#FEF2F2] px-2 py-0.5 rounded-md">
            <AlertTriangle className="w-3 h-3" /> Suspended
          </span>
        );
      case 'deactivated':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#697565] bg-[#F5F7F3] px-2 py-0.5 rounded-md">
            <XCircle className="w-3 h-3" /> Deactivated
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5EAE1] shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#697565] mb-1">
            <span className="font-semibold text-[#153B2B]">Identity & Access Management</span>
            <span>·</span>
            <span className="text-[#16A34A] font-semibold">{users.length} Platform Accounts</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#172018]">
            User Directory & Role Assignments
          </h1>
          <p className="text-xs text-[#697565] mt-0.5">
            Create retailer accounts, staff permissions, single-use activation invitations, and bulk CSV onboardings.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            onClick={() => setIsBulkImportOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#172018] bg-[#F5F7F3] hover:bg-[#EAEFE6] border border-[#DDE4D8] rounded-xl transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#153B2B]" />
            <span>Bulk CSV Import</span>
          </button>

          <button
            onClick={() => { resetCreateForm(); setIsCreateModalOpen(true); }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#153B2B] bg-[#C8F43D] hover:bg-[#BBE832] rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create / Invite User</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FFFFFF] p-3 rounded-xl border border-[#E5EAE1] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#697565] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, email, phone, ID..."
            className="w-full text-xs bg-[#F5F7F3] border border-[#E5EAE1] rounded-lg pl-9 pr-3 py-2 text-[#172018] focus:outline-none focus:ring-1 focus:ring-[#153B2B]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs font-medium text-[#172018] bg-[#F5F7F3] border border-[#DDE4D8] rounded-lg px-2.5 py-2 cursor-pointer focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Operations Admin">Operations Admin</option>
            <option value="Finance">Finance</option>
            <option value="Support Agent">Support Agent</option>
            <option value="Retailer">Retailer</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-medium text-[#172018] bg-[#F5F7F3] border border-[#DDE4D8] rounded-lg px-2.5 py-2 cursor-pointer focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending_invite">Pending Invite</option>
            <option value="suspended">Suspended</option>
            <option value="deactivated">Deactivated</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5EAE1] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFBF9] text-[#697565] border-b border-[#E5EAE1]">
                <th className="py-3 px-4 font-semibold">User / Email</th>
                <th className="py-3 px-4 font-semibold">Platform Role</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Assigned Stores</th>
                <th className="py-3 px-4 font-semibold">Territory & Distributor</th>
                <th className="py-3 px-4 font-semibold">Last Login</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAE1]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#697565]">
                    No user accounts match the search criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => {
                  const assignedStoreNames = stores
                    .filter(s => user.storeIds.includes(s.id))
                    .map(s => s.code);

                  return (
                    <tr 
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className="hover:bg-[#FAFBF9] transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#172018]">{user.name}</div>
                        <div className="text-[11px] text-[#697565]">{user.email}</div>
                        {user.phone && <div className="text-[10px] text-[#94A3B8] font-tabular">{user.phone}</div>}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#153B2B] bg-[#EAEFE6] px-2 py-0.5 rounded text-[11px]">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="py-3.5 px-4">
                        {assignedStoreNames.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {assignedStoreNames.map(code => (
                              <span key={code} className="font-mono text-[10px] bg-[#F5F7F3] border border-[#E5EAE1] px-1.5 py-0.5 rounded text-[#172018]">
                                {code}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[#94A3B8] italic">Platform Scope</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-[#172018] font-medium">{user.territory || 'National'}</div>
                        {user.distributor && (
                          <div className="text-[10px] text-[#697565]">{user.distributor}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-tabular text-[#697565]">
                        {user.lastLoginAt || 'Never'}
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {user.status === 'pending_invite' && (
                            <button
                              onClick={() => handleResendInvite(user.id)}
                              className="px-2 py-1 text-[10px] font-semibold text-[#153B2B] bg-[#EAEFE6] hover:bg-[#DDE4D8] rounded cursor-pointer"
                            >
                              Resend Invite
                            </button>
                          )}
                          {user.status === 'active' ? (
                            <button
                              onClick={() => handleUpdateStatus(user.id, 'suspended')}
                              className="px-2 py-1 text-[10px] font-semibold text-[#DC2626] bg-[#FEF2F2] hover:bg-[#FEE2E2] rounded cursor-pointer"
                            >
                              Suspend
                            </button>
                          ) : user.status === 'suspended' ? (
                            <button
                              onClick={() => handleUpdateStatus(user.id, 'active')}
                              className="px-2 py-1 text-[10px] font-semibold text-[#16A34A] bg-[#EAF7EE] hover:bg-[#D1FAE5] rounded cursor-pointer"
                            >
                              Reactivate
                            </button>
                          ) : null}
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="p-1 text-[#697565] hover:text-[#172018] rounded"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Drawer */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
          <div 
            className="w-full max-w-lg bg-[#FFFFFF] h-full shadow-2xl flex flex-col border-l border-[#E5EAE1] animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-[#E5EAE1] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#172018]">{selectedUser.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-[#697565]">{selectedUser.email}</span>
                  {getStatusBadge(selectedUser.status)}
                </div>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="p-1 rounded-md text-[#697565] hover:text-[#172018]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
              {/* Account Overview */}
              <div className="p-4 bg-[#F5F7F3] rounded-xl space-y-2">
                <span className="font-bold text-[#172018] uppercase text-[10px] tracking-wider">Account Credentials</span>
                <div className="flex justify-between text-[#697565]">
                  <span>User ID:</span>
                  <span className="font-mono text-[#172018]">{selectedUser.id}</span>
                </div>
                <div className="flex justify-between text-[#697565]">
                  <span>Platform Role:</span>
                  <span className="font-bold text-[#153B2B]">{selectedUser.role}</span>
                </div>
                <div className="flex justify-between text-[#697565]">
                  <span>Account Status:</span>
                  <span className="font-medium text-[#172018] capitalize">{selectedUser.status.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between text-[#697565]">
                  <span>Created Date:</span>
                  <span className="font-tabular text-[#172018]">{selectedUser.createdAt}</span>
                </div>
                <div className="flex justify-between text-[#697565]">
                  <span>Last Authenticated:</span>
                  <span className="font-tabular text-[#172018]">{selectedUser.lastLoginAt || 'None'}</span>
                </div>
              </div>

              {/* Assigned Retailer Stores */}
              <div className="space-y-2">
                <span className="font-bold text-[#172018]">Assigned Retailer Stores ({selectedUser.storeIds.length})</span>
                {selectedUser.storeIds.length === 0 ? (
                  <div className="p-3 bg-[#FAFBF9] rounded-xl border border-[#E5EAE1] text-[#697565]">
                    No specific store bounds assigned. User operates with platform/territorial scope.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {stores.filter(s => selectedUser.storeIds.includes(s.id)).map(st => (
                      <div key={st.id} className="p-3 bg-[#FAFBF9] rounded-xl border border-[#E5EAE1] flex items-center justify-between">
                        <div>
                          <div className="font-bold text-[#172018]">{st.name}</div>
                          <div className="text-[10px] text-[#697565]">Code: {st.code} · Tier: {st.tier}</div>
                        </div>
                        <span className="text-[10px] font-semibold text-[#153B2B] bg-[#EAEFE6] px-2 py-0.5 rounded">
                          {st.availablePoints.toLocaleString()} Pts
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Actions */}
              <div className="pt-4 border-t border-[#E5EAE1] space-y-2">
                <span className="font-bold text-[#172018]">Lifecycle & Governance Actions</span>
                <div className="grid grid-cols-2 gap-2">
                  {selectedUser.status === 'active' ? (
                    <button
                      onClick={() => handleUpdateStatus(selectedUser.id, 'suspended')}
                      className="py-2 px-3 bg-[#FEF2F2] text-[#DC2626] font-semibold rounded-xl hover:bg-[#FEE2E2] transition-colors cursor-pointer text-center"
                    >
                      Suspend Access
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(selectedUser.id, 'active')}
                      className="py-2 px-3 bg-[#EAF7EE] text-[#16A34A] font-semibold rounded-xl hover:bg-[#D1FAE5] transition-colors cursor-pointer text-center"
                    >
                      Reactivate Account
                    </button>
                  )}
                  {selectedUser.status === 'pending_invite' && (
                    <button
                      onClick={() => handleResendInvite(selectedUser.id)}
                      className="py-2 px-3 bg-[#153B2B] text-[#C8F43D] font-semibold rounded-xl hover:bg-[#1E4D38] transition-colors cursor-pointer text-center"
                    >
                      Resend Invite Link
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create / Invite User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
          <div 
            className="w-full max-w-lg bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#E5EAE1] overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-[#E5EAE1] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#172018]">Create & Invite User Account</h3>
                <p className="text-xs text-[#697565]">Assign platform roles, territory bounds, and store contexts</p>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-md text-[#697565] hover:text-[#172018]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createdInviteUrl ? (
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#EAF7EE] text-[#16A34A] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-[#172018]">Invitation Link Dispatched!</h4>
                <p className="text-xs text-[#697565]">
                  A single-use, cryptographically expiring token has been issued for the user.
                </p>
                <div className="p-3 bg-[#FAFBF9] rounded-xl border border-[#E5EAE1] break-all font-mono text-xs text-[#153B2B] select-all">
                  {createdInviteUrl}
                </div>
                <button
                  onClick={() => { setIsCreateModalOpen(false); resetCreateForm(); }}
                  className="px-5 py-2 text-xs font-bold text-[#153B2B] bg-[#C8F43D] hover:bg-[#BBE832] rounded-xl cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateUser} className="p-6 space-y-4 text-xs">
                {createError && (
                  <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-[#DC2626]">
                    {createError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#172018] mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={createName}
                      onChange={(e) => setCreateName(e.target.value)}
                      placeholder="e.g. Ramesh Patel"
                      className="w-full bg-[#FAFBF9] border border-[#DDE4D8] rounded-xl p-2.5 text-[#172018] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#172018] mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={createEmail}
                      onChange={(e) => setCreateEmail(e.target.value)}
                      placeholder="e.g. ramesh@patelhardware.in"
                      className="w-full bg-[#FAFBF9] border border-[#DDE4D8] rounded-xl p-2.5 text-[#172018] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#172018] mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={createPhone}
                      onChange={(e) => setCreatePhone(e.target.value)}
                      placeholder="+91 98200 00000"
                      className="w-full bg-[#FAFBF9] border border-[#DDE4D8] rounded-xl p-2.5 text-[#172018] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#172018] mb-1">Assigned Role</label>
                    <select
                      value={createRole}
                      onChange={(e) => setCreateRole(e.target.value as PlatformRole)}
                      className="w-full bg-[#FAFBF9] border border-[#DDE4D8] rounded-xl p-2.5 text-[#172018] focus:outline-none"
                    >
                      <option value="Retailer">Retailer (Store Owner/Dealer)</option>
                      <option value="Operations Admin">Operations Admin</option>
                      <option value="Finance">Finance Officer</option>
                      <option value="Support Agent">Support Agent</option>
                      <option value="Super Admin">Super Admin</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#172018] mb-1">
                    Assign Stores ({createStoreIds.length} Selected)
                  </label>
                  <div className="max-h-32 overflow-y-auto border border-[#E5EAE1] rounded-xl p-2 space-y-1 bg-[#FAFBF9]">
                    {stores.map(st => {
                      const isSelected = createStoreIds.includes(st.id);
                      return (
                        <label key={st.id} className="flex items-center gap-2 p-1.5 hover:bg-white rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) setCreateStoreIds(prev => [...prev, st.id]);
                              else setCreateStoreIds(prev => prev.filter(id => id !== st.id));
                            }}
                            className="rounded text-[#153B2B]"
                          />
                          <span className="font-semibold text-[#172018]">{st.name}</span>
                          <span className="text-[#697565]">({st.code})</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3 bg-[#F5F7F3] rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-[#172018]">Send Expiring Activation Link</span>
                    <p className="text-[10px] text-[#697565]">User sets password upon first login</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={createIsInvite}
                    onChange={(e) => setCreateIsInvite(e.target.checked)}
                    className="w-4 h-4 text-[#153B2B] rounded"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#E5EAE1]">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 text-xs text-[#697565]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-[#153B2B] bg-[#C8F43D] hover:bg-[#BBE832] rounded-xl shadow-xs cursor-pointer"
                  >
                    Save & Create User
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Bulk CSV Import Modal */}
      {isBulkImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
          <div 
            className="w-full max-w-xl bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#E5EAE1] overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-[#E5EAE1] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#172018]">Bulk CSV User Import</h3>
                <p className="text-xs text-[#697565]">Import multiple retailers or staff accounts with validation</p>
              </div>
              <button 
                onClick={() => setIsBulkImportOpen(false)}
                className="p-1 rounded-md text-[#697565] hover:text-[#172018]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 bg-[#FAFBF9] rounded-xl border border-[#E5EAE1]">
                <div>
                  <span className="font-semibold text-[#172018]">CSV Template:</span>
                  <p className="text-[11px] text-[#697565]">Columns: name, email, phone, role, store_codes, territory</p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="px-3 py-1.5 text-xs font-bold text-[#153B2B] bg-[#EAEFE6] hover:bg-[#DDE4D8] rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Template</span>
                </button>
              </div>

              {importError && (
                <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-[#DC2626]">
                  {importError}
                </div>
              )}

              {importSummary ? (
                <div className="space-y-4">
                  <div className="p-4 bg-[#EAF7EE] border border-[#A7F3D0] rounded-xl space-y-1">
                    <h4 className="font-bold text-[#16A34A] text-sm flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Import Complete!
                    </h4>
                    <p className="text-[#172018]">
                      Successfully imported: <span className="font-bold">{importSummary.summary.successful}</span> users.
                      Skipped duplicates: <span className="font-bold">{importSummary.summary.skipped}</span>.
                      Failed rows: <span className="font-bold">{importSummary.summary.failed}</span>.
                    </p>
                  </div>

                  {importSummary.errors.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="font-bold text-[#DC2626]">Row-Level Validation Errors:</span>
                      <div className="max-h-36 overflow-y-auto p-2 bg-[#FEF2F2] rounded-xl border border-[#FECACA] text-[11px] space-y-1">
                        {importSummary.errors.map((err: any, idx: number) => (
                          <div key={idx}>
                            Row {err.row}: {err.error} {err.email ? `(${err.email})` : ''}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => { setIsBulkImportOpen(false); setImportSummary(null); }}
                      className="px-4 py-2 text-xs font-bold text-[#153B2B] bg-[#C8F43D] rounded-xl cursor-pointer"
                    >
                      Close Summary
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-[#172018] mb-1">
                      Paste CSV Content (or use sample):
                    </label>
                    <textarea
                      rows={6}
                      value={csvContent}
                      onChange={(e) => setCsvContent(e.target.value)}
                      placeholder='name,email,phone,role,store_codes,territory&#10;"Ajay Patil","ajay@patilstore.in","+91 98200 77112","Retailer","RT-8421","West Mumbai Commercial Zone"'
                      className="w-full font-mono text-[11px] bg-[#FAFBF9] border border-[#DDE4D8] rounded-xl p-3 text-[#172018] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-[#172018]">Conflict Handling:</span>
                      <p className="text-[10px] text-[#697565]">When duplicate email exists</p>
                    </div>
                    <select
                      value={conflictMode}
                      onChange={(e) => setConflictMode(e.target.value as any)}
                      className="bg-[#FAFBF9] border border-[#DDE4D8] rounded-lg p-1.5 text-xs text-[#172018]"
                    >
                      <option value="skip">Skip duplicates (Safe)</option>
                      <option value="update">Update existing record</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-[#E5EAE1]">
                    <button
                      type="button"
                      onClick={() => setIsBulkImportOpen(false)}
                      className="px-4 py-2 text-xs text-[#697565]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleBulkImport}
                      className="px-5 py-2 text-xs font-bold text-[#153B2B] bg-[#C8F43D] hover:bg-[#BBE832] rounded-xl shadow-xs cursor-pointer"
                    >
                      Validate & Import
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
