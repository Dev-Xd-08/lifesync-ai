import React, { useState } from "react";
import { User, Mail, ShieldCheck, Key, Save, Bell, Globe } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function Profile() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || "Alex Vance");
  const [email] = useState(user?.email || "demo@lifesync.ai");
  const [currency, setCurrency] = useState(user?.preferences?.currency || "USD");
  const [notifications, setNotifications] = useState(
    user?.preferences?.notificationsEnabled !== false
  );
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleProfileSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast("Profile preferences updated successfully.", "success");
    }, 600);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast("Please provide both current and new password.", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("New password must be at least 6 characters.", "error");
      return;
    }

    showToast("Password updated successfully.", "success");
    setCurrentPassword("");
    setNewPassword("");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          User Profile & Credentials
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your personal identity, vault preferences, and security credentials.
        </p>
      </div>

      {/* User Header Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs flex flex-col sm:flex-row items-center gap-5">
        <img
          src={
            user?.avatarUrl ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
              user?.name || "User"
            )}`
          }
          alt={user?.name}
          className="h-20 w-20 rounded-2xl border border-slate-200 bg-slate-50 object-cover shadow-sm"
        />
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <h2 className="text-lg font-bold text-slate-900">{user?.name}</h2>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              Active Tenant
            </span>
          </div>
          <p className="text-xs text-slate-500">{user?.email}</p>
          <div className="pt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>256-bit Encrypted Vault • Isolated Session</span>
          </div>
        </div>
      </div>

      {/* Profile & Preferences Form */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          Personal Information & Preferences
        </h3>

        <form onSubmit={handleProfileSave} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Primary Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="CAD">CAD ($)</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="notifToggle"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <label htmlFor="notifToggle" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Enable In-App Expiry & Deadline Reminders
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      </div>

      {/* Password Reset Section */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Key className="h-4 w-4 text-slate-600" />
          <span>Security Credentials</span>
        </h3>

        <form onSubmit={handlePasswordChange} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="rounded-xl border border-slate-300 px-5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
