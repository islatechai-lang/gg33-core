import { useState, useRef, useEffect } from 'react';
import { NavLink } from '@/components/NavLink';
import { Button } from '@/components/ui/button';
import { UpgradeModal } from '@/components/UpgradeModal';
import { ManageSubscriptionModal } from '@/components/ManageSubscriptionModal';
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
  LayoutDashboard,
  Users,
  Database,
  MessageCircle,
  BookOpen,
  Sparkles,
  Menu,
  X,
  Crown,
  LogOut
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MembershipInfo {
  hasMembership: boolean;
  membershipId: string | null;
  status: string | null;
  manageUrl: string | null;
}

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/compatibility', label: 'Compatibility', icon: Users },
  { to: '/cues', label: 'Cues Database', icon: Database },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/cuechats', label: 'CueChats', icon: MessageCircle },
  { to: '/learn', label: 'Study Zone', icon: BookOpen },
  { to: '/birth-chart', label: 'Birth Chart', icon: Sparkles },
];

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { logout, user, dbUser } = useAuth();
  const navRef = useRef<HTMLElement>(null);

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
    setMobileOpen(false);
  };

  // Close mobile dropdown when clicking outside the nav component
  useEffect(() => {
    if (!mobileOpen) return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Backdrop overlay to dismiss dropdown when clicking outside on mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 glass" data-testid="navigation">
        <div className="w-full px-4">
          <div className="flex items-center justify-between h-14 gap-4">
            {/* Logo Section - properly aligned */}
            <NavLink to="/" className="flex items-center gap-2.5 group flex-shrink-0" data-testid="link-logo">
              <div className="w-9 h-9 rounded-lg overflow-hidden shadow-md group-hover:shadow-glow transition-shadow">
                <img src="/images/logo.png?v=1" alt="GG33" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <span className="text-3 font-semibold gradient-text leading-none">GG33 CORE</span>
              </div>
            </NavLink>

            {/* Navigation Links */}
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
                  <div className="flex items-center gap-1">
                    {item.label}
                    {(item.to === '/explore' || item.to === '/birth-chart') && (
                      <Badge className="bg-red-9 text-white border-none px-1 py-0 h-3.5 text-[8px] font-black uppercase tracking-tighter shadow-sm shadow-red-9/20">
                        Hot
                      </Badge>
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
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs h-8 px-3.5 rounded-lg shadow-sm shadow-amber-500/20"
                  data-testid="button-upgrade"
                >
                  Upgrade to Pro
                </Button>
              )}

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

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden"
                data-testid="button-mobile-menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div className="lg:hidden py-4 border-t border-gray-5/50 animate-fade-in">
              <div className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className="px-4 py-3 rounded-md text-gray-11 hover:text-gray-12 hover:bg-gray-a3 transition-colors flex items-center gap-3"
                    activeClassName="text-amber-11 bg-amber-a3"
                    onClick={() => setMobileOpen(false)}
                    data-testid={`mobile-link-${item.label.toLowerCase().replace(/\s/g, '-')}`}
                  >
                    <item.icon className="w-5 h-5" />
                    <div className="flex items-center gap-2">
                      <span>{item.label}</span>
                      {(item.to === '/explore' || item.to === '/birth-chart') && (
                        <Badge className="bg-red-9 text-white border-none px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter">
                          Hot
                        </Badge>
                      )}
                    </div>
                  </NavLink>
                ))}

                {isPro ? (
                  <div className="flex items-center justify-between mt-3 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-amber-300">Pro Member</span>
                    </div>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        setShowManageModal(true);
                      }}
                      className="text-[11px] font-medium text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors cursor-pointer"
                    >
                      Manage subscription
                    </button>
                  </div>
                ) : (
                  <Button
                    onClick={handleUpgradeClick}
                    className="mt-3 w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs h-10 rounded-xl shadow-md shadow-amber-500/20"
                    data-testid="button-mobile-upgrade"
                  >
                    Upgrade to Pro
                  </Button>
                )}

                {/* Mobile User Info & Right-Side Logout Button */}
                {user && (
                  <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between px-3 py-1">
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="text-xs font-bold text-zinc-200 truncate">
                        {dbUser?.fullName || user.displayName || user.email || 'Logged In'}
                      </span>
                      <span className="text-[10px] text-zinc-500 truncate">
                        {user.email || 'GG33 Member'}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-zinc-400 hover:text-red-400 hover:bg-red-500/10 flex items-center gap-1.5 px-3 py-1.5 h-8 rounded-xl transition-colors flex-shrink-0 cursor-pointer ml-auto"
                      onClick={() => {
                        setMobileOpen(false);
                        setShowLogoutConfirm(true);
                      }}
                      data-testid="button-mobile-logout"
                    >
                      <span className="text-xs font-semibold">Logout</span>
                      <LogOut className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

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
    </>
  );
}
