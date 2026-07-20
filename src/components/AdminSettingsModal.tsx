import React, { useState } from 'react';
import { Lock, Key, Shield, Download, Upload, RefreshCw, Check, X, Eye, EyeOff, Save, User, Music, FileText, AlertTriangle } from 'lucide-react';
import { Creation } from '../types';

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  creations: Creation[];
  onImportCreations: (imported: Creation[]) => void;
  onResetCreations: () => void;
}

export default function AdminSettingsModal({
  isOpen,
  onClose,
  creations,
  onImportCreations,
  onResetCreations
}: AdminSettingsModalProps) {
  // Auth state with session memory
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('myheartcraft_admin_session') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Settings state
  const savedPassword = localStorage.getItem('myheartcraft_admin_passcode') || 'admin123';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState('');

  const [defaultCreator, setDefaultCreator] = useState(localStorage.getItem('myheartcraft_default_creator') || 'Abhishek');
  const [creatorSavedMsg, setCreatorSavedMsg] = useState('');

  const [activeTab, setActiveTab] = useState<'security' | 'data' | 'preferences'>('security');

  if (!isOpen) return null;

  // 1. Password Auth Handler
  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === savedPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('myheartcraft_admin_session', 'true');
      setAuthError('');
    } else {
      setAuthError('Incorrect admin password. Please try again.');
    }
  };

  // Quick Unlock for default passcode
  const handleQuickUnlock = () => {
    setPasswordInput(savedPassword);
    setIsAuthenticated(true);
    sessionStorage.setItem('myheartcraft_admin_session', 'true');
    setAuthError('');
  };

  // Lock / Logout Admin
  const handleAdminLogout = () => {
    sessionStorage.removeItem('myheartcraft_admin_session');
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  // 2. Change Admin Password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      alert('Please enter a valid new password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match!');
      return;
    }

    localStorage.setItem('myheartcraft_admin_passcode', newPassword);
    setPasswordSuccessMsg('Admin password updated successfully!');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccessMsg(''), 3000);
  };

  // 3. Save Default Creator Profile
  const handleSaveCreatorProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('myheartcraft_default_creator', defaultCreator);
    setCreatorSavedMsg('Default creator profile saved!');
    setTimeout(() => setCreatorSavedMsg(''), 3000);
  };

  // 4. Export JSON Backup
  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(creations, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `myheartcraft_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // 5. Import JSON Backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            onImportCreations(parsed);
            alert(`Successfully imported ${parsed.length} experience cards!`);
          } else {
            alert('Invalid backup file format.');
          }
        } catch (err) {
          alert('Error reading JSON backup file.');
        }
      };
    }
  };

  // 6. Reset Factory Data
  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all creations to default sample data? This action cannot be undone.')) {
      onResetCreations();
      alert('Workspace reset to factory defaults.');
    }
  };

  const handleClose = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    setAuthError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-background border border-primary p-6 md:p-10 w-full max-w-lg relative shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* --- STEP A: PASSWORD AUTHENTICATION PROMPT --- */}
        {!isAuthenticated ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 border border-primary flex items-center justify-center mx-auto mb-4 text-primary bg-background">
              <Lock className="w-5 h-5" />
            </div>

            <span className="font-label-caps text-[9px] uppercase tracking-[0.2em] font-bold text-primary mb-2 block">
              Admin Authentication
            </span>
            <h2 className="font-display-lg text-2xl font-light text-on-background mb-2">
              Unlock Studio Settings
            </h2>
            <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
              Enter your admin password to manage security, backup data, and creator preferences.
            </p>

            <form onSubmit={handleAuthenticate} className="space-y-4 text-left">
              <div className="relative">
                <label className="font-label-caps text-[9px] uppercase font-bold text-on-surface-variant block mb-1 tracking-widest">
                  Admin Passcode
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setAuthError('');
                    }}
                    placeholder="Enter password (default: admin123)"
                    className="w-full bg-surface-container border border-primary/30 py-2.5 px-3 pr-10 text-xs font-mono focus:outline-none focus:border-primary text-on-background"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-on-surface-variant hover:text-primary"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authError && (
                <div className="text-[11px] text-red-600 font-bold flex items-center gap-1.5 bg-red-50 p-2.5 border border-red-200">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {authError}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 btn-primary py-3 font-label-caps text-xs tracking-widest uppercase font-bold flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  Unlock Settings
                </button>
                {savedPassword === 'admin123' && (
                  <button
                    type="button"
                    onClick={handleQuickUnlock}
                    className="px-4 border border-primary/40 text-primary font-label-caps text-[9px] tracking-widest uppercase font-bold hover:bg-primary/5 transition-all"
                  >
                    Quick Unlock
                  </button>
                )}
              </div>
            </form>

            <p className="text-[10px] text-on-surface-variant/75 mt-4 italic">
              Default password: <code className="bg-surface-container px-1 py-0.5 border border-primary/20 text-primary font-mono font-bold">admin123</code>
            </p>
          </div>
        ) : (
          /* --- STEP B: ADMIN SETTINGS PANEL --- */
          <div>
            <div className="flex items-center justify-between gap-3 mb-6 border-b border-primary/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 border border-primary flex items-center justify-center text-primary bg-background">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-display-lg text-xl text-on-background font-light uppercase tracking-tight">Studio Settings</h2>
                  <p className="font-label-caps text-[9px] text-green-700 uppercase tracking-[0.2em] font-bold">🟢 Logged in as Administrator</p>
                </div>
              </div>
              <button
                onClick={handleAdminLogout}
                className="text-[9px] font-label-caps uppercase tracking-wider text-red-700 border border-red-300 hover:bg-red-50 px-3 py-1.5 font-bold transition-all flex items-center gap-1"
                title="Lock Admin Session"
              >
                <Lock className="w-3 h-3" />
                Lock
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-primary/20 mb-6 gap-2">
              <button
                onClick={() => setActiveTab('security')}
                className={`py-2 px-3 text-[10px] font-label-caps uppercase font-bold tracking-wider border-b-2 transition-all ${
                  activeTab === 'security'
                    ? 'border-primary text-primary font-bold'
                    : 'border-transparent text-on-surface-variant hover:text-primary'
                }`}
              >
                Security
              </button>
              <button
                onClick={() => setActiveTab('data')}
                className={`py-2 px-3 text-[10px] font-label-caps uppercase font-bold tracking-wider border-b-2 transition-all ${
                  activeTab === 'data'
                    ? 'border-primary text-primary font-bold'
                    : 'border-transparent text-on-surface-variant hover:text-primary'
                }`}
              >
                Data & Backups
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`py-2 px-3 text-[10px] font-label-caps uppercase font-bold tracking-wider border-b-2 transition-all ${
                  activeTab === 'preferences'
                    ? 'border-primary text-primary font-bold'
                    : 'border-transparent text-on-surface-variant hover:text-primary'
                }`}
              >
                Profile & Defaults
              </button>
            </div>

            {/* TAB 1: SECURITY */}
            {activeTab === 'security' && (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="font-label-caps text-[9px] uppercase font-bold text-on-surface-variant block mb-1 tracking-widest">
                    New Admin Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-transparent border border-primary/30 p-2.5 text-xs font-mono focus:outline-none focus:border-primary text-on-background"
                  />
                </div>

                <div>
                  <label className="font-label-caps text-[9px] uppercase font-bold text-on-surface-variant block mb-1 tracking-widest">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-transparent border border-primary/30 p-2.5 text-xs font-mono focus:outline-none focus:border-primary text-on-background"
                  />
                </div>

                {passwordSuccessMsg && (
                  <div className="text-[11px] text-green-700 font-bold flex items-center gap-1.5 bg-green-50 p-2.5 border border-green-300">
                    <Check className="w-3.5 h-3.5 text-green-700" />
                    {passwordSuccessMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full btn-primary py-2.5 font-label-caps text-xs tracking-widest uppercase font-bold flex items-center justify-center gap-2 mt-2"
                >
                  <Save className="w-4 h-4" />
                  Save Admin Password
                </button>
              </form>
            )}

            {/* TAB 2: DATA & BACKUPS */}
            {activeTab === 'data' && (
              <div className="space-y-4">
                <div className="p-4 border border-primary/20 bg-surface-container">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-on-background mb-1">Backup All Experiences</h4>
                  <p className="text-[11px] text-on-surface-variant mb-3 leading-relaxed">
                    Download a `.json` backup file containing all your created cards and memories.
                  </p>
                  <button
                    onClick={handleExportBackup}
                    className="btn-primary py-2 px-4 text-[10px] font-label-caps uppercase tracking-widest font-bold flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export Backup (JSON)
                  </button>
                </div>

                <div className="p-4 border border-primary/20 bg-surface-container">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-on-background mb-1">Restore from Backup</h4>
                  <p className="text-[11px] text-on-surface-variant mb-3 leading-relaxed">
                    Upload a previously exported `.json` file to restore experience cards.
                  </p>
                  <label className="border border-primary text-primary hover:bg-primary hover:text-background py-2 px-4 text-[10px] font-label-caps uppercase tracking-widest font-bold inline-flex items-center gap-2 cursor-pointer transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    Select Backup File
                    <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                  </label>
                </div>

                <div className="p-4 border border-red-200 bg-red-50/50">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-red-800 mb-1">Factory Reset Workspace</h4>
                  <p className="text-[11px] text-red-700/80 mb-3 leading-relaxed">
                    Reset local creations list to original sample presets.
                  </p>
                  <button
                    onClick={handleResetData}
                    className="border border-red-700 text-red-700 hover:bg-red-700 hover:text-white py-2 px-4 text-[10px] font-label-caps uppercase tracking-widest font-bold flex items-center gap-2 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reset to Factory Defaults
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: PREFERENCES */}
            {activeTab === 'preferences' && (
              <form onSubmit={handleSaveCreatorProfile} className="space-y-4">
                <div>
                  <label className="font-label-caps text-[9px] uppercase font-bold text-on-surface-variant block mb-1 tracking-widest">
                    Default Creator Name
                  </label>
                  <input
                    type="text"
                    value={defaultCreator}
                    onChange={(e) => setDefaultCreator(e.target.value)}
                    placeholder="e.g. Abhishek"
                    className="w-full bg-transparent border border-primary/30 p-2.5 text-xs font-sans focus:outline-none focus:border-primary text-on-background"
                  />
                  <p className="text-[10px] text-on-surface-variant mt-1 leading-relaxed">
                    This name will be pre-filled when creating new experience cards.
                  </p>
                </div>

                {creatorSavedMsg && (
                  <div className="text-[11px] text-green-700 font-bold flex items-center gap-1.5 bg-green-50 p-2.5 border border-green-300">
                    <Check className="w-3.5 h-3.5 text-green-700" />
                    {creatorSavedMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full btn-primary py-2.5 font-label-caps text-xs tracking-widest uppercase font-bold flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Creator Profile
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
