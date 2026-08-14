import { useState } from 'react';
import { NavLink } from '@/components/NavLink';
import { Button } from '@/components/ui/button';
import { UpgradeModal } from '@/components/UpgradeModal';
import { ManageSubscriptionModal } from '@/components/ManageSubscriptionModal';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import {
  Compass,
  LayoutDashboard,
  Users,
  Database,
  MessageCircle,
  BookOpen,
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
];

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const { logout, user, dbUser } = useAuth();

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

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass" data-testid="navigation">
        <div className="w-full px-4">
          <div className="flex items-center justify-between h-14 gap-4">
            {/* Logo Section - properly aligned */}
            <NavLink to="/" className="flex items-center gap-2.5 group flex-shrink-0" data-testid="link-logo">
              <div className="w-9 h-9 rounded-lg overflow-hidden shadow-md group-hover:shadow-glow transition-shadow">
                <img src="/images/logo.png?v=1" alt="GG33" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <span className="text-3 font-semibold gradient-text leading-none">GG33</span>
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
                    {item.to === '/explore' && (
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
                      {item.to === '/explore' && (
                        <Badge className="bg-red-9 text-white border-none px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter">
                          Hot
                        </Badge>
                      )}
                    </div>
                  </NavLink>
                ))}
                {isPro ? (
                  <div className="flex items-center justify-between mt-4 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
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
                    className="mt-4 w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs h-10 rounded-xl shadow-md shadow-amber-500/20"
                    data-testid="button-mobile-upgrade"
                  >
                    Upgrade to Pro
                  </Button>
                )}
                {user && (
                  <Button
                    variant="ghost"
                    className="mt-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 w-full flex items-center justify-start gap-3 px-4 py-2.5 rounded-xl transition-colors"
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-xs font-semibold">Logout</span>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <UpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
      <ManageSubscriptionModal open={showManageModal} onOpenChange={setShowManageModal} />
    </>
  );
}
