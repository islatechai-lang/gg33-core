import { useState } from 'react';
import { NavLink } from '@/components/NavLink';
import { Button } from '@/components/ui/button';
import { UpgradeModal } from '@/components/UpgradeModal';
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
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-a3 border border-amber-9/30">
                  <Crown className="w-4 h-4 text-amber-9" />
                  <span className="text-2 font-medium text-amber-11">Pro</span>
                </div>
              ) : (
                <Button
                  variant="gold"
                  size="sm"
                  className="hidden sm:flex"
                  onClick={handleUpgradeClick}
                  data-testid="button-upgrade"
                >
                  Get Pro
                </Button>
              )}
              {user && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="text-gray-11 hover:text-red-9 hover:bg-red-9/10"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
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
                  <div className="flex items-center justify-center gap-2 mt-4 px-4 py-2.5 rounded-md bg-amber-a3 border border-amber-9/30">
                    <Crown className="w-5 h-5 text-amber-9" />
                    <span className="text-3 font-medium text-amber-11">Pro Member</span>
                  </div>
                ) : (
                  <Button
                    variant="gold"
                    className="mt-4"
                    onClick={handleUpgradeClick}
                    data-testid="button-mobile-upgrade"
                  >
                    Get Pro
                  </Button>
                )}
                {user && (
                  <Button
                    variant="ghost"
                    className="mt-2 text-gray-11 hover:text-red-9 hover:bg-red-9/10 w-full flex items-center justify-center gap-3"
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <UpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
    </>
  );
}
