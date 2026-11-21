import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Navigation } from '@/components/Navigation';
import { StarField } from '@/components/StarField';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { UpgradeModal } from '@/components/UpgradeModal';
import { ManageSubscriptionModal } from '@/components/ManageSubscriptionModal';
import { ShareModal } from '@/components/ShareModal';
import {
  Crown,
  Database,
  BookOpen,
  HeartHandshake,
  Compass,
  Share2,
  ShieldCheck,
  FileText,
  Trash2,
  LogOut,
  ChevronRight,
  Star,
  Sparkles,
  User,
  ExternalLink,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface MembershipInfo {
  hasMembership: boolean;
  membershipId: string | null;
  status: string | null;
}

export default function MorePage() {
  const [, setLocation] = useLocation();
  const { user, dbUser, logout } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { data: membership } = useQuery<MembershipInfo>({
    queryKey: ['/api/membership'],
    staleTime: 0,
    enabled: !!dbUser,
  });

  const isPro = dbUser?.isPro ?? membership?.hasMembership ?? false;
  const userEmail = (user?.email || dbUser?.email || '').trim().toLowerCase();
  const isAdmin = userEmail === 'princederder44@gmail.com' || (dbUser as any)?.role === 'admin';

  return (
    <>
      <StarField />
      <Navigation />

      <main className="pt-20 pb-28 lg:pb-16 px-4 min-h-screen" data-testid="page-more">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* User Profile Summary Card */}
          <Card variant="frosted" className="p-5 sm:p-6 border border-white/[0.08] rounded-3xl relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-zinc-800 to-amber-500/10 border-2 border-amber-400/40 flex items-center justify-center text-amber-300 font-black text-2xl shadow-lg shadow-amber-500/10">
                  {dbUser?.fullName ? dbUser.fullName.charAt(0).toUpperCase() : <User className="w-7 h-7 text-amber-400" />}
                </div>
                {isPro && (
                  <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 p-1 rounded-full shadow-md">
                    <Crown className="w-3 h-3" />
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg sm:text-xl font-bold text-white truncate">
                    {dbUser?.fullName || user?.email?.split('@')[0] || 'Cosmic Traveler'}
                  </h1>
                  {isPro ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 border border-amber-500/30 text-amber-300">
                      PRO
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-800 border border-white/10 text-zinc-400">
                      Free
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 truncate mt-0.5">{user?.email}</p>
                {dbUser?.odisId && (
                  <p className="text-[11px] text-zinc-500 font-mono mt-1">ID: {dbUser.odisId.slice(0, 14)}...</p>
                )}
              </div>
            </div>

            {/* Subscription Banner Inside Profile */}
            <div className="mt-5 pt-4 border-t border-white/[0.08]">
              {isPro ? (
                <button
                  type="button"
                  onClick={() => setShowManageModal(true)}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 hover:bg-amber-500/15 transition-all text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <Crown className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-amber-300">GG33 Pro Active</p>
                      <p className="text-[11px] text-zinc-400">Manage billing, card & membership</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-400 group-hover:translate-x-0.5 transition-transform">
                    Manage
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(true)}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-600/15 to-amber-500/20 border border-amber-500/30 hover:border-amber-400/50 transition-all text-left cursor-pointer group shadow-lg shadow-amber-500/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Zap className="w-4 h-4 fill-current" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-white">Unlock GG33 Pro</p>
                      <p className="text-[11px] text-amber-200/80">Get CoreChats AI, Cues Database & all 20+ features</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs shadow-md">
                    Upgrade
                  </span>
                </button>
              )}
            </div>
          </Card>

          {/* Cosmic Portals & Database Section */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1">Cosmic Portals & Tools</h2>
            <div className="rounded-3xl bg-zinc-900/40 border border-white/[0.08] overflow-hidden divide-y divide-white/[0.06]">
              <Link
                href="/cues"
                className="flex items-center justify-between p-4 hover:bg-white/[0.04] transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform flex-shrink-0">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-amber-200 transition-colors">Cues Database</p>
                    <p className="text-xs text-zinc-400">Search 1000+ brands, celebrities, dates & numerology patterns</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/learn"
                className="flex items-center justify-between p-4 hover:bg-white/[0.04] transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform flex-shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-indigo-200 transition-colors">Study Zone</p>
                    <p className="text-xs text-zinc-400">Learn esoteric numerology, lessons, and masterclasses</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/compatibility"
                className="flex items-center justify-between p-4 hover:bg-white/[0.04] transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform flex-shrink-0">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-rose-200 transition-colors">Compatibility Matrix</p>
                    <p className="text-xs text-zinc-400">Check cosmic chemistry, relationship dynamics & life path synergy</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/birth-chart"
                className="flex items-center justify-between p-4 hover:bg-white/[0.04] transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-105 transition-transform flex-shrink-0">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-teal-200 transition-colors">Birth Chart</p>
                    <p className="text-xs text-zinc-400">Astrological houses, planetary aspects & Chinese zodiac alignment</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </div>

          {/* Social & Admin Section */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1">Community & Preferences</h2>
            <div className="rounded-3xl bg-zinc-900/40 border border-white/[0.08] overflow-hidden divide-y divide-white/[0.06]">
              <button
                type="button"
                onClick={() => setShowShareModal(true)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/[0.04] transition-colors group text-left cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform flex-shrink-0">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-amber-200 transition-colors">Share GG33 CORE</p>
                    <p className="text-xs text-zinc-400">Invite friends and compare energy profiles</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </button>

              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center justify-between p-4 hover:bg-white/[0.04] transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform flex-shrink-0">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-purple-200 transition-colors">Admin Dashboard</p>
                      <p className="text-xs text-zinc-400">User management, broadcast notifications & metrics</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                </Link>
              )}

              <Link
                href="/privacy"
                className="flex items-center justify-between p-4 hover:bg-white/[0.04] transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-zinc-800/80 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:scale-105 transition-transform flex-shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-zinc-200 transition-colors">Privacy Policy</p>
                    <p className="text-xs text-zinc-400">How your personal data and birthday details are protected</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/terms"
                className="flex items-center justify-between p-4 hover:bg-white/[0.04] transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-zinc-800/80 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:scale-105 transition-transform flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-zinc-200 transition-colors">Terms of Service</p>
                    <p className="text-xs text-zinc-400">Subscription conditions and community usage rules</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </div>

          {/* Account Actions (Delete & Log Out) */}
          <div className="pt-2 space-y-3">
            <Link
              href="/delete-account"
              className="flex items-center justify-center gap-2 py-2.5 text-xs text-zinc-500 hover:text-red-400 transition-colors text-center"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Account & Data</span>
            </Link>

            <Button
              variant="outline"
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full h-12 rounded-2xl border-white/10 hover:border-red-500/30 bg-white/[0.03] hover:bg-red-500/10 text-zinc-300 hover:text-red-400 font-bold text-sm gap-2 transition-all cursor-pointer"
              data-testid="button-more-logout"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </Button>
          </div>
        </div>
      </main>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent className="w-[85vw] max-w-xs p-5 rounded-3xl border border-white/10 bg-zinc-950/95 backdrop-blur-2xl text-zinc-100 text-center flex flex-col items-center">
          <div className="w-11 h-11 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-2">
            <LogOut className="w-5 h-5" />
          </div>
          <AlertDialogHeader className="space-y-1 text-center sm:text-center">
            <AlertDialogTitle className="text-base font-bold text-zinc-100">
              Log Out?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-zinc-400">
              Are you sure you want to log out of GG33 CORE?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex flex-row items-center justify-center gap-2.5 w-full">
            <AlertDialogCancel className="flex-1 border-white/10 text-xs h-10 rounded-xl text-zinc-300 hover:bg-zinc-900 mt-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold text-xs h-10 rounded-xl transition-colors shadow-md shadow-red-600/20"
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
