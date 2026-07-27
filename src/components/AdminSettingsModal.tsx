import React, { useState, useEffect } from 'react';
import { Lock, Key, Shield, Download, Upload, RefreshCw, Check, X, Eye, EyeOff, Save, User, Music, FileText, AlertTriangle, Database, Sliders, Globe, Search, Link2, MessageSquare, Star } from 'lucide-react';
import { Creation } from '../types';
import { fetchGlobalCreationsFromCloud, fetchSiteReviewsFromCloud, SiteReview } from '../utils/cloudSync';
import { generateShareableUrl } from '../utils/share';
import { verifyAdminPasscode, updateAdminPasscode, RateLimiter } from '../utils/security';

const rateLimiter = new RateLimiter();

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
    return (sessionStorage.getItem('memora_admin_session') || sessionStorage.getItem('wishora_admin_session') || sessionStorage.getItem('myheartcraft_admin_session')) === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Global Cards State
  const [allGlobalCards, setAllGlobalCards] = useState<Creation[]>(creations);
  const [isSyncing, setIsSyncing] = useState(false);
  const [adminSearchQuery, setAdminSearchQuery] = useState('');

  // Magazines, Scrapbooks, and Open Whens States
  const [adminMagazines, setAdminMagazines] = useState<any[]>([]);
  const [adminScrapbooks, setAdminScrapbooks] = useState<any[]>([]);
  const [adminOpenWhens, setAdminOpenWhens] = useState<any[]>([]);
  const [explorerTab, setExplorerTab] = useState<'cards' | 'magazines' | 'scrapbooks' | 'openwhens'>('cards');

  // Global Reviews State
  const [siteReviews, setSiteReviews] = useState<SiteReview[]>([]);
  const [isSyncingReviews, setIsSyncingReviews] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSiteReviewsFromCloud().then(reviews => {
        if (reviews) setSiteReviews(reviews);
      });
    }
  }, [isAuthenticated]);

  // Settings state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState('');

  const [defaultCreator, setDefaultCreator] = useState(
    localStorage.getItem('memora_default_creator') || localStorage.getItem('wishora_default_creator') || localStorage.getItem('myheartcraft_default_creator') || 'Abhishek'
  );
  const [defaultMusic, setDefaultMusic] = useState(
    localStorage.getItem('memora_default_music') || localStorage.getItem('wishora_default_music') || localStorage.getItem('myheartcraft_default_music') || 'birthday_instrumental'
  );
  const [profileSavedMsg, setProfileSavedMsg] = useState('');

  // Rate Limiting Countdown Timer
  useEffect(() => {
    let timer: any;
    if (lockoutRemaining > 0) {
      timer = setInterval(() => {
        setLockoutRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            rateLimiter.reset();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutRemaining]);

  // Auto-fetch ALL user cards from global cloud store whenever modal opens or mounts
  useEffect(() => {
    if (isOpen) {
      setIsSyncing(true);
      fetchGlobalCreationsFromCloud()
        .then((cloudCards) => {
          setIsSyncing(false);
          if (cloudCards && cloudCards.length > 0) {
            const map = new Map<string, Creation>();
            creations.forEach((c) => map.set(c.id, c));
            cloudCards.forEach((c) => map.set(c.id, c));
            const merged = Array.from(map.values());
            setAllGlobalCards(merged);
          } else {
            setAllGlobalCards(creations);
          }
        })
        .catch(() => setIsSyncing(false));

      // Fetch Magazines
      const savedMags = localStorage.getItem('memora_magazine_projects');
      if (savedMags) {
        try { setAdminMagazines(JSON.parse(savedMags)); } catch(e) {}
      }

      // Fetch Scrapbooks
      const savedScraps = localStorage.getItem('memora_scrapbook_projects');
      if (savedScraps) {
        try { setAdminScrapbooks(JSON.parse(savedScraps)); } catch(e) {}
      }

      // Fetch Open Whens
      const savedOpenWhens = localStorage.getItem('memora_open_when_projects');
      if (savedOpenWhens) {
        try { setAdminOpenWhens(JSON.parse(savedOpenWhens)); } catch(e) {}
      }
    }
  }, [isOpen, creations]);

  if (!isOpen) return null;

  // Stats computed from all global cards across all users & devices
  const totalExperiences = allGlobalCards.length;
  const activeLinks = allGlobalCards.filter((c) => c.status === 'LIVE').length;
  const totalViews = allGlobalCards.reduce((sum, c) => sum + (c.views || 0), 0);

  // 1. Password Auth Handler with Cryptographic Hash Check
  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rateLimiter.isLocked()) {
      const remaining = rateLimiter.getRemainingSeconds();
      setLockoutRemaining(remaining);
      setAuthError(`Too many failed attempts! Security lockout active for ${remaining} seconds.`);
      return;
    }

    const isValid = await verifyAdminPasscode(passwordInput);
    if (isValid) {
      setIsAuthenticated(true);
      sessionStorage.setItem('memora_admin_session', 'true');
      setAuthError('');
      rateLimiter.reset();
    } else {
      rateLimiter.recordFailedAttempt();
      if (rateLimiter.isLocked()) {
        const remaining = rateLimiter.getRemainingSeconds();
        setLockoutRemaining(remaining);
        setAuthError(`Security Alert: Maximum attempts exceeded! Lockout active for ${remaining}s.`);
      } else {
        setAuthError('Incorrect admin passcode. Access denied.');
      }
    }
  };

  // Lock / Logout Admin
  const handleAdminLogout = () => {
    sessionStorage.removeItem('memora_admin_session');
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  // 2. Change Admin Password (Cryptographically Hashed)
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      alert('Please enter a valid new passcode.');
      return;
    }
    if (newPassword.length < 6) {
      alert('Security recommendation: Admin passcode should be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New passcode and confirm passcode do not match!');
      return;
    }

    await updateAdminPasscode(newPassword);
    setPasswordSuccessMsg('Admin passcode cryptographically updated & saved!');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccessMsg(''), 3000);
  };

  // 3. Save Profile & Preferences
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('memora_default_creator', defaultCreator);
    localStorage.setItem('memora_default_music', defaultMusic);
    setProfileSavedMsg('Creator profile & preferences updated successfully!');
    setTimeout(() => setProfileSavedMsg(''), 3000);
  };

  // 4. Export JSON Backup
  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(creations, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `memora_backup_${new Date().toISOString().split('T')[0]}.json`);
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
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in">
      <div className="bg-background border border-primary p-6 md:p-10 w-full max-w-2xl relative shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors p-1"
          title="Close Settings"
        >
          <X className="w-5 h-5" />
        </button>

        {/* --- STEP A: PASSWORD AUTHENTICATION PROMPT --- */}
        {!isAuthenticated ? (
          <div className="text-center py-6 max-w-md mx-auto">
            <div className="w-14 h-14 border border-primary flex items-center justify-center mx-auto mb-4 text-primary bg-background">
              <Lock className="w-6 h-6" />
            </div>

            <span className="font-label-caps text-[9px] uppercase tracking-[0.2em] font-bold text-primary mb-2 block">
              Admin Access Required
            </span>
            <h2 className="font-display-lg text-3xl font-light text-on-background mb-2">
              Unlock Creator Studio Settings
            </h2>
            <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
              Enter your admin password to access security controls, backups, and creator options.
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
                    placeholder="Enter admin passcode"
                    className="w-full bg-surface-container border border-primary/30 py-3 px-3 pr-10 text-xs font-mono focus:outline-none focus:border-primary text-on-background"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-on-surface-variant hover:text-primary"
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

              <button
                type="submit"
                className="w-full btn-primary py-3 font-label-caps text-xs tracking-widest uppercase font-bold flex items-center justify-center gap-2"
              >
                <Key className="w-4 h-4" />
                Unlock Admin Settings
              </button>
            </form>
          </div>
        ) : (
          /* --- STEP B: FULL ADMIN CONTROL DASHBOARD --- */
          <div className="space-y-8">
            
            {/* Admin Header */}
            <div className="flex items-center justify-between gap-3 border-b border-primary/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border border-primary flex items-center justify-center text-primary bg-background">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display-lg text-2xl text-on-background font-light uppercase tracking-tight">Admin Studio Control Center</h2>
                  <p className="font-label-caps text-[9px] text-green-700 uppercase tracking-[0.2em] font-bold">🟢 Logged in as Administrator</p>
                </div>
              </div>
              <button
                onClick={handleAdminLogout}
                className="text-[9px] font-label-caps uppercase tracking-wider text-red-700 border border-red-300 hover:bg-red-700 hover:text-white px-3 py-1.5 font-bold transition-all flex items-center gap-1"
                title="Lock Admin Session"
              >
                <Lock className="w-3 h-3" />
                Lock Session
              </button>
            </div>

            {/* Quick Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="p-2.5 bg-surface-container border border-primary/20 text-center">
                <div className="font-label-caps text-[8px] text-on-surface-variant uppercase tracking-wider">Greeting Cards</div>
                <div className="font-display-lg text-lg font-bold text-primary mt-1">{totalExperiences}</div>
              </div>
              <div className="p-2.5 bg-surface-container border border-primary/20 text-center">
                <div className="font-label-caps text-[8px] text-on-surface-variant uppercase tracking-wider">Magazines</div>
                <div className="font-display-lg text-lg font-bold text-primary mt-1">{adminMagazines.length}</div>
              </div>
              <div className="p-2.5 bg-surface-container border border-primary/20 text-center">
                <div className="font-label-caps text-[8px] text-on-surface-variant uppercase tracking-wider">Scrapbooks</div>
                <div className="font-display-lg text-lg font-bold text-primary mt-1">{adminScrapbooks.length}</div>
              </div>
              <div className="p-2.5 bg-surface-container border border-primary/20 text-center">
                <div className="font-label-caps text-[8px] text-on-surface-variant uppercase tracking-wider">Open Whens</div>
                <div className="font-display-lg text-lg font-bold text-primary mt-1">{adminOpenWhens.length}</div>
              </div>
              <div className="p-2.5 bg-surface-container border border-primary/20 text-center col-span-2 md:col-span-1">
                <div className="font-label-caps text-[8px] text-on-surface-variant uppercase tracking-wider">Combined Views</div>
                <div className="font-display-lg text-lg font-bold text-green-700 mt-1">
                  {totalViews + 
                   adminMagazines.reduce((s: number, m: any) => s + (m.views || 0), 0) + 
                   adminScrapbooks.reduce((s: number, sc: any) => s + (sc.views || 0), 0) + 
                   adminOpenWhens.reduce((s: number, o: any) => s + (o.views || 0), 0)}
                </div>
              </div>
            </div>

            {/* Section 1: Creator Profile & Defaults */}
            <div className="border border-primary/25 p-5 bg-background">
              <div className="flex items-center gap-2 mb-4 border-b border-primary/10 pb-2">
                <User className="w-4 h-4 text-primary" />
                <h3 className="font-display-lg text-sm font-bold uppercase tracking-wider text-on-background">1. Creator Profile & Defaults</h3>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-label-caps text-[9px] uppercase font-bold text-on-surface-variant block mb-1.5 tracking-widest">
                      Default Creator Name
                    </label>
                    <input
                      type="text"
                      value={defaultCreator}
                      onChange={(e) => setDefaultCreator(e.target.value)}
                      placeholder="e.g. Abhishek"
                      className="w-full bg-surface-container border border-primary/30 p-2.5 text-xs font-sans focus:outline-none focus:border-primary text-on-background"
                    />
                  </div>

                  <div>
                    <label className="font-label-caps text-[9px] uppercase font-bold text-on-surface-variant block mb-1.5 tracking-widest">
                      Default Ambient Music
                    </label>
                    <select
                      value={defaultMusic}
                      onChange={(e) => setDefaultMusic(e.target.value)}
                      className="w-full bg-surface-container border border-primary/30 p-2.5 text-xs font-sans focus:outline-none focus:border-primary text-on-background"
                    >
                      <option value="birthday_instrumental">Happy Birthday Instrumental 🎂</option>
                      <option value="romantic_piano">Romantic Piano 🎹</option>
                      <option value="acoustic_guitar">Acoustic Ambiance 🎸</option>
                      <option value="cinematic_strings">Cinematic Strings 🎻</option>
                    </select>
                  </div>
                </div>

                {profileSavedMsg && (
                  <div className="text-[11px] text-green-700 font-bold flex items-center gap-1.5 bg-green-50 p-2 border border-green-300">
                    <Check className="w-3.5 h-3.5 text-green-700" />
                    {profileSavedMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-primary py-2 px-5 font-label-caps text-[10px] tracking-widest uppercase font-bold flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Creator Preferences
                </button>
              </form>
            </div>

            {/* Section 2: Security & Password Management */}
            <div className="border border-primary/25 p-5 bg-background">
              <div className="flex items-center gap-2 mb-4 border-b border-primary/10 pb-2">
                <Key className="w-4 h-4 text-primary" />
                <h3 className="font-display-lg text-sm font-bold uppercase tracking-wider text-on-background">2. Passcode & Security</h3>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-label-caps text-[9px] uppercase font-bold text-on-surface-variant block mb-1.5 tracking-widest">
                      New Admin Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full bg-surface-container border border-primary/30 p-2.5 text-xs font-mono focus:outline-none focus:border-primary text-on-background"
                    />
                  </div>

                  <div>
                    <label className="font-label-caps text-[9px] uppercase font-bold text-on-surface-variant block mb-1.5 tracking-widest">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full bg-surface-container border border-primary/30 p-2.5 text-xs font-mono focus:outline-none focus:border-primary text-on-background"
                    />
                  </div>
                </div>

                {passwordSuccessMsg && (
                  <div className="text-[11px] text-green-700 font-bold flex items-center gap-1.5 bg-green-50 p-2 border border-green-300">
                    <Check className="w-3.5 h-3.5 text-green-700" />
                    {passwordSuccessMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-primary py-2 px-5 font-label-caps text-[10px] tracking-widest uppercase font-bold flex items-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Update Admin Passcode
                </button>
              </form>
            </div>

            {/* Section 3: Data Management & Backups */}
            <div className="border border-primary/25 p-5 bg-background">
              <div className="flex items-center gap-2 mb-4 border-b border-primary/10 pb-2">
                <Database className="w-4 h-4 text-primary" />
                <h3 className="font-display-lg text-sm font-bold uppercase tracking-wider text-on-background">3. Data & Backup Management</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border border-primary/20 bg-surface-container flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-on-background mb-1">Export JSON Backup</h4>
                    <p className="text-[11px] text-on-surface-variant mb-3 leading-relaxed">
                      Download a `.json` backup file containing all your created cards and memories.
                    </p>
                  </div>
                  <button
                    onClick={handleExportBackup}
                    className="btn-primary py-2 px-4 text-[9px] font-label-caps uppercase tracking-widest font-bold flex items-center gap-2 self-start"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export Backup
                  </button>
                </div>

                <div className="p-4 border border-primary/20 bg-surface-container flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-on-background mb-1">Restore Backup File</h4>
                    <p className="text-[11px] text-on-surface-variant mb-3 leading-relaxed">
                      Upload a previously exported `.json` file to restore cards.
                    </p>
                  </div>
                  <label className="border border-primary text-primary hover:bg-primary hover:text-background py-2 px-4 text-[9px] font-label-caps uppercase tracking-widest font-bold inline-flex items-center gap-2 cursor-pointer transition-all self-start">
                    <Upload className="w-3.5 h-3.5" />
                    Select JSON File
                    <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="mt-4 p-4 border border-red-200 bg-red-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-red-800">Factory Reset Workspace</h4>
                  <p className="text-[11px] text-red-700/80 leading-relaxed">
                    Reset local creations list back to original preset defaults.
                  </p>
                </div>
                <button
                  onClick={handleResetData}
                  className="border border-red-700 text-red-700 hover:bg-red-700 hover:text-white py-2 px-4 text-[9px] font-label-caps uppercase tracking-widest font-bold flex items-center gap-1.5 transition-all whitespace-nowrap"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Defaults
                </button>
              </div>
            </div>

            {/* Section 4: All Data Explorer Vault */}
            <div className="border border-primary/25 p-5 bg-background">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 border-b border-primary/10 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <div>
                    <h3 className="font-display-lg text-sm font-bold uppercase tracking-wider text-on-background">4. Admin All Data Explorer Center</h3>
                    <p className="text-[9px] text-on-surface-variant">Live inspection of all Memora keepsake modules (Cards, Magazines, Scrapbooks, Open Whens).</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={async () => {
                      setIsSyncing(true);
                      const cloudCards = await fetchGlobalCreationsFromCloud();
                      setIsSyncing(false);
                      if (cloudCards && cloudCards.length > 0) {
                        setAllGlobalCards(cloudCards);
                        onImportCreations(cloudCards);
                        alert(`Cloud Sync Complete: Synchronized ${cloudCards.length} global user cards & recipient replies!`);
                      } else {
                        alert('Cloud sync completed: Workspace up to date.');
                      }
                    }}
                    className="btn-primary py-1.5 px-3 text-[9px] font-label-caps uppercase tracking-widest font-bold flex items-center gap-1.5 whitespace-nowrap"
                    title="Fetch all user cards created globally across devices"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Syncing Cloud...' : 'Sync Cloud Cards'}
                  </button>
                </div>
              </div>

              {/* Tab Selector */}
              <div className="flex border border-primary p-0.5 bg-background mb-4 overflow-x-auto gap-1">
                {(['cards', 'magazines', 'scrapbooks', 'openwhens'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setExplorerTab(tab)}
                    className={`px-4 py-2 font-mono text-[9px] uppercase tracking-widest transition-all whitespace-nowrap ${
                      explorerTab === tab ? 'bg-primary text-background font-bold' : 'text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    {tab === 'cards' && `Cards (${allGlobalCards.length})`}
                    {tab === 'magazines' && `Magazines (${adminMagazines.length})`}
                    {tab === 'scrapbooks' && `Scrapbooks (${adminScrapbooks.length})`}
                    {tab === 'openwhens' && `Open Whens (${adminOpenWhens.length})`}
                  </button>
                ))}
              </div>

              {/* Admin Search Filter Input */}
              <div className="relative mb-4">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-on-surface-variant" />
                <input
                  type="text"
                  value={adminSearchQuery}
                  onChange={(e) => setAdminSearchQuery(e.target.value)}
                  placeholder={`Search ${explorerTab}...`}
                  className="w-full bg-surface-container border border-primary/20 py-1.5 pl-9 pr-3 text-xs focus:outline-none focus:border-primary text-on-background"
                />
              </div>

              {/* Explorer List */}
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {/* 1. Cards Tab */}
                {explorerTab === 'cards' && (
                  <>
                    {allGlobalCards
                      .filter(creation => {
                        if (!adminSearchQuery.trim()) return true;
                        const q = adminSearchQuery.toLowerCase();
                        return (
                          (creation.recipientName && creation.recipientName.toLowerCase().includes(q)) ||
                          (creation.creatorName && creation.creatorName.toLowerCase().includes(q)) ||
                          (creation.messageTitle && creation.messageTitle.toLowerCase().includes(q)) ||
                          (creation.id && creation.id.toLowerCase().includes(q))
                        );
                      })
                      .map((creation, idx) => {
                        const isLive = creation.status === 'LIVE';
                        const repliesList = creation.replies || [];
                        const viewsCount = creation.views || 0;

                        return (
                          <div key={creation.id || idx} className="p-4 bg-surface-container border border-primary/20 space-y-3 text-xs shadow-sm">
                            <div className="flex justify-between items-center border-b border-primary/10 pb-2">
                              <span className="font-mono text-[11px] font-bold text-primary flex items-center gap-1.5">
                                <Globe className="w-3 h-3 text-primary" />
                                {creation.id}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[9px] text-green-700 bg-green-50 px-2 py-0.5 border border-green-200 font-bold">
                                  👁️ {viewsCount} Views
                                </span>
                                <span className={`px-2 py-0.5 font-label-caps text-[8px] uppercase font-bold ${isLive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                  {creation.status || 'LIVE'}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono bg-background p-2.5 border border-primary/10">
                              <div><strong className="text-on-surface-variant">Recipient:</strong> <span className="text-primary font-bold">{creation.recipientName || 'Friend'}</span></div>
                              <div><strong className="text-on-surface-variant">Creator:</strong> <span className="text-on-background font-bold">{creation.creatorName || 'Anonymous'}</span></div>
                              <div><strong className="text-on-surface-variant">Occasion:</strong> {creation.relationship || 'Partner'} ({creation.specialDate || 'No Date'})</div>
                              <div><strong className="text-on-surface-variant">Template:</strong> {creation.templateId}</div>
                              <div><strong className="text-on-surface-variant">Music:</strong> {creation.musicTrack}</div>
                              <div><strong className="text-on-surface-variant">Theme/FX:</strong> {creation.themeColor} / {creation.particles}</div>
                              <div><strong className="text-on-surface-variant">Lock Game:</strong> {creation.interactiveElement}</div>
                              <div><strong className="text-on-surface-variant">Replies Count:</strong> <span className="font-bold text-primary">{repliesList.length}</span></div>
                            </div>

                            <div className="pt-1">
                              <div className="font-bold text-on-background text-xs">{creation.messageTitle}</div>
                              <div className="text-on-surface-variant text-[11px] mt-1 italic p-2 bg-background border border-primary/10">
                                "{creation.messageBody}"
                              </div>
                            </div>

                            <div className="p-3 bg-background border border-primary/20 space-y-2">
                              <div className="flex items-center gap-1.5 font-bold text-[9px] uppercase tracking-wider text-primary border-b border-primary/10 pb-1">
                                <MessageSquare className="w-3 h-3 text-primary" />
                                Recipient Replies & Thank You Messages ({repliesList.length}):
                              </div>
                              {repliesList.length > 0 ? (
                                <div className="space-y-1.5">
                                  {repliesList.map((reply, rIdx) => (
                                    <div key={rIdx} className="p-2 bg-surface-container border border-primary/10 text-[10px] text-on-surface-variant">
                                      <div className="flex justify-between items-center mb-0.5">
                                        <strong className="text-primary font-mono">{reply.sender}</strong>
                                        <span className="text-[8px] text-on-surface-variant font-mono">{reply.date}</span>
                                      </div>
                                      <p className="italic">"{reply.text}"</p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-[10px] text-on-surface-variant italic">No recipient replies received yet.</p>
                              )}
                            </div>

                            <div className="flex gap-2 pt-2">
                              <button
                                onClick={() => {
                                  const shareableUrl = generateShareableUrl(creation);
                                  navigator.clipboard.writeText(shareableUrl);
                                  alert('Copied share link to clipboard!');
                                }}
                                className="py-1 px-3 text-[9px] font-bold font-label-caps rounded-none text-primary border border-primary/30 hover:bg-primary hover:text-background transition-colors flex items-center gap-1"
                              >
                                <Link2 className="w-3 h-3" />
                                Copy Link
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </>
                )}

                {/* 2. Magazines Tab */}
                {explorerTab === 'magazines' && (
                  <>
                    {adminMagazines
                      .filter(m => {
                        if (!adminSearchQuery.trim()) return true;
                        const q = adminSearchQuery.toLowerCase();
                        return (
                          (m.title && m.title.toLowerCase().includes(q)) ||
                          (m.creatorName && m.creatorName.toLowerCase().includes(q)) ||
                          (m.recipientName && m.recipientName.toLowerCase().includes(q)) ||
                          (m.id && m.id.toLowerCase().includes(q))
                        );
                      })
                      .map((mag, idx) => (
                        <div key={mag.id || idx} className="p-4 bg-surface-container border border-primary/20 space-y-3 text-xs shadow-sm">
                          <div className="flex justify-between items-center border-b border-primary/10 pb-2">
                            <span className="font-mono text-[11px] font-bold text-primary">{mag.id}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[9px] text-green-700 bg-green-50 px-2 py-0.5 border border-green-200 font-bold">
                                👁️ {mag.views || 0} Views
                              </span>
                              <span className={`px-2 py-0.5 font-label-caps text-[8px] uppercase font-bold ${mag.status === 'LIVE' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                                {mag.status}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono bg-background p-2.5 border border-primary/10">
                            <div><strong>Title:</strong> {mag.title}</div>
                            <div><strong>Creator:</strong> {mag.creatorName}</div>
                            <div><strong>Recipient:</strong> {mag.recipientName}</div>
                            <div><strong>Occasion:</strong> {mag.occasion}</div>
                            <div><strong>Style:</strong> {mag.style}</div>
                            <div><strong>Size:</strong> {mag.size}</div>
                            <div><strong>Pages Count:</strong> {mag.pages?.length || 0}</div>
                          </div>
                        </div>
                      ))}
                  </>
                )}

                {/* 3. Scrapbooks Tab */}
                {explorerTab === 'scrapbooks' && (
                  <>
                    {adminScrapbooks
                      .filter(s => {
                        if (!adminSearchQuery.trim()) return true;
                        const q = adminSearchQuery.toLowerCase();
                        return (
                          (s.title && s.title.toLowerCase().includes(q)) ||
                          (s.creatorName && s.creatorName.toLowerCase().includes(q)) ||
                          (s.recipientName && s.recipientName.toLowerCase().includes(q)) ||
                          (s.id && s.id.toLowerCase().includes(q))
                        );
                      })
                      .map((scrap, idx) => (
                        <div key={scrap.id || idx} className="p-4 bg-surface-container border border-primary/20 space-y-3 text-xs shadow-sm">
                          <div className="flex justify-between items-center border-b border-primary/10 pb-2">
                            <span className="font-mono text-[11px] font-bold text-primary">{scrap.id}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[9px] text-green-700 bg-green-50 px-2 py-0.5 border border-green-200 font-bold">
                                👁️ {scrap.views || 0} Views
                              </span>
                              <span className={`px-2 py-0.5 font-label-caps text-[8px] uppercase font-bold ${scrap.status === 'LIVE' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                                {scrap.status}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono bg-background p-2.5 border border-primary/10">
                            <div><strong>Title:</strong> {scrap.title}</div>
                            <div><strong>Creator:</strong> {scrap.creatorName}</div>
                            <div><strong>Recipient:</strong> {scrap.recipientName}</div>
                            <div><strong>Style:</strong> {scrap.style}</div>
                            <div><strong>Size:</strong> {scrap.size}</div>
                            <div><strong>Pages Count:</strong> {scrap.pages?.length || 0}</div>
                          </div>
                        </div>
                      ))}
                  </>
                )}

                {/* 4. Open Whens Tab */}
                {explorerTab === 'openwhens' && (
                  <>
                    {adminOpenWhens
                      .filter(o => {
                        if (!adminSearchQuery.trim()) return true;
                        const q = adminSearchQuery.toLowerCase();
                        return (
                          (o.title && o.title.toLowerCase().includes(q)) ||
                          (o.creatorName && o.creatorName.toLowerCase().includes(q)) ||
                          (o.recipientName && o.recipientName.toLowerCase().includes(q)) ||
                          (o.id && o.id.toLowerCase().includes(q))
                        );
                      })
                      .map((ow, idx) => (
                        <div key={ow.id || idx} className="p-4 bg-surface-container border border-primary/20 space-y-3 text-xs shadow-sm">
                          <div className="flex justify-between items-center border-b border-primary/10 pb-2">
                            <span className="font-mono text-[11px] font-bold text-primary">{ow.id}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[9px] text-green-700 bg-green-50 px-2 py-0.5 border border-green-200 font-bold">
                                👁️ {ow.views || 0} Views
                              </span>
                              <span className={`px-2 py-0.5 font-label-caps text-[8px] uppercase font-bold ${ow.status === 'LIVE' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                                {ow.status}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono bg-background p-2.5 border border-primary/10">
                            <div><strong>Title:</strong> {ow.title}</div>
                            <div><strong>Creator:</strong> {ow.creatorName}</div>
                            <div><strong>Recipient:</strong> {ow.recipientName}</div>
                            <div><strong>Occasion:</strong> {ow.occasion}</div>
                            <div><strong>Style:</strong> {ow.style}</div>
                            <div><strong>Envelopes Count:</strong> {ow.messages?.length || 0}</div>
                            <div><strong>Envelopes Opened:</strong> {ow.messages?.filter((m: any) => m.status === 'OPENED').length || 0}</div>
                          </div>

                          <div className="bg-background p-3 border border-primary/10 space-y-1.5">
                            <div className="font-bold text-[9px] text-primary uppercase border-b border-primary/5 pb-1">Envelopes List:</div>
                            {ow.messages?.map((m: any, mIdx: number) => (
                              <div key={mIdx} className="flex justify-between items-center text-[10px] text-on-surface-variant font-mono">
                                <span>Envelope {mIdx + 1}: "{m.promptTitle}"</span>
                                <span className="text-[8.5px] px-1.5 bg-primary/10 text-primary font-bold">{m.status} ({m.unlockMode})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </>
                )}
              </div>
            </div>

            {/* Section 5: Global Website Feedback & Reviews Explorer */}
            <div className="border border-primary/25 p-5 bg-background mt-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 border-b border-primary/10 pb-3">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  <div>
                    <h3 className="font-display-lg text-sm font-bold uppercase tracking-wider text-on-background">5. Platform-Wide Reviews & Feedback ({siteReviews.length})</h3>
                    <p className="text-[9px] text-on-surface-variant">Feedback and reviews submitted by visitors from the website homepage.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={async () => {
                      setIsSyncingReviews(true);
                      const reviews = await fetchSiteReviewsFromCloud();
                      setIsSyncingReviews(false);
                      if (reviews) {
                        setSiteReviews(reviews);
                        alert(`Synchronized ${reviews.length} platform feedback reviews!`);
                      }
                    }}
                    className="btn-primary py-1.5 px-3 text-[9px] font-label-caps uppercase tracking-widest font-bold flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSyncingReviews ? 'animate-spin' : ''}`} />
                    {isSyncingReviews ? 'Syncing...' : 'Sync Reviews'}
                  </button>
                </div>
              </div>

              {siteReviews.length > 0 ? (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {siteReviews.map((review, rIdx) => (
                    <div key={rIdx} className="p-3 bg-surface-container border border-primary/15 text-xs flex flex-col gap-1.5 shadow-sm">
                      <div className="flex justify-between items-center text-[10px] font-mono border-b border-primary/10 pb-1">
                        <span className="font-bold text-primary flex items-center gap-1">
                          <User className="w-3 h-3 text-primary" />
                          {review.sender}
                        </span>
                        <span className="text-on-surface-variant opacity-75">{review.date}</span>
                      </div>
                      <p className="text-xs text-on-background italic font-semibold">"{review.text}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border border-dashed border-primary/25 bg-surface-container-low text-xs text-on-surface-variant italic">
                  No website feedback or platform reviews recorded yet.
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
