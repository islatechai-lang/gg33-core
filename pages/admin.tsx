import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  Users,
  TrendingUp,
  Sparkles,
  Smartphone,
  Monitor,
  RefreshCw,
  LogOut,
  Search,
  Crown,
  Clock,
  ArrowUpRight,
  Activity,
  Layers,
  CheckCircle,
  Trash2,
  Globe,
  Bell,
  Send,
  X,
  Copy,
  Check,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isSendingTestPush, setIsSendingTestPush] = useState(false);

  // Dashboard Data State
  const [loading, setLoading] = useState(false);
  const [statsData, setStatsData] = useState<any>(null);
  const [daysRange, setDaysRange] = useState<number>(30);
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'pro' | 'free'>('all');
  const [lastRefreshed, setLastRefreshed] = useState<string>('');
  const [selectedPushLog, setSelectedPushLog] = useState<any>(null);
  const [recipientSearch, setRecipientSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedId(text);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredRecipients = useMemo(() => {
    if (!selectedPushLog?.recipientUsers) return [];
    const q = recipientSearch.trim().toLowerCase();
    if (!q) return selectedPushLog.recipientUsers;
    return selectedPushLog.recipientUsers.filter((u: any) =>
      (u.fullName || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.odisId || '').toLowerCase().includes(q) ||
      (u.oneSignalPlayerId || '').toLowerCase().includes(q)
    );
  }, [selectedPushLog, recipientSearch]);

  useEffect(() => {
    setMounted(true);
    // Check if previously logged in this session
    const savedToken = sessionStorage.getItem('gg33_admin_token');
    if (savedToken) {
      setIsAuthenticated(true);
      fetchStats(daysRange, savedToken);
    }
  }, []);

  // Real-time live background sync every 4 seconds
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        fetchStats(daysRange, undefined, true);
      }
    }, 4000);

    const handleVisibility = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        fetchStats(daysRange, undefined, true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isAuthenticated, daysRange]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.token) {
        setAuthError(data.error || 'Incorrect admin password');
        setIsLoggingIn(false);
        return;
      }

      sessionStorage.setItem('gg33_admin_token', data.token);
      try {
        localStorage.removeItem('gg33_admin_exclude');
        document.cookie = 'gg33_admin_exclude=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      } catch {}

      setIsAuthenticated(true);
      setPassword('');
      fetchStats(daysRange, data.token);
    } catch {
      setAuthError('Connection failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleResetData = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to reset all analytics? This will purge page views and conversion metrics to start completely fresh.'
    );
    if (!confirmed) return;

    setIsResetting(true);
    try {
      const token = sessionStorage.getItem('gg33_admin_token');
      const res = await fetch('/api/admin/reset', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        await fetchStats(daysRange);
      }
    } catch (e) {
      console.error('Error resetting analytics:', e);
    } finally {
      setIsResetting(false);
    }
  };

  const handleSendTestPush = async () => {
    if (!window.confirm("Send a test daily reset push notification to all devices now?")) return;
    setIsSendingTestPush(true);
    try {
      const token = sessionStorage.getItem('gg33_admin_token');
      const res = await fetch('/api/admin/send-test-push', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        alert("Push notification sent successfully!");
        fetchStats(daysRange);
      } else {
        alert("Failed to send push: " + (data.error || "Unknown error"));
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setIsSendingTestPush(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('gg33_admin_token');
    setIsAuthenticated(false);
    setStatsData(null);
  };

  const fetchStats = async (days = daysRange, tokenOverride?: string, isSilent = false) => {
    const token = tokenOverride || sessionStorage.getItem('gg33_admin_token');
    if (!token) return;

    if (!isSilent) setLoading(true);
    try {
      const res = await fetch(`/api/admin/stats?days=${days}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        handleLogout();
        setAuthError('Session expired. Please log in again.');
        return;
      }

      const data = await res.json();
      if (res.ok) {
        setStatsData(data);
        setLastRefreshed(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  const handleRangeChange = (newDays: number) => {
    setDaysRange(newDays);
    fetchStats(newDays);
  };

  // Filtered users list
  const filteredUsers = useMemo(() => {
    if (!statsData?.recentUsers) return [];
    return statsData.recentUsers.filter((u: any) => {
      const matchesSearch =
        !userSearch ||
        u.fullName?.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.odisId?.toLowerCase().includes(userSearch.toLowerCase());

      if (!matchesSearch) return false;

      if (userFilter === 'pro') return u.isPro;
      if (userFilter === 'free') return !u.isPro;
      return true;
    });
  }, [statsData?.recentUsers, userSearch, userFilter]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
      </div>
    );
  }

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
        <Head>
          <title>GG33 Admin Console • Access Control</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>

        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 sm:p-8 backdrop-blur-xl shadow-2xl relative z-10 space-y-6">
          <div className="text-center space-y-2 sm:space-y-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(245,158,11,0.2)]">
              <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-zinc-100 tracking-tight">GG33 Executive Admin</h1>
              <p className="text-xs text-zinc-400 mt-1">Authorized personnel only • Real-time Monitoring</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password..."
                  autoFocus
                  required
                  className="w-full h-12 bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 rounded-xl px-4 pr-12 text-base sm:text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 text-center font-medium">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn || !password}
              className="w-full h-12 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-zinc-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(245,158,11,0.3)] hover:shadow-[0_6px_25px_rgba(245,158,11,0.4)] transition-all transform active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Unlock Admin Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-zinc-800/80">
            <p className="text-[11px] text-zinc-400">
              Visits from <span className="text-amber-400/90 font-mono">princederder44@gmail.com</span> are permanently excluded.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // DASHBOARD SCREEN
  const kpis = statsData?.kpis;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20 selection:bg-amber-500/30">
      <Head>
        <title>GG33 Admin Dashboard • Analytics & Users</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/80 px-3 sm:px-8 py-2.5 sm:py-3.5 transition-all">
        <div className="max-w-7xl mx-auto space-y-2 sm:space-y-0">
          <div className="flex items-center justify-between gap-2">
            {/* Logo & Title */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-extrabold text-sm tracking-tight text-zinc-100">GG33 CORE</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    ADMIN
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5 sm:hidden" title="Live Sync Active" />
                </div>
                <p className="text-[10px] sm:text-[11px] text-zinc-400 truncate max-w-[160px] sm:max-w-none">
                  Real-Time User Intelligence
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Owner Excluded Pill (Desktop) */}
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Owner Excluded: <span className="font-mono text-[11px]">princederder44@gmail.com</span></span>
              </div>

              {/* Days Filter (Desktop) */}
              <div className="hidden sm:flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs font-semibold">
                {[7, 14, 30].map((d) => (
                  <button
                    key={d}
                    onClick={() => handleRangeChange(d)}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      daysRange === d ? 'bg-amber-500 text-zinc-950 font-bold shadow' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {d}D
                  </button>
                ))}
              </div>

              {/* Refresh */}
              <button
                onClick={() => fetchStats()}
                disabled={loading}
                title="Refresh Analytics"
                className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-amber-400 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
                <span className="hidden md:inline">Refresh</span>
              </button>

              {/* Reset Analytics */}
              <button
                onClick={handleResetData}
                disabled={isResetting}
                title="Reset Analytics Data to 0"
                className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-red-950/30 hover:bg-red-950/60 border border-red-800/40 hover:border-red-500/50 text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <Trash2 className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                <span className="hidden md:inline">Reset</span>
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                title="Log out from Admin"
                className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-zinc-900 hover:bg-red-950/40 border border-zinc-800 hover:border-red-500/30 text-zinc-400 hover:text-red-400 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Exit</span>
              </button>
            </div>
          </div>

          {/* Mobile Secondary Row: Days filter & Quick Navigation Tabs */}
          <div className="flex sm:hidden items-center justify-between gap-1.5 pt-1.5 border-t border-zinc-800/60">
            {/* Days Filter Mobile */}
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-[11px] font-semibold flex-shrink-0">
              {[7, 14, 30].map((d) => (
                <button
                  key={d}
                  onClick={() => handleRangeChange(d)}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    daysRange === d ? 'bg-amber-500 text-zinc-950 font-bold shadow' : 'text-zinc-400'
                  }`}
                >
                  {d}D
                </button>
              ))}
            </div>

            {/* Quick Section Anchors for Mobile */}
            <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-medium scrollbar-none pl-1">
              <button
                onClick={() => scrollToSection('section-overview')}
                className="px-2 py-1 rounded-md bg-zinc-900/90 text-zinc-300 border border-zinc-800 active:bg-amber-500/20 active:text-amber-300 whitespace-nowrap"
              >
                KPIs
              </button>
              <button
                onClick={() => scrollToSection('section-activity')}
                className="px-2 py-1 rounded-md bg-zinc-900/90 text-zinc-300 border border-zinc-800 active:bg-amber-500/20 active:text-amber-300 whitespace-nowrap"
              >
                Activity
              </button>
              <button
                onClick={() => scrollToSection('section-push')}
                className="px-2 py-1 rounded-md bg-zinc-900/90 text-zinc-300 border border-zinc-800 active:bg-amber-500/20 active:text-amber-300 whitespace-nowrap"
              >
                Push
              </button>
              <button
                onClick={() => scrollToSection('section-users')}
                className="px-2 py-1 rounded-md bg-zinc-900/90 text-zinc-300 border border-zinc-800 active:bg-amber-500/20 active:text-amber-300 whitespace-nowrap"
              >
                Users
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-3 sm:px-8 pt-4 sm:pt-8 space-y-6 sm:space-y-8">
        {/* Banner with Last Refreshed & Exclusion Notice */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span className="text-[11px] sm:text-xs">
              Live Tracking Engine Active. Traffic excludes{' '}
              <strong className="text-zinc-200">princederder44@gmail.com</strong>.
            </span>
          </div>
          {lastRefreshed && (
            <div className="flex items-center gap-2 text-zinc-400 font-mono text-[11px] sm:text-xs">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Sync (4s)
              </span>
              <div className="flex items-center gap-1 text-zinc-500 font-sans">
                <Clock className="w-3.5 h-3.5" />
                <span>{lastRefreshed}</span>
              </div>
            </div>
          )}
        </div>

        {/* 4 PRIMARY KPI METRIC CARDS (2x2 Grid on Mobile, 4 Cols on Desktop) */}
        <div id="section-overview" className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {/* KPI 1: TOTAL USERS */}
          <div className="bg-zinc-900/70 border border-zinc-800/90 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 backdrop-blur-sm space-y-2 sm:space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Users</span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-zinc-100 tracking-tight">
                {kpis?.totalUsers?.toLocaleString() ?? 0}
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5 flex-wrap text-[10px] sm:text-xs">
                <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30 text-[10px]">
                  {kpis?.proUsers ?? 0} PRO
                </span>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-400 text-[10px]">{kpis?.freeUsers ?? 0} Free</span>
              </div>
            </div>
            <div className="pt-2 border-t border-zinc-800/80 text-[10px] sm:text-[11px] text-zinc-400 flex items-center justify-between">
              <span className="text-emerald-400 font-medium">
                {kpis?.conversionRate ?? 0}% Pro Rate
              </span>
              <span className="text-zinc-500">+{kpis?.usersJoinedToday ?? 0} today</span>
            </div>
          </div>

          {/* KPI 2: TOTAL PAGE VIEWS */}
          <div className="bg-zinc-900/70 border border-zinc-800/90 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 backdrop-blur-sm space-y-2 sm:space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-wider">Page Views</span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-zinc-100 tracking-tight">
                {kpis?.totalViews?.toLocaleString() ?? 0}
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5 text-[10px] sm:text-xs">
                <span className="text-emerald-400 font-semibold text-[10px]">
                  Today: {kpis?.viewsToday?.toLocaleString() ?? 0}
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-zinc-800/80 text-[10px] sm:text-[11px] text-zinc-400 flex items-center justify-between">
              <span>Daily Pace</span>
              <span className="text-emerald-400 font-semibold">{kpis?.viewsGrowthVsYesterday}% DoD</span>
            </div>
          </div>

          {/* KPI 3: UNIQUE VISITORS */}
          <div className="bg-zinc-900/70 border border-zinc-800/90 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 backdrop-blur-sm space-y-2 sm:space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-wider">Visitors</span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-zinc-100 tracking-tight">
                {kpis?.uniqueVisitors?.toLocaleString() ?? 0}
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5 text-[10px] sm:text-xs">
                <span className="text-cyan-400 font-medium text-[10px]">
                  {kpis?.uniqueVisitorsToday ?? 0} active today
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-zinc-800/80 text-[10px] sm:text-[11px] text-zinc-400 flex items-center justify-between">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Smartphone className="w-3 h-3" />
                {statsData?.platformBreakdown?.android_app ?? 0} App
              </span>
              <span>
                🌐 {(statsData?.platformBreakdown?.mobile_web ?? 0) + (statsData?.platformBreakdown?.desktop_web ?? 0)} Web
              </span>
            </div>
          </div>

          {/* KPI 4: UPGRADE / CHECKOUT CLICKS */}
          <div className="bg-zinc-900/70 border border-zinc-800/90 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 backdrop-blur-sm space-y-2 sm:space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-wider">Upgrade Clicks</span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">
                {kpis?.totalUpgradeClicks?.toLocaleString() ?? 0}
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5 text-[10px] sm:text-xs text-zinc-400">
                <span className="text-amber-400 font-semibold text-[10px]">
                  Today: {kpis?.upgradeClicksToday ?? 0}
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-zinc-800/80 text-[10px] sm:text-[11px] text-zinc-400 flex items-center justify-between">
              <span>Intent</span>
              <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                Active <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>

        {/* VISUAL CHARTS & TOP PAGES GRID */}
        <div id="section-charts" className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Daily Views Area Chart (Span 2) */}
          <div className="lg:col-span-2 bg-zinc-900/70 border border-zinc-800/90 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-zinc-100 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <span>Traffic Trend ({daysRange} Days)</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-zinc-400">Daily page views over time</p>
              </div>
            </div>

            <div className="h-52 sm:h-64 w-full pt-2">
              {statsData?.dailyTrend && statsData.dailyTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={statsData.dailyTrend} margin={{ top: 10, right: 8, left: -22, bottom: 0 }}>
                    <defs>
                      <linearGradient id="amberGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis
                      dataKey="label"
                      stroke="#71717a"
                      fontSize={10}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#71717a"
                      fontSize={10}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#18181b',
                        borderColor: '#3f3f46',
                        borderRadius: '0.75rem',
                        color: '#f4f4f5',
                        fontSize: '12px',
                      }}
                      labelStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="#f59e0b"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#amberGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-500 text-xs">
                  Awaiting page traffic events...
                </div>
              )}
            </div>
          </div>

          {/* Top Visited Pages (Span 1) */}
          <div className="bg-zinc-900/70 border border-zinc-800/90 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-zinc-100 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Top Pages</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-zinc-400">Most visited app sections</p>
              </div>
            </div>

            <div className="space-y-2.5 sm:space-y-3 pt-1">
              {statsData?.topPages && statsData.topPages.length > 0 ? (
                statsData.topPages.map((page: any) => (
                  <div key={page.path} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-zinc-300 truncate max-w-[170px] sm:max-w-[200px]">
                        {page.path === '/' ? '/ (Home)' : page.path}
                      </span>
                      <div className="flex items-center gap-1.5 font-semibold">
                        <span className="text-zinc-200">{page.count}</span>
                        <span className="text-[10px] text-zinc-500">({page.percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                        style={{ width: `${Math.min(100, Math.max(5, parseFloat(page.percentage)))}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-zinc-500 text-xs">
                  No page views recorded yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PLATFORM & DEVICE BREAKDOWN */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-zinc-900/50 border border-emerald-500/30 flex items-center gap-3 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-emerald-400">Google Play Store App</p>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-xl font-black text-zinc-100">
                {statsData?.platformBreakdown?.android_app ?? 0}
              </p>
              <p className="text-[11px] text-zinc-500">Median Native Android App</p>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <Globe className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-400">Mobile Web Browser</p>
              <p className="text-xl font-bold text-zinc-100">
                {statsData?.platformBreakdown?.mobile_web ?? 0}
              </p>
              <p className="text-[11px] text-zinc-500">Chrome, Safari on phones</p>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0">
              <Monitor className="w-5 h-5 text-zinc-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-400">Desktop Web Browser</p>
              <p className="text-xl font-bold text-zinc-100">
                {statsData?.platformBreakdown?.desktop_web ?? 0}
              </p>
              <p className="text-[11px] text-zinc-500">PC / Laptop browser visits</p>
            </div>
          </div>
        </div>

        {/* RECENT LIVE VISITS FEED (LIVE ACTIVITY STREAM) */}
        <div id="section-activity" className="bg-zinc-900/70 border border-zinc-800/90 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-zinc-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Live Activity Stream</span>
              </h3>
              <p className="text-[11px] sm:text-xs text-zinc-400">Real-time user navigation across the application</p>
            </div>
            <span className="text-[10px] sm:text-[11px] text-zinc-500 font-mono">Real-time</span>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pr-4">Timestamp</th>
                  <th className="pb-3 px-4">Page Route</th>
                  <th className="pb-3 px-4">Platform</th>
                  <th className="pb-3 px-4">User Status</th>
                  <th className="pb-3 pl-4">Browser & OS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {statsData?.recentVisits && statsData.recentVisits.length > 0 ? (
                  statsData.recentVisits.map((visit: any) => {
                    const date = new Date(visit.timestamp);
                    const timeAgo = formatTimeAgo(date);

                    return (
                      <tr key={visit.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="py-2.5 pr-4 text-zinc-400 whitespace-nowrap">
                          {timeAgo}
                        </td>
                        <td className="py-2.5 px-4 font-mono font-medium text-amber-400/90">
                          {visit.path === '/' ? '/ (Home)' : visit.path}
                        </td>
                        <td className="py-2.5 px-4">
                          {visit.isNativeApp || visit.platform === 'android_app' ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold inline-flex items-center gap-1">
                              <Smartphone className="w-3 h-3" /> Play Store App
                            </span>
                          ) : visit.platform === 'mobile_web' ? (
                            <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 text-[10px]">
                              Mobile Web
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 text-[10px]">
                              Desktop Web
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4">
                          {visit.isPro ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                              PRO USER
                            </span>
                          ) : visit.userEmail ? (
                            <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10px]">
                              {visit.userEmail}
                            </span>
                          ) : (
                            <span className="text-zinc-500 text-[11px]">Guest Visitor</span>
                          )}
                        </td>
                        <td className="py-2.5 pl-4 text-zinc-400">
                          {visit.browser} • {visit.os}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-zinc-500">
                      No visits recorded yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Feed View */}
          <div className="md:hidden divide-y divide-zinc-800/60 space-y-2.5 pt-1">
            {statsData?.recentVisits && statsData.recentVisits.length > 0 ? (
              statsData.recentVisits.map((visit: any) => {
                const date = new Date(visit.timestamp);
                const timeAgo = formatTimeAgo(date);

                return (
                  <div key={visit.id} className="pt-2.5 first:pt-0 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400/90 truncate max-w-[210px]">
                        {visit.path === '/' ? '/ (Home)' : visit.path}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 whitespace-nowrap">
                        {timeAgo}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {visit.isNativeApp || visit.platform === 'android_app' ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold inline-flex items-center gap-1">
                          <Smartphone className="w-3 h-3" /> Play App
                        </span>
                      ) : visit.platform === 'mobile_web' ? (
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 text-[10px]">
                          Mobile Web
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 text-[10px]">
                          Desktop Web
                        </span>
                      )}

                      {visit.isPro ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-bold inline-flex items-center gap-1">
                          <Crown className="w-2.5 h-2.5" /> PRO
                        </span>
                      ) : visit.userEmail ? (
                        <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10px] truncate max-w-[150px]">
                          {visit.userEmail}
                        </span>
                      ) : (
                        <span className="text-zinc-500 text-[10px]">Guest Visitor</span>
                      )}
                    </div>

                    <div className="text-[10px] text-zinc-500 truncate">
                      {visit.browser} • {visit.os}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-6 text-center text-zinc-500 text-xs">No visits recorded yet</div>
            )}
          </div>
        </div>

        {/* PUSH NOTIFICATIONS DELIVERY & CLICK TRACKER */}
        <div id="section-push" className="bg-zinc-900/70 border border-zinc-800/90 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-zinc-100 flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <span>Daily Push Notification Monitor</span>
              </h3>
              <p className="text-[11px] sm:text-xs text-zinc-400">Track delivery to user devices & actual app opens from push</p>
            </div>
            <button
              onClick={handleSendTestPush}
              disabled={isSendingTestPush}
              className="w-full sm:w-auto justify-center px-4 py-2 sm:px-3.5 sm:py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 active:scale-[0.98]"
            >
              <Send className={`w-3.5 h-3.5 ${isSendingTestPush ? 'animate-spin' : ''}`} />
              <span>{isSendingTestPush ? 'Sending Broadcast...' : 'Test Send Push Broadcast'}</span>
            </button>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pr-4">Notification Title</th>
                  <th className="pb-3 px-4">Type</th>
                  <th className="pb-3 px-4">Targeted Devices</th>
                  <th className="pb-3 px-4">Recipients</th>
                  <th className="pb-3 px-4">App Opens / Clicks</th>
                  <th className="pb-3 px-4">Open Rate (CTR)</th>
                  <th className="pb-3 pl-4">Sent At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {statsData?.pushLogs && statsData.pushLogs.length > 0 ? (
                  statsData.pushLogs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="font-semibold text-zinc-200">{log.title}</div>
                        <div className="text-[11px] text-zinc-500 truncate max-w-xs">{log.content}</div>
                      </td>
                      <td className="py-3 px-4 uppercase text-[10px] font-mono font-bold text-amber-400">
                        {log.type?.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4 text-zinc-300 font-semibold">
                        📱 {log.targetDevicesCount} devices
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            setSelectedPushLog(log);
                            setRecipientSearch('');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-[11px] font-bold border border-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>View {log.recipientUsers?.length || log.targetUsersCount || 0} Users</span>
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                          {log.clicksCount} opens
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-400">
                        {log.ctr}%
                      </td>
                      <td className="py-3 pl-4 text-zinc-400 text-xs">
                        {new Date(log.sentAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-zinc-500">
                      No push notifications dispatched yet today
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Feed View */}
          <div className="md:hidden space-y-3">
            {statsData?.pushLogs && statsData.pushLogs.length > 0 ? (
              statsData.pushLogs.map((log: any) => (
                <div key={log.id} className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-semibold text-zinc-100 text-xs truncate">{log.title}</div>
                      <div className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">{log.content}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[9px] font-mono font-bold uppercase whitespace-nowrap flex-shrink-0">
                      {log.type?.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Compact Stats Row */}
                  <div className="grid grid-cols-3 gap-2 py-1.5 px-2 rounded-lg bg-zinc-900/80 border border-zinc-800 text-center">
                    <div>
                      <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Target</div>
                      <div className="text-xs font-bold text-zinc-200">📱 {log.targetDevicesCount}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Opens</div>
                      <div className="text-xs font-bold text-emerald-400">{log.clicksCount}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-zinc-500 uppercase tracking-wider">CTR</div>
                      <div className="text-xs font-bold text-emerald-400">{log.ctr}%</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-[10px] text-zinc-500">
                      {new Date(log.sentAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                      })}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedPushLog(log);
                        setRecipientSearch('');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-xs font-bold border border-zinc-700 flex items-center gap-1.5 transition-colors active:scale-95 cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>View Users</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-zinc-500 text-xs">
                No push notifications dispatched yet today
              </div>
            )}
          </div>
        </div>

        {/* REGISTERED USERS DIRECTORY */}
        <div id="section-users" className="bg-zinc-900/70 border border-zinc-800/90 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm space-y-4 sm:space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-zinc-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span>User Directory</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {filteredUsers.length} shown
                </span>
              </h3>
              <p className="text-[11px] sm:text-xs text-zinc-400">Actual registered users (owner excluded)</p>
            </div>

            {/* Search & Tabs Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search user, email, odisId..."
                  className="w-full h-10 sm:h-9 bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 text-base sm:text-xs text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="grid grid-cols-3 sm:flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-1 text-xs font-semibold">
                <button
                  onClick={() => setUserFilter('all')}
                  className={`py-1.5 sm:py-1 px-3 text-center rounded-lg transition-all ${
                    userFilter === 'all' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setUserFilter('pro')}
                  className={`py-1.5 sm:py-1 px-3 text-center rounded-lg transition-all ${
                    userFilter === 'pro' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400'
                  }`}
                >
                  Pro
                </button>
                <button
                  onClick={() => setUserFilter('free')}
                  className={`py-1.5 sm:py-1 px-3 text-center rounded-lg transition-all ${
                    userFilter === 'free' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400'
                  }`}
                >
                  Free
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pr-4">User</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 px-4">ODIS ID</th>
                  <th className="pb-3 pl-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u: any) => (
                    <tr key={u.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-amber-400">
                            {u.fullName?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="font-semibold text-zinc-200">{u.fullName || 'Anonymous User'}</div>
                            <div className="text-[11px] text-zinc-400">{u.email || 'No email provided'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {u.isPro ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold text-[10px]">
                            <Crown className="w-3 h-3 text-amber-400" /> PRO
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 text-[10px]">
                            FREE
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-zinc-400">
                        <div className="flex items-center gap-1.5">
                          <span>{u.odisId}</span>
                          <button
                            onClick={() => handleCopy(u.odisId)}
                            className="p-1 hover:text-amber-400 text-zinc-500 transition-colors"
                            title="Copy ODIS ID"
                          >
                            {copiedId === u.odisId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 pl-4 text-zinc-400 text-xs">
                        {new Date(u.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-zinc-500">
                      No matching users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Feed View */}
          <div className="md:hidden divide-y divide-zinc-800/60 space-y-2.5">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u: any) => (
                <div key={u.id} className="pt-2.5 first:pt-0 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-amber-400 flex-shrink-0">
                        {u.fullName?.charAt(0) || 'U'}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-zinc-200 text-xs truncate">{u.fullName || 'Anonymous User'}</div>
                        <div className="text-[11px] text-zinc-400 truncate">{u.email || 'No email provided'}</div>
                      </div>
                    </div>
                    <div>
                      {u.isPro ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold text-[10px]">
                          <Crown className="w-2.5 h-2.5" /> PRO
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 text-[10px]">
                          FREE
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-0.5">
                    <div className="flex items-center gap-1 font-mono text-[10px] text-zinc-400 truncate max-w-[200px]">
                      <span>ID:</span>
                      <span className="text-zinc-300 truncate">{u.odisId}</span>
                      <button
                        onClick={() => handleCopy(u.odisId)}
                        className="p-1 hover:text-amber-400 text-zinc-500 transition-colors"
                        title="Copy ODIS ID"
                      >
                        {copiedId === u.odisId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    <span className="text-[10px] text-zinc-500 whitespace-nowrap">
                      {new Date(u.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-zinc-500 text-xs">No matching users found</div>
            )}
          </div>
        </div>

        {/* PUSH NOTIFICATION RECIPIENTS MODAL (Mobile Bottom Sheet / Fullscreen) */}
        {selectedPushLog && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-t-2xl sm:rounded-2xl max-w-3xl w-full h-[90vh] sm:h-auto sm:max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-zinc-800/80 flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <h3 className="text-sm sm:text-base font-bold text-zinc-100 truncate">
                      Push Recipients
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[9px] sm:text-[10px] font-bold uppercase flex-shrink-0">
                      {selectedPushLog.type?.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-zinc-400 mt-1 truncate">
                    {selectedPushLog.title} • {new Date(selectedPushLog.sentAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPushLog(null)}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer active:scale-95 flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Search Bar */}
              <div className="p-3 sm:p-4 border-b border-zinc-800/50 bg-zinc-950/40 flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    value={recipientSearch}
                    onChange={(e) => setRecipientSearch(e.target.value)}
                    placeholder="Search name, email, or ODIS ID..."
                    className="w-full pl-9 pr-4 py-2 sm:py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-base sm:text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <span className="text-[11px] sm:text-xs text-zinc-400 font-mono whitespace-nowrap">
                  {filteredRecipients.length} of {selectedPushLog.recipientUsers?.length || selectedPushLog.targetUsersCount || 0}
                </span>
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block flex-1 overflow-y-auto p-4">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="pb-3 pr-4">User</th>
                      <th className="pb-3 px-4">Plan</th>
                      <th className="pb-3 px-4">ODIS ID</th>
                      <th className="pb-3 pl-4">Push Device Link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/40">
                    {filteredRecipients.length > 0 ? (
                      filteredRecipients.map((rec: any, idx: number) => (
                        <tr key={rec.odisId || idx} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="py-2.5 pr-4">
                            <div className="font-semibold text-zinc-200">{rec.fullName || 'Anonymous User'}</div>
                            <div className="text-[11px] text-zinc-400">{rec.email || 'No email provided'}</div>
                          </td>
                          <td className="py-2.5 px-4">
                            {rec.isPro ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold text-[10px]">
                                <Crown className="w-3 h-3 text-amber-400" /> PRO
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 text-[10px]">
                                FREE
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 font-mono text-[11px] text-zinc-400">
                            {rec.odisId}
                          </td>
                          <td className="py-2.5 pl-4">
                            {rec.hasPushToken ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold text-[10px]">
                                <Smartphone className="w-3 h-3" /> Token Linked
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-medium text-[10px]" title="Delivered via Google Play Store broadcast and user account alias">
                                <Globe className="w-3 h-3" /> Targeted (Broadcast & Alias)
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-zinc-500">
                          {selectedPushLog.recipientUsers && selectedPushLog.recipientUsers.length > 0
                            ? 'No users match your search criteria'
                            : 'No detailed recipient records attached to this log'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card Feed View */}
              <div className="md:hidden flex-1 overflow-y-auto p-3 divide-y divide-zinc-800/60 space-y-2.5">
                {filteredRecipients.length > 0 ? (
                  filteredRecipients.map((rec: any, idx: number) => (
                    <div key={rec.odisId || idx} className="pt-2.5 first:pt-0 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-semibold text-zinc-200 text-xs truncate">{rec.fullName || 'Anonymous User'}</div>
                          <div className="text-[11px] text-zinc-400 truncate">{rec.email || 'No email provided'}</div>
                        </div>
                        <div>
                          {rec.isPro ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold text-[10px]">
                              <Crown className="w-2.5 h-2.5" /> PRO
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 text-[10px]">
                              FREE
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-0.5">
                        <span className="font-mono text-[10px] text-zinc-400 truncate max-w-[150px]">
                          {rec.odisId}
                        </span>
                        <div>
                          {rec.hasPushToken ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold text-[9px]">
                              <Smartphone className="w-2.5 h-2.5" /> Token Linked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-medium text-[9px]">
                              <Globe className="w-2.5 h-2.5" /> Broadcast & Alias
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-zinc-500 text-xs">
                    {selectedPushLog.recipientUsers && selectedPushLog.recipientUsers.length > 0
                      ? 'No users match your search criteria'
                      : 'No detailed recipient records attached to this log'}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-3.5 sm:p-4 border-t border-zinc-800/80 bg-zinc-950/60 flex items-center justify-between">
                <span className="text-[10px] sm:text-[11px] text-zinc-400 truncate max-w-[200px] sm:max-w-none">
                  Targeted: <strong className="text-zinc-200">{selectedPushLog.targetDevicesCount}</strong> • Opens: <strong className="text-emerald-400">{selectedPushLog.clicksCount} ({selectedPushLog.ctr}%)</strong>
                </span>
                <button
                  onClick={() => setSelectedPushLog(null)}
                  className="px-4 py-2 sm:px-3.5 sm:py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer active:scale-95"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 60) return `${Math.max(1, diffSec)}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
