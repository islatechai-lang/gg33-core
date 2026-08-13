import { useRouter } from 'next/router';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Check, Sparkles, Users, Database, Compass, MessageCircle, GraduationCap, Hash, Lock, Sun, ArrowRight, ShieldCheck } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/context/AuthContext';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const benefits = [
  { icon: Users, label: 'Compatibility Analysis', description: 'Discover relationship dynamics & matching' },
  { icon: Database, label: 'Cues Database', description: '22,000+ comprehensive numerology cues' },
  { icon: Compass, label: 'Explore Modules', description: 'Access all advanced numerology calculators' },
  { icon: MessageCircle, label: 'CueChats AI', description: '24/7 personalized AI guidance & readings' },
  { icon: GraduationCap, label: 'All Courses', description: 'Complete esoteric learning library' },
  { icon: Hash, label: 'Core & Name Numbers', description: 'Full interpretations for life path & destiny' },
  { icon: Sun, label: 'Daily Energy Readings', description: 'Personalized daily frequencies' },
];

export function UpgradeModal({ open, onOpenChange }: UpgradeModalProps) {
  const router = useRouter();
  const { dbUser } = useAuth();

  const handleProceedToCheckout = async () => {
    // Send email notification on click
    if (dbUser) {
      try {
        await apiRequest('POST', '/api/notify-upgrade-click', {
          userId: dbUser.firebaseUid,
          username: dbUser.fullName,
          odisId: dbUser.odisId,
          fullName: dbUser.fullName,
          email: dbUser.email,
        });
      } catch (err) {
        console.error('Failed to send notification email:', err);
      }
    }

    onOpenChange(false);
    router.push('/checkout');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="w-[95vw] sm:max-w-2xl lg:max-w-3xl p-0 rounded-2xl border-amber-500/30 bg-zinc-950 overflow-hidden max-h-[92vh]" 
        data-testid="modal-upgrade"
      >
        <div className="p-6 sm:p-8 flex flex-col bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 max-h-[92vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-800/80">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <Crown className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest">GG33 Pro Access</span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Unlimited
            </span>
          </div>
          
          <div className="text-center sm:text-left mb-6">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 mb-2 tracking-tight">
              Unlock Full Numerology Intelligence
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Elevate your understanding with unlimited access to all AI tools, complete learning courses, and 22,000+ cues.
            </p>
          </div>
          
          {/* Benefits Grid */}
          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {benefits.map((benefit) => (
              <div 
                key={benefit.label}
                className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-500/30 transition-colors"
                data-testid={`benefit-${benefit.label.toLowerCase().replace(/\s/g, '-')}`}
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 border border-amber-500/20 mt-0.5">
                  <benefit.icon className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-zinc-200 leading-tight">{benefit.label}</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">{benefit.description}</p>
                </div>
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              </div>
            ))}
          </div>

          {/* High-converting Upgrade Button */}
          <div className="space-y-3 pt-2">
            <Button
              onClick={handleProceedToCheckout}
              className="w-full h-13 sm:h-14 text-sm sm:text-base font-extrabold bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-600 text-zinc-950 shadow-xl shadow-amber-500/20 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
            >
              <Sparkles className="w-5 h-5" />
              <span>Upgrade to GG33 Pro</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>

            <div className="flex items-center justify-between text-[11px] text-zinc-500 px-1 pt-1">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>30-Day Money Back Guarantee</span>
              </div>
              <div className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-zinc-400" />
                <span>Secure Whop Payment</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
