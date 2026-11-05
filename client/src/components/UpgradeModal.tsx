import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Check, Sparkles, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/context/AuthContext';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const benefits = [
  { label: 'Astrology Birth Chart', description: 'Interactive natal wheel, aspect chords & soul blueprint' },
  { label: 'Compatibility Analysis', description: 'Relationship dynamics & matching' },
  { label: 'Cues Database', description: '22,000+ comprehensive numerology cues' },
  { label: 'Explore Modules', description: 'All advanced numerology calculators' },
  { label: 'CoreChats AI', description: '24/7 personalized AI guidance & readings' },
  { label: 'All Courses', description: 'Complete esoteric learning library' },
  { label: 'Core & Name Numbers', description: 'Full life path & destiny interpretations' },
  { label: 'Daily Energy Readings', description: 'Personalized daily frequencies' },
];

export function UpgradeModal({ open, onOpenChange }: UpgradeModalProps) {
  const router = useRouter();
  const { dbUser } = useAuth();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (open) {
      router.prefetch('/checkout');
    } else {
      setIsNavigating(false);
    }
  }, [open, router]);

  const handleProceedToCheckout = () => {
    if (isNavigating) return;
    setIsNavigating(true);

    if (dbUser) {
      apiRequest('POST', '/api/notify-upgrade-click', {
        userId: dbUser.firebaseUid,
        username: dbUser.fullName,
        odisId: dbUser.odisId,
        fullName: dbUser.fullName,
        email: dbUser.email,
      }).catch((err) => {
        console.error('Failed to send notification email:', err);
      });
    }

    // Smooth transition: give brief tactile feedback before navigating to prefetched checkout
    setTimeout(() => {
      router.push('/checkout').finally(() => {
        onOpenChange(false);
      });
    }, 450);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="w-[95vw] sm:max-w-lg p-0 rounded-2xl border-amber-500/30 bg-zinc-950 overflow-hidden max-h-[92vh]" 
        data-testid="modal-upgrade"
      >
        <div className="p-6 sm:p-8 flex flex-col bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 max-h-[92vh] overflow-y-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-zinc-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center border border-amber-500/30 flex-shrink-0">
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-100">GG33 Pro</h2>
              </div>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 block text-center">
                PRO
              </span>
            </div>
          </div>

          {/* Feature Bullet Points */}
          <div className="space-y-3">
            <p className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider">What's Included:</p>
            <div className="space-y-3">
              {benefits.map((benefit) => (
                <div key={benefit.label} className="flex items-start gap-3 text-xs">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-zinc-200">{benefit.label}</span>
                    <span className="text-zinc-400 text-[11px] block">{benefit.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button & Guarantees */}
          <div className="space-y-4 pt-2">
            <Button
              onClick={handleProceedToCheckout}
              disabled={isNavigating}
              className="w-full h-14 sm:h-16 py-4 px-6 text-base sm:text-lg font-black tracking-wide bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:via-amber-400 hover:to-amber-500 text-zinc-950 shadow-[0_4px_25px_rgba(245,158,11,0.35)] hover:shadow-[0_6px_30px_rgba(245,158,11,0.5)] rounded-2xl flex items-center justify-center gap-3 transition-all duration-200 transform hover:-translate-y-0.5 active:scale-[0.96] border-none cursor-pointer disabled:opacity-90"
            >
              {isNavigating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-zinc-950" />
                  <span>Opening Checkout...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-zinc-950 fill-zinc-950/20" />
                  <span>Start 3-Day Free Trial</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </Button>

            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-center gap-2 text-xs text-zinc-400 flex-wrap text-center">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>30-Day Money-Back Guarantee</span>
              </div>
              <span className="text-zinc-600">•</span>
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
