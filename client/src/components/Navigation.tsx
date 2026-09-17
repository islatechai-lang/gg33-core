import { useState } from 'react';
import { NavLink } from '@/components/NavLink';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { UpgradeModal } from '@/components/UpgradeModal';
import { ManageSubscriptionModal } from '@/components/ManageSubscriptionModal';
import { ShareModal } from '@/components/ShareModal';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import {
  Compass,
  LayoutDashboard,
  Users,
  Database,
  MessageCircle,
  BookOpen,
  Sparkles,
  Menu,
  X,
  Crown,
  LogOut,
  Share2,
  ChevronRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MembershipInfo {
  hasMembership: boolean;
  membershipId: string | null;
  status: string | null;
  manageUrl: string | null;
}

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/cuechats', label: 'CoreChats', icon: MessageCircle },
  { to: '/birth-chart', label: 'Birth Chart', icon: Sparkles },
  { to: '/compatibility', label: 'Compatibility', icon: Users },
  { to: '/cues', label: 'Cues Database', icon: Database },
  { to: '/learn', label: 'Study Zone', icon: BookOpen },
];

export function Navigation() {
  const [moreOpen, setMoreOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const { logout, user, dbUser } = useAuth();
  const [location] = useLocation();

  const { data: membership } = useQuery<MembershipInfo>({
    queryKey: ['/api/membership'],
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    enabled: !!user,
  });

  const isPro = dbUser?.isPro ?? membership?.hasMembership ?? false;

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
    setMoreOpen(false);
  };

  // Active state calculations for bottom nav
  const isDashboardActive = location === '/';
  const isExploreActive = location.startsWith('/explore');
  const isCoreChatsActive = location.startsWith('/corechat') || location.startsWith('/cuechat');
  const isBirthChartActive = location.startsWith('/birth-chart');
  const isMoreActive =
    moreOpen ||
    location.startsWith('/compatibility') ||
    location.startsWith('/cues') ||
    location.startsWith('/learn') ||
    location.startsWith('/course');

  return (
    <>
      {/* Top Header Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass" data-testid="navigation">
        <div className="w-full px-4">
          <div className="flex items-center justify-between h-14 gap-4">
            {/* Logo Section */}
            <NavLink to="/" className="flex items-center gap-2.5 group flex-shrink-0" data-testid="link-logo">
              <div className="w-9 h-9 rounded-lg overflow-hidden shadow-md group-hover:shadow-glow transition-shadow">
                <img src="/images/logo.png?v=1" alt="GG33" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <span className="text-3 font-semibold gradient-text leading-none">GG33 CORE</span>
              </div>
            </NavLink>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="px-3 py-2 rounded-md text-2 text-gray-11 hover:text-gray-12 hover:bg-gray-a3 transition-colors flex items-center gap-2 whitespace-nowrap"
                  activeClassName="text-amber-11 bg-amber-a3"
                  data-testid={`link-${item.label.toLowerCase().replace(/\s/g, '-')}`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <div className="flex items-center gap-1.5">
                    {item.label}
                    {item.to === '/explore' && (
                      <span className="px-1.5 py-[1px] rounded-full bg-gradient-to-r from-red-500 to-rose-600 text-white text-[8px] font-black uppercase tracking-wider leading-none shadow-xs shadow-red-500/40">
                        Hot
                      </span>
                    )}
                    {item.to === '/birth-chart' && (
                      <span className="px-1.5 py-[1px] rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[8px] font-black uppercase tracking-wider leading-none shadow-xs shadow-emerald-500/40">
                        New
                      </span>
                    )}
                  </div>
                </NavLink>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {isPro ? (
                <button
                  onClick={() => setShowManageModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-extrabold text-xs transition-colors cursor-pointer"
                  title="Manage Subscription"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>PRO</span>
                </button>
              ) : (
                <Button
                  onClick={handleUpgradeClick}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs h-8 px-3.5 rounded-lg shadow-sm shadow-amber-500/20 cursor-pointer"
                  data-testid="button-upgrade"
                >
                  Upgrade to Pro
                </Button>
              )}

              {/* Share Button (Desktop & Mobile) */}
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
                title="Share GG33 CORE"
                aria-label="Share GG33 CORE"
                data-testid="button-header-share"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* Desktop Logout Button */}
              {user && (
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Log Out"
                  aria-label="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Modern 5-Item Bottom Navigation Bar (Mobile & Tablet) */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800/80 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] pb-[env(safe-area-inset-bottom,0px)]"
        data-testid="bottom-navigation"
      >
        <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1 items-center">
          {/* 1. Dashboard */}
          <Link
            href="/"
            className={cn(
              "flex flex-col items-center justify-center py-1 gap-1 transition-all relative group",
              isDashboardActive ? "text-amber-400" : "text-zinc-400 hover:text-zinc-200"
            )}
            data-testid="bottom-link-dashboard"
          >
            <LayoutDashboard className={cn("w-5 h-5 transition-transform group-active:scale-90", isDashboardActive && "stroke-[2.3px]")} />
            <span className={cn("text-[10px] tracking-tight", isDashboardActive ? "font-bold text-amber-300" : "font-medium")}>
              Dashboard
            </span>
          </Link>

          {/* 2. Explore */}
          <Link
            href="/explore"
            className={cn(
              "flex flex-col items-center justify-center py-1 gap-1 transition-all relative group",
              isExploreActive ? "text-amber-400" : "text-zinc-400 hover:text-zinc-200"
            )}
            data-testid="bottom-link-explore"
          >
            <div className="relative">
              <Compass className={cn("w-5 h-5 transition-transform group-active:scale-90", isExploreActive && "stroke-[2.3px]")} />
              <span className="absolute -top-1 left-full ml-0.5 px-1 py-[1px] rounded-full bg-rose-500 text-[7px] font-black text-white uppercase tracking-wider leading-none shadow-xs ring-1 ring-zinc-950 pointer-events-none">
                HOT
              </span>
            </div>
            <span className={cn("text-[10px] tracking-tight", isExploreActive ? "font-bold text-amber-300" : "font-medium")}>
              Explore
            </span>
          </Link>

          {/* 3. CoreChats (Center Hero Tab) */}
          <Link
            href="/cuechats"
            className={cn(
              "flex flex-col items-center justify-center py-1 gap-1 transition-all relative group",
              isCoreChatsActive ? "text-amber-400" : "text-zinc-400 hover:text-zinc-200"
            )}
            data-testid="bottom-link-corechats"
          >
            <div className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center transition-all",
              isCoreChatsActive
                ? "bg-amber-500/20 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                : "text-zinc-400 group-hover:text-zinc-200"
            )}>
              <MessageCircle className={cn("w-5 h-5 transition-transform group-active:scale-90", isCoreChatsActive && "stroke-[2.3px]")} />
            </div>
            <span className={cn("text-[10px] tracking-tight", isCoreChatsActive ? "font-bold text-amber-300" : "font-medium")}>
              CoreChats
            </span>
          </Link>

          {/* 4. BirthChart */}
          <Link
            href="/birth-chart"
            className={cn(
              "flex flex-col items-center justify-center py-1 gap-1 transition-all relative group",
              isBirthChartActive ? "text-amber-400" : "text-zinc-400 hover:text-zinc-200"
            )}
            data-testid="bottom-link-birthchart"
          >
            <div className="relative">
              <Sparkles className={cn("w-5 h-5 transition-transform group-active:scale-90", isBirthChartActive && "stroke-[2.3px]")} />
              <span className="absolute -top-1 left-full ml-0.5 px-1 py-[1px] rounded-full bg-emerald-500 text-[7px] font-black text-white uppercase tracking-wider leading-none shadow-xs ring-1 ring-zinc-950 pointer-events-none">
                NEW
              </span>
            </div>
            <span className={cn("text-[10px] tracking-tight", isBirthChartActive ? "font-bold text-amber-300" : "font-medium")}>
              BirthChart
            </span>
          </Link>

          {/* 5. More */}
          <button
            onClick={() => setMoreOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center py-1 gap-1 transition-all relative group cursor-pointer",
              isMoreActive ? "text-amber-400" : "text-zinc-400 hover:text-zinc-200"
            )}
            data-testid="bottom-link-more"
          >
            <Menu className={cn("w-5 h-5 transition-transform group-active:scale-90", isMoreActive && "stroke-[2.3px]")} />
            <span className={cn("text-[10px] tracking-tight", isMoreActive ? "font-bold text-amber-300" : "font-medium")}>
              More
            </span>
          </button>
        </div>
      </div>

      {/* Modern Slide-Up "More" Bottom Sheet */}
      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl bg-zinc-950/95 backdrop-blur-2xl border-t border-zinc-800 p-0 max-h-[88vh] overflow-y-auto z-50"
        >
          {/* Drag Handle Indicator */}
          <div className="pt-3 pb-1 flex justify-center">
            <div className="w-12 h-1.5 rounded-full bg-zinc-700/60" />
          </div>

          <div className="px-5 pb-8 pt-2 space-y-4">
            <SheetHeader className="text-left space-y-1 pr-8">
              <SheetTitle className="text-base font-bold text-zinc-100">
                More Features
              </SheetTitle>
              <SheetDescription className="text-xs text-zinc-400">
                Explore esoteric tools, master database, and account options
              </SheetDescription>
            </SheetHeader>

            {/* User Profile / Status Summary */}
            {user && (
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 text-amber-400 font-bold text-sm">
                    {(dbUser?.fullName || user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-zinc-100 truncate">
                      {dbUser?.fullName || user.displayName || 'Member'}
                    </span>
                    <span className="text-xs text-zinc-400 truncate">
                      {user.email}
                    </span>
                  </div>
                </div>
                {isPro ? (
                  <Badge className="bg-amber-500/15 border border-amber-500/30 text-amber-400 font-extrabold text-[10px] px-2.5 py-1 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-400" />
                    PRO
                  </Badge>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => {
                      setMoreOpen(false);
                      setShowUpgradeModal(true);
                    }}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs h-7 px-3 rounded-lg shadow-sm cursor-pointer"
                  >
                    Upgrade
                  </Button>
                )}
              </div>
            )}

            {/* Primary Features List */}
            <div className="space-y-2">
              {/* Compatibility */}
              <Link
                href="/compatibility"
                onClick={() => setMoreOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/80 hover:border-amber-500/30 transition-all group cursor-pointer"
                data-testid="more-link-compatibility"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-105 transition-transform flex-shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-zinc-100 group-hover:text-amber-300 transition-colors">
                      Compatibility
                    </span>
                    <span className="text-xs text-zinc-400">
                      Match numbers & astrology chemistry
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 transition-colors" />
              </Link>

              {/* Cues Database */}
              <Link
                href="/cues"
                onClick={() => setMoreOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/80 hover:border-amber-500/30 transition-all group cursor-pointer"
                data-testid="more-link-cues"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform flex-shrink-0">
                    <Database className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-zinc-100 group-hover:text-amber-300 transition-colors">
                      Cues Database
                    </span>
                    <span className="text-xs text-zinc-400">
                      Searchable master vibration index
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 transition-colors" />
              </Link>

              {/* Study Zone */}
              <Link
                href="/learn"
                onClick={() => setMoreOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/80 hover:border-amber-500/30 transition-all group cursor-pointer"
                data-testid="more-link-learn"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform flex-shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-zinc-100 group-hover:text-amber-300 transition-colors">
                      Study Zone
                    </span>
                    <span className="text-xs text-zinc-400">
                      In-depth courses & masterclasses
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 transition-colors" />
              </Link>

              {/* Share App */}
              <button
                onClick={() => {
                  setMoreOpen(false);
                  setShowShareModal(true);
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/80 hover:border-amber-500/30 transition-all group text-left cursor-pointer"
                data-testid="more-link-share"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform flex-shrink-0">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-zinc-100 group-hover:text-amber-300 transition-colors">
                      Share GG33 CORE
                    </span>
                    <span className="text-xs text-zinc-400">
                      Invite friends and share your results
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 transition-colors" />
              </button>
            </div>

            {/* Subscription Card */}
            {isPro ? (
              <button
                onClick={() => {
                  setMoreOpen(false);
                  setShowManageModal(true);
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <Crown className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-amber-300">Pro Membership Active</span>
                    <span className="text-[11px] text-amber-400/80">Manage your subscription & billing</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-400">Manage</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMoreOpen(false);
                  setShowUpgradeModal(true);
                }}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 hover:border-amber-500/50 transition-all cursor-pointer text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Crown className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-amber-300">Upgrade to Pro</span>
                    <span className="text-[11px] text-zinc-400">Unlock CoreChats AI, deep charts & all tools</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 px-3 py-1 rounded-lg">
                  Upgrade
                </span>
              </button>
            )}

            {/* Logout Option */}
            {user && (
              <Button
                variant="ghost"
                onClick={() => {
                  setMoreOpen(false);
                  setShowLogoutConfirm(true);
                }}
                className="w-full h-11 rounded-2xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-zinc-800/80 flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer"
                data-testid="more-button-logout"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Compact Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent className="w-[85vw] max-w-xs p-5 rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-100 text-center flex flex-col items-center">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-1">
            <LogOut className="w-5 h-5" />
          </div>
          <AlertDialogHeader className="space-y-1 text-center sm:text-center">
            <AlertDialogTitle className="text-base font-bold text-zinc-100">
              Log Out?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-zinc-400">
              Are you sure you want to log out?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex flex-row items-center justify-center gap-2.5 w-full">
            <AlertDialogCancel className="flex-1 border-zinc-800 text-xs h-9 rounded-xl text-zinc-300 hover:bg-zinc-900 mt-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold text-xs h-9 rounded-xl transition-colors shadow-md shadow-red-600/20"
              onClick={async () => {
                setShowLogoutConfirm(false);
                await logout();
              }}
            >
              Log Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <UpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
      <ManageSubscriptionModal open={showManageModal} onOpenChange={setShowManageModal} />
      <ShareModal open={showShareModal} onOpenChange={setShowShareModal} />
    </>
  );
}
