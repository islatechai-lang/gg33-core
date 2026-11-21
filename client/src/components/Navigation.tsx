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
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import {
  Compass,
  Home,
  Users,
  Database,
  MessageCircle,
  BookOpen,
  Sparkles,
  Crown,
  LogOut,
  Share2,
  User,
  LayoutGrid,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MembershipInfo {
  hasMembership: boolean;
  membershipId: string | null;
  status: string | null;
  manageUrl: string | null;
}

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/cuechats', label: 'CoreChats', icon: MessageCircle },
  { to: '/birth-chart', label: 'Birth Chart', icon: Sparkles },
  { to: '/compatibility', label: 'Compatibility', icon: Users },
  { to: '/cues', label: 'Cues Database', icon: Database },
  { to: '/learn', label: 'Study Zone', icon: BookOpen },
];

export function Navigation() {
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
  };

  // Active state calculations for bottom nav
  const isDashboardActive = location === '/';
  const isExploreActive = location.startsWith('/explore');
  const isCoreChatsActive = location.startsWith('/corechat') || location.startsWith('/cuechat');
  const isBirthChartActive = location.startsWith('/birth-chart');
  const isMoreActive =
    location.startsWith('/more') ||
    location.startsWith('/compatibility') ||
    location.startsWith('/cues') ||
    location.startsWith('/learn') ||
    location.startsWith('/course');

  return (
    <>
      {/* Top Header Navigation (Consistent and lightweight across all devices and pages) */}
      <nav
        className="fixed top-0 left-0 right-0 z-40 bg-zinc-950/85 backdrop-blur-md border-b border-white/[0.08] shadow-sm"
        data-testid="navigation"
      >
        <div className="w-full px-3.5 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-15 gap-3">
            {/* Logo Section */}
            <NavLink to="/" className="flex items-center gap-2.5 group flex-shrink-0" data-testid="link-logo">
              <div className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl overflow-hidden shadow-sm ring-1 ring-white/10 group-hover:ring-amber-400/40 transition-all duration-200">
                <img src="/images/logo.png?v=1" alt="GG33" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <span className="text-sm sm:text-base font-extrabold gradient-text leading-none tracking-tight">GG33 CORE</span>
              </div>
            </NavLink>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all flex items-center gap-2 whitespace-nowrap active:scale-95"
                  activeClassName="text-amber-300 bg-amber-500/15 border border-amber-500/25 font-bold"
                  data-testid={`link-${item.label.toLowerCase().replace(/\s/g, '-')}`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {isPro ? (
                <button
                  onClick={() => setShowManageModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-300 font-extrabold text-[11px] sm:text-xs transition-all active:scale-95 cursor-pointer shadow-sm"
                  title="Manage Subscription"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>PRO</span>
                </button>
              ) : (
                <Button
                  onClick={handleUpgradeClick}
                  className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-black text-[11px] sm:text-xs h-8 px-3 sm:px-4 rounded-full shadow-md active:scale-95 transition-all cursor-pointer"
                  data-testid="button-upgrade"
                >
                  Upgrade
                </Button>
              )}

              {/* Share Button */}
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center justify-center w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-400 hover:text-amber-400 transition-all active:scale-90 cursor-pointer"
                title="Share GG33 CORE"
                aria-label="Share GG33 CORE"
                data-testid="button-header-share"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* Mobile Profile Icon (Navigates to /more) */}
              <Link
                href="/more"
                className="lg:hidden flex items-center justify-center w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-400 hover:text-amber-300 transition-all active:scale-90"
                title="Profile & More"
              >
                <User className="w-4 h-4" />
              </Link>

              {/* Desktop Logout Button */}
              {user && (
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="hidden lg:flex items-center justify-center w-8.5 h-8.5 rounded-xl bg-white/[0.04] hover:bg-rose-500/15 border border-white/10 hover:border-rose-500/30 text-zinc-400 hover:text-rose-400 transition-all active:scale-90 cursor-pointer"
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

      {/* Modern 5-Item Bottom Navigation Dock (Mobile & Tablet) */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/85 backdrop-blur-md border-t border-white/[0.08] shadow-[0_-8px_30px_rgba(0,0,0,0.6)] pb-[env(safe-area-inset-bottom,0px)]"
        data-testid="bottom-navigation"
      >
        <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1 items-center">
          {/* 1. Home */}
          <Link
            href="/"
            className={cn(
              "flex flex-col items-center justify-center py-1 gap-1 transition-all relative group",
              isDashboardActive ? "text-amber-400" : "text-zinc-400 hover:text-zinc-200"
            )}
            data-testid="bottom-link-home"
          >
            <Home className={cn("w-5 h-5 transition-transform group-active:scale-90", isDashboardActive && "stroke-[2.4px]")} />
            <span className={cn("text-[10px] tracking-tight", isDashboardActive ? "font-bold text-amber-300" : "font-medium")}>
              Home
            </span>
            {isDashboardActive && (
              <span className="w-1 h-1 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B] absolute bottom-0.5" />
            )}
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
            <Compass className={cn("w-5 h-5 transition-transform group-active:scale-90", isExploreActive && "stroke-[2.4px]")} />
            <span className={cn("text-[10px] tracking-tight", isExploreActive ? "font-bold text-amber-300" : "font-medium")}>
              Explore
            </span>
            {isExploreActive && (
              <span className="w-1 h-1 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B] absolute bottom-0.5" />
            )}
          </Link>

          {/* 3. CoreChats (Center Elevated Action Dock Tab) */}
          <Link
            href="/cuechats"
            className="flex flex-col items-center justify-center -mt-4 group relative"
            data-testid="bottom-link-corechats"
          >
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl border",
              isCoreChatsActive
                ? "bg-gradient-to-tr from-amber-500 to-amber-400 text-zinc-950 border-amber-300 shadow-amber-500/30 scale-105"
                : "bg-zinc-900 border-white/10 text-amber-400 hover:border-amber-400/40 shadow-black/60 group-active:scale-95"
            )}>
              <Sparkles className={cn("w-6 h-6", isCoreChatsActive ? "fill-current" : "")} />
            </div>
            <span className={cn("text-[10px] mt-1 tracking-tight font-semibold", isCoreChatsActive ? "text-amber-300 font-bold" : "text-zinc-400")}>
              CoreChats
            </span>
          </Link>

          {/* 4. Birth Chart */}
          <Link
            href="/birth-chart"
            className={cn(
              "flex flex-col items-center justify-center py-1 gap-1 transition-all relative group",
              isBirthChartActive ? "text-amber-400" : "text-zinc-400 hover:text-zinc-200"
            )}
            data-testid="bottom-link-birthchart"
          >
            <Users className={cn("w-5 h-5 transition-transform group-active:scale-90", isBirthChartActive && "stroke-[2.4px]")} />
            <span className={cn("text-[10px] tracking-tight", isBirthChartActive ? "font-bold text-amber-300" : "font-medium")}>
              Chart
            </span>
            {isBirthChartActive && (
              <span className="w-1 h-1 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B] absolute bottom-0.5" />
            )}
          </Link>

          {/* 5. More (Directly links to /more page - No Modal!) */}
          <Link
            href="/more"
            className={cn(
              "flex flex-col items-center justify-center py-1 gap-1 transition-all relative group cursor-pointer",
              isMoreActive ? "text-amber-400" : "text-zinc-400 hover:text-zinc-200"
            )}
            data-testid="bottom-link-more"
          >
            <LayoutGrid className={cn("w-5 h-5 transition-transform group-active:scale-90", isMoreActive && "stroke-[2.3px]")} />
            <span className={cn("text-[10px] tracking-tight", isMoreActive ? "font-bold text-amber-300" : "font-medium")}>
              More
            </span>
            {isMoreActive && (
              <span className="w-1 h-1 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B] absolute bottom-0.5" />
            )}
          </Link>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent className="w-[85vw] max-w-xs p-5 rounded-2xl border border-white/10 bg-zinc-950 text-zinc-100 text-center flex flex-col items-center">
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
            <AlertDialogCancel className="flex-1 border-white/10 text-xs h-9 rounded-xl text-zinc-300 hover:bg-zinc-900 mt-0">
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
