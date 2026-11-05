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
  Tablet,
  RefreshCw,
  LogOut,
  Search,
  Crown,
  Clock,
  ArrowUpRight,
  Activity,
  Layers,
  CheckCircle,
  ExternalLink,
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

  // Dashboard Data State
  const [loading, setLoading] = useState(false);
  const [statsData, setStatsData] = useState<any>(null);
  const [daysRange, setDaysRange] = useState<number>(30);
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'pro' | 'free'>('all');
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    // Check if previously logged in this session
    const savedToken = sessionStorage.getItem('gg33_admin_token');
    if (savedToken) {
      setIsAuthenticated(true);
      fetchStats(daysRange, savedToken);
    }
  }, []);

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
        localStorage.setItem('gg33_admin_exclude', 'true');
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

  const handleLogout = () => {
    sessionStorage.removeItem('gg33_admin_token');
    setIsAuthenticated(false);
    setStatsData(null);
  };

  const fetchStats = async (days = daysRange, tokenOverride?: string) => {
    const token = tokenOverride || sessionStorage.getItem('gg33_admin_token');
    if (!token) return;

    setLoading(true);
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
      setLoading(false);
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
      <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
        <Head>
          <title>GG33 Admin Console • Access Control</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>

        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative z-10 space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(245,158,11,0.2)]">
              <Shield className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-zinc-100 tracking-tight">GG33 Executive Admin</h1>
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
                  className="w-full h-12 bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 rounded-xl px-4 pr-12 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-16 selection:bg-amber-500/30">
      <Head>
        <title>GG33 Admin Dashboard • Analytics & Users</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center">
              <Shield className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight text-zinc-100">GG33 CORE</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  ADMIN
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Real-Time Metrics & User Intelligence</p>
            </div>
          </div>

          {/* Controls: Exclusion Pill, Range Selector, Refresh, Logout */}
          <div className="flex items-center gap-2.5 flex-wrap justify-end">
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Owner Excluded: <span className="font-mono text-[11px]">princederder44@gmail.com</span></span>
            </div>

            {/* Days Filter */}
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs font-semibold">
              <button
                onClick={() => handleRangeChange(7)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  daysRange === 7 ? 'bg-amber-500 text-zinc-950 shadow' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                7D
              </button>
              <button
                onClick={() => handleRangeChange(14)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  daysRange === 14 ? 'bg-amber-500 text-zinc-950 shadow' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                14D
              </button>
              <button
                onClick={() => handleRangeChange(30)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  daysRange === 30 ? 'bg-amber-500 text-zinc-950 shadow' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                30D
              </button>
            </div>

            {/* Refresh */}
            <button
              onClick={() => fetchStats()}
              disabled={loading}
              title="Refresh Analytics"
              className="h-9 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-amber-400 text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              title="Log out from Admin"
              className="h-9 px-3 rounded-xl bg-zinc-900 hover:bg-red-950/40 border border-zinc-800 hover:border-red-500/30 text-zinc-400 hover:text-red-400 text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Banner with Last Refreshed & Exclusion Notice */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              Live Tracking Engine Active. Showing actual user traffic strictly excluding{' '}
              <strong className="text-zinc-200">princederder44@gmail.com</strong>.
            </span>
          </div>
          {lastRefreshed && (
            <div className="flex items-center gap-1.5 text-zinc-500">
              <Clock className="w-3.5 h-3.5" />
              <span>Last updated: {lastRefreshed}</span>
            </div>
          )}
        </div>

        {/* 4 PRIMARY KPI METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: TOTAL USERS */}
          <div className="bg-zinc-900/70 border border-zinc-800/90 rounded-2xl p-5 backdrop-blur-sm space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Users</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Users className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-zinc-100 tracking-tight">
                {kpis?.totalUsers?.toLocaleString() ?? 0}
              </div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap text-xs">
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30 text-[11px]">
                  {kpis?.proUsers ?? 0} PRO
                </span>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-400 text-[11px]">{kpis?.freeUsers ?? 0} Free</span>
                <span className="text-zinc-500">•</span>
                <span className="text-emerald-400 font-medium text-[11px]">
                  {kpis?.conversionRate ?? 0}% Pro Rate
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-400 flex items-center justify-between">
              <span>+{kpis?.usersJoinedToday ?? 0} today</span>
              <span>+{kpis?.usersJoinedThisWeek ?? 0} this week</span>
            </div>
          </div>

          {/* KPI 2: TOTAL PAGE VIEWS */}
          <div className="bg-zinc-900/70 border border-zinc-800/90 rounded-2xl p-5 backdrop-blur-sm space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Page Views</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-zinc-100 tracking-tight">
                {kpis?.totalViews?.toLocaleString() ?? 0}
              </div>
              <div className="flex items-center gap-2 mt-1.5 text-xs">
                <span className="text-emerald-400 font-semibold text-[11px]">
                  Today: {kpis?.viewsToday?.toLocaleString() ?? 0}
                </span>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-400 text-[11px]">
                  Yesterday: {kpis?.viewsYesterday?.toLocaleString() ?? 0}
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-400 flex items-center justify-between">
              <span>Daily Pace</span>
              <span className="text-emerald-400 font-semibold">{kpis?.viewsGrowthVsYesterday}% DoD</span>
            </div>
          </div>

          {/* KPI 3: UNIQUE VISITORS */}
          <div className="bg-zinc-900/70 border border-zinc-800/90 rounded-2xl p-5 backdrop-blur-sm space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Unique Visitors</span>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <Activity className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-zinc-100 tracking-tight">
                {kpis?.uniqueVisitors?.toLocaleString() ?? 0}
              </div>
              <div className="flex items-center gap-2 mt-1.5 text-xs">
                <span className="text-cyan-400 font-medium text-[11px]">
                  {kpis?.uniqueVisitorsToday ?? 0} active today
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-400 flex items-center justify-between">
              <span>Mobile: {statsData?.deviceBreakdown?.mobile ?? 0}</span>
              <span>Desktop: {statsData?.deviceBreakdown?.desktop ?? 0}</span>
            </div>
          </div>

          {/* KPI 4: UPGRADE / CHECKOUT CLICKS */}
          <div className="bg-zinc-900/70 border border-zinc-800/90 rounded-2xl p-5 backdrop-blur-sm space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Upgrade Clicks</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-amber-400 tracking-tight">
                {kpis?.totalUpgradeClicks?.toLocaleString() ?? 0}
              </div>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-zinc-400">
                <span className="text-amber-400 font-semibold text-[11px]">
                  Today: {kpis?.upgradeClicksToday ?? 0}
                </span>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-400 text-[11px]">High Purchase Intent</span>
              </div>
            </div>
            <div className="pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-400 flex items-center justify-between">
              <span>Checkout Funnel</span>
              <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                Active <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>

        {/* VISUAL CHARTS & TOP PAGES GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Views Area Chart (Span 2) */}
          <div className="lg:col-span-2 bg-zinc-900/70 border border-zinc-800/90 rounded-2xl p-6 backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <span>Traffic Trend ({daysRange} Days)</span>
                </h3>
                <p className="text-xs text-zinc-400">Daily page views over time</p>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              {statsData?.dailyTrend && statsData.dailyTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={statsData.dailyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#71717a"
                      fontSize={11}
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
          <div className="bg-zinc-900/70 border border-zinc-800/90 rounded-2xl p-6 backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Top Pages</span>
                </h3>
                <p className="text-xs text-zinc-400">Most visited app sections</p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              {statsData?.topPages && statsData.topPages.length > 0 ? (
                statsData.topPages.map((page: any, idx: number) => (
                  <div key={page.path} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-zinc-300 truncate max-w-[170px]">
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
                <div className="text-center py-8 text-zinc-500 text-xs">
                  No page views recorded yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DEVICE & PLATFORM BREAKDOWN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-400">Mobile Visits</p>
              <p className="text-lg font-bold text-zinc-100">
                {statsData?.deviceBreakdown?.mobile ?? 0}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Monitor className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-400">Desktop Visits</p>
              <p className="text-lg font-bold text-zinc-100">
                {statsData?.deviceBreakdown?.desktop ?? 0}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Tablet className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-400">Tablet Visits</p>
              <p className="text-lg font-bold text-zinc-100">
                {statsData?.deviceBreakdown?.tablet ?? 0}
              </p>
            </div>
          </div>
        </div>

        {/* RECENT LIVE VISITS FEED */}
        <div className="bg-zinc-900/70 border border-zinc-800/90 rounded-2xl p-6 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Live Activity Stream</span>
              </h3>
              <p className="text-xs text-zinc-400">Recent real user navigation across the web application</p>
            </div>
            <span className="text-[11px] text-zinc-500 font-mono">Real-time</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pr-4">Timestamp</th>
                  <th className="pb-3 px-4">Page Route</th>
                  <th className="pb-3 px-4">User Status</th>
                  <th className="pb-3 px-4">Device</th>
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
                          {visit.path}
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
                        <td className="py-2.5 px-4 capitalize text-zinc-300">
                          {visit.device}
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
        </div>

        {/* REGISTERED USERS DIRECTORY */}
        <div className="bg-zinc-900/70 border border-zinc-800/90 rounded-2xl p-6 backdrop-blur-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span>User Directory</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {filteredUsers.length} shown
                </span>
              </h3>
              <p className="text-xs text-zinc-400">Actual registered users (owner excluded)</p>
            </div>

            {/* Search & Tabs Filter */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search user, email, odisId..."
                  className="h-9 bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 text-xs text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-amber-500/50 w-52 sm:w-64"
                />
              </div>

              <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-1 text-xs">
                <button
                  onClick={() => setUserFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    userFilter === 'all' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setUserFilter('pro')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    userFilter === 'pro' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400'
                  }`}
                >
                  Pro
                </button>
                <button
                  onClick={() => setUserFilter('free')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    userFilter === 'free' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400'
                  }`}
                >
                  Free
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
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
                        {u.odisId}
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
        </div>
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
