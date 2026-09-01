import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Lock,
  UserCheck,
  UserX,
  Users,
  Clock,
  History,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Eye,
  EyeOff,
  Save,
  Sliders,
  FileText,
  BadgeAlert,
  Fingerprint,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { User, UserRole, SecuritySettings } from '../types';
import { evaluatePasswordStrength } from '../utils/security';

export const AdminSecurityTab: React.FC = () => {
  const {
    users,
    currentUser,
    securitySettings,
    updateSecuritySettings,
    auditLogs,
    clearAuditLogs,
    updateUserRole,
    toggleUserStatus,
    deleteUser,
    adminResetUserPassword,
    verifyAdminPin,
    addToast,
  } = useShop();

  // Local settings form state
  const [secForm, setSecForm] = useState<SecuritySettings>({ ...securitySettings });
  const [newAdminPin, setNewAdminPin] = useState(securitySettings.adminPin);
  const [showPin, setShowPin] = useState(false);

  // Reset User Password Modal State
  const [resetTargetUser, setResetTargetUser] = useState<User | null>(null);
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [showResetPass, setShowResetPass] = useState(false);
  const [resetPinPrompt, setResetPinPrompt] = useState('');
  const [resetError, setResetError] = useState('');

  // Audit Logs Filter
  const [auditFilter, setAuditFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  // PIN confirmation modal for clearing logs or critical changes
  const [showClearLogsModal, setShowClearLogsModal] = useState(false);
  const [clearLogsPin, setClearLogsPin] = useState('');

  // Password strength for reset
  const resetPassStrength = evaluatePasswordStrength(resetNewPassword);

  const handleSaveSecuritySettings = (e: React.FormEvent) => {
    e.preventDefault();

    if (secForm.requireAdminPin && (!newAdminPin || newAdminPin.length < 4)) {
      addToast('Invalid PIN', 'Admin Security PIN must be at least 4 digits.', 'error');
      return;
    }

    updateSecuritySettings({
      ...secForm,
      adminPin: newAdminPin.trim(),
    });
  };

  const handleExecutePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTargetUser) return;
    setResetError('');

    if (resetNewPassword.length < 6) {
      setResetError('Password must be at least 6 characters.');
      return;
    }

    if (securitySettings.requireAdminPin && !verifyAdminPin(resetPinPrompt)) {
      setResetError('Incorrect Admin Security PIN.');
      return;
    }

    const res = await adminResetUserPassword(resetTargetUser.id, resetNewPassword);
    if (res.success) {
      setResetTargetUser(null);
      setResetNewPassword('');
      setResetPinPrompt('');
    } else {
      setResetError(res.message);
    }
  };

  const handleConfirmClearLogs = () => {
    if (securitySettings.requireAdminPin && !verifyAdminPin(clearLogsPin)) {
      addToast('PIN Error', 'Incorrect Admin PIN provided.', 'error');
      return;
    }
    clearAuditLogs();
    setShowClearLogsModal(false);
    setClearLogsPin('');
  };

  const filteredLogs = auditLogs.filter((log) => {
    if (auditFilter === 'all') return true;
    return log.severity === auditFilter;
  });

  return (
    <div className="space-y-8">
      {/* 1. Security Overview Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Production Mode</span>
            <ShieldCheck className={`w-5 h-5 ${secForm.productionLock ? 'text-emerald-600' : 'text-amber-500'}`} />
          </div>
          <p className="text-xl font-black text-slate-900">
            {secForm.productionLock ? 'Secured & Locked' : 'Demo Enabled'}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            {secForm.productionLock ? '1-Click shortcuts are blocked' : 'Demo shortcuts active'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Registered Accounts</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-xl font-black text-slate-900">{users.length} Users</p>
          <p className="text-[11px] text-slate-500 mt-1">
            {users.filter((u) => u.role === 'admin').length} Admins • {users.filter((u) => u.role === 'customer').length} Customers
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Inactivity Timeout</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-xl font-black text-slate-900">{secForm.sessionTimeoutMinutes} Minutes</p>
          <p className="text-[11px] text-slate-500 mt-1">Automatic auto-logout protection</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Security Logs</span>
            <History className="w-5 h-5 text-slate-700" />
          </div>
          <p className="text-xl font-black text-slate-900">{auditLogs.length} Events</p>
          <p className="text-[11px] text-slate-500 mt-1">Real-time cryptographic audit trail</p>
        </div>
      </div>

      {/* 2. User Accounts & Access Control Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-900" />
              User Access & Role Management
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Control permissions, reset user credentials, and manage active administrator privileges.
            </p>
          </div>
          <div className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
            Total Accounts: {users.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/75 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email & Phone</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-right">Security Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((user) => {
                const isSelf = user.id === currentUser?.id;
                return (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 font-bold flex items-center justify-center text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {isSelf && (
                              <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded-full font-bold">
                                You
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="text-slate-900 font-medium">{user.email}</p>
                      <p className="text-[11px] text-slate-500">{user.phone || 'No phone recorded'}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={user.role}
                        disabled={isSelf}
                        onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                        className={`text-xs font-bold rounded-md px-2 py-1 border transition-colors ${
                          user.role === 'admin'
                            ? 'bg-amber-50 text-amber-900 border-amber-300'
                            : 'bg-slate-50 text-slate-700 border-slate-300'
                        } disabled:opacity-75`}
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          user.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {user.status === 'active' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                        )}
                        {user.status === 'active' ? 'Active' : 'Suspended'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-[11px] font-mono">
                      {user.createdAt || 'Standard'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setResetTargetUser(user);
                            setResetNewPassword('');
                            setResetError('');
                          }}
                          title="Reset user password"
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <KeyRound className="w-3 h-3" />
                          <span>Reset Pass</span>
                        </button>

                        <button
                          type="button"
                          disabled={isSelf}
                          onClick={() => toggleUserStatus(user.id)}
                          title={user.status === 'active' ? 'Suspend account' : 'Reactivate account'}
                          className={`p-1.5 rounded transition-colors ${
                            user.status === 'active'
                              ? 'text-amber-600 hover:bg-amber-50 disabled:opacity-40'
                              : 'text-emerald-600 hover:bg-emerald-50 disabled:opacity-40'
                          }`}
                        >
                          {user.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>

                        <button
                          type="button"
                          disabled={isSelf}
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to permanently delete ${user.name} (${user.email})?`)) {
                              deleteUser(user.id);
                            }
                          }}
                          title="Delete user"
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded transition-colors disabled:opacity-40"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Security Policies & Lockdown Configuration Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-slate-900" />
            Security Hardening & Production Controls
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure system-wide lockouts, demo mode toggles, inactivity timers, and admin verification PINs.
          </p>
        </div>

        <form onSubmit={handleSaveSecuritySettings} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Toggle Controls */}
            <div className="space-y-4">
              {/* Production Lock Switch */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Production Lockdown Mode
                  </label>
                  <p className="text-[11px] text-slate-500 mt-1">
                    When enabled, completely hides and disables the 1-click "Demo Customer" and "Demo Admin" shortcuts across login forms, enforcing real credential authentication.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={secForm.productionLock}
                  onChange={(e) => setSecForm((prev) => ({ ...prev, productionLock: e.target.checked }))}
                  className="mt-1 w-5 h-5 text-slate-900 rounded focus:ring-slate-900 cursor-pointer"
                />
              </div>

              {/* Require Admin PIN Switch */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                    <Fingerprint className="w-4 h-4 text-blue-600" />
                    Require Admin Security PIN for Critical Actions
                  </label>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Requires confirming the 4-6 digit Admin PIN before clearing audit logs or resetting user passwords.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={secForm.requireAdminPin}
                  onChange={(e) => setSecForm((prev) => ({ ...prev, requireAdminPin: e.target.checked }))}
                  className="mt-1 w-5 h-5 text-slate-900 rounded focus:ring-slate-900 cursor-pointer"
                />
              </div>

              {/* Admin Master PIN Input */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-amber-500" />
                    Master Admin Security PIN
                  </label>
                  <span className="text-[10px] text-slate-400">Default: 9922</span>
                </div>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={newAdminPin}
                    onChange={(e) => setNewAdminPin(e.target.value)}
                    maxLength={8}
                    placeholder="Enter 4-6 digit PIN"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Rate Limiting & Timers */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <label className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Inactivity Session Expiry (Minutes)
                </label>
                <select
                  value={secForm.sessionTimeoutMinutes}
                  onChange={(e) =>
                    setSecForm((prev) => ({ ...prev, sessionTimeoutMinutes: Number(e.target.value) }))
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-slate-900"
                >
                  <option value={15}>15 Minutes (Strict Security)</option>
                  <option value={30}>30 Minutes (Recommended)</option>
                  <option value={60}>60 Minutes (Standard)</option>
                  <option value={120}>120 Minutes (Extended)</option>
                </select>
                <p className="text-[11px] text-slate-500">
                  Automatically logs out users and admins if no activity is detected within this window.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <label className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  Max Failed Password Attempts Before Lockout
                </label>
                <select
                  value={secForm.maxFailedAttempts}
                  onChange={(e) =>
                    setSecForm((prev) => ({ ...prev, maxFailedAttempts: Number(e.target.value) }))
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-slate-900"
                >
                  <option value={3}>3 Attempts (High Security)</option>
                  <option value={5}>5 Attempts (Standard)</option>
                  <option value={10}>10 Attempts (Lenient)</option>
                </select>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <label className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-purple-600" />
                  Lockout Duration (Minutes)
                </label>
                <select
                  value={secForm.lockoutDurationMinutes}
                  onChange={(e) =>
                    setSecForm((prev) => ({ ...prev, lockoutDurationMinutes: Number(e.target.value) }))
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-slate-900"
                >
                  <option value={5}>5 Minutes</option>
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={60}>60 Minutes</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="py-2.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Save Security Configuration</span>
            </button>
          </div>
        </form>
      </div>

      {/* 4. Live Security Audit Trail */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-slate-900" />
              Real-Time Security Audit Logs
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live audit records of all authentication events, role changes, password resets, and policy modifications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter pills */}
            <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 text-xs font-bold">
              {(['all', 'critical', 'warning', 'info'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setAuditFilter(f)}
                  className={`px-2.5 py-1 rounded capitalize transition-colors ${
                    auditFilter === f ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                if (securitySettings.requireAdminPin) {
                  setShowClearLogsModal(true);
                } else {
                  if (window.confirm('Clear all security audit logs?')) {
                    clearAuditLogs();
                  }
                }
              }}
              className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Logs
            </button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <div key={log.id} className="p-4 flex items-start justify-between gap-4 text-xs hover:bg-slate-50/60 transition-colors">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                      log.severity === 'critical'
                        ? 'bg-rose-100 text-rose-700'
                        : log.severity === 'warning'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {log.severity === 'critical' ? (
                      <BadgeAlert className="w-4 h-4" />
                    ) : log.severity === 'warning' ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[11px] text-slate-800 uppercase px-1.5 py-0.5 bg-slate-100 rounded">
                        {log.action}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500 font-mono text-[11px]">{log.timestamp}</span>
                    </div>
                    <p className="font-medium text-slate-900 mt-1">{log.details}</p>
                    {log.ipAddress && (
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">IP Origin: {log.ipAddress}</p>
                    )}
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    log.severity === 'critical'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : log.severity === 'warning'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {log.severity}
                </span>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              No audit records match the selected filter.
            </div>
          )}
        </div>
      </div>

      {/* Admin Reset User Password Modal */}
      {resetTargetUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-500" />
                Reset Password for {resetTargetUser.name}
              </h3>
              <button
                onClick={() => setResetTargetUser(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {resetError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs font-medium">
                {resetError}
              </div>
            )}

            <form onSubmit={handleExecutePasswordReset} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  New Password for {resetTargetUser.email}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showResetPass ? 'text' : 'password'}
                    required
                    placeholder="Enter new strong password"
                    value={resetNewPassword}
                    onChange={(e) => setResetNewPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPass(!showResetPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showResetPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {resetNewPassword.length > 0 && (
                  <div className="mt-1.5 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 font-medium">Strength:</span>
                      <span className={`font-bold px-1.5 py-0.2 rounded ${resetPassStrength.color}`}>
                        {resetPassStrength.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 h-1.5 rounded-full overflow-hidden bg-slate-200">
                      <div className={`h-full ${resetPassStrength.score >= 1 ? 'bg-amber-400' : 'bg-transparent'}`} />
                      <div className={`h-full ${resetPassStrength.score >= 2 ? 'bg-amber-500' : 'bg-transparent'}`} />
                      <div className={`h-full ${resetPassStrength.score >= 3 ? 'bg-emerald-500' : 'bg-transparent'}`} />
                      <div className={`h-full ${resetPassStrength.score >= 4 ? 'bg-emerald-600' : 'bg-transparent'}`} />
                    </div>
                  </div>
                )}
              </div>

              {securitySettings.requireAdminPin && (
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Admin Verification PIN (Master PIN: {securitySettings.adminPin})
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter Admin PIN"
                    value={resetPinPrompt}
                    onChange={(e) => setResetPinPrompt(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white font-mono"
                  />
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResetTargetUser(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg cursor-pointer"
                >
                  Save & Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clear Logs PIN Confirmation Modal */}
      {showClearLogsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Confirm Audit Log Deletion
            </h3>
            <p className="text-xs text-slate-600">
              Enter your Master Admin PIN to permanently purge all security audit history.
            </p>
            <div>
              <input
                type="password"
                placeholder="Enter Master Admin PIN"
                value={clearLogsPin}
                onChange={(e) => setClearLogsPin(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowClearLogsModal(false);
                  setClearLogsPin('');
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClearLogs}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg cursor-pointer"
              >
                Clear Audit Trail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
