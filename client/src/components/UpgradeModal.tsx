import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Check, Sparkles, Users, Database, Compass, MessageCircle, GraduationCap, Hash, Lock, Loader2, Sun, ExternalLink, ShieldCheck } from 'lucide-react';
import { WhopCheckoutEmbed } from "@whop/checkout/react";
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
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
  const { toast } = useToast();
  const { dbUser } = useAuth();
  
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  // Initialize checkout configuration when modal opens
  useEffect(() => {
    if (open && dbUser) {
      const initCheckout = async () => {
        setLoadingCheckout(true);
        try {
          // Send notification email
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

          const res = await apiRequest('POST', '/api/checkout/create', { odisId: dbUser.odisId });
          const data = await res.json();
          if (data.id) {
            setSessionId(data.id);
            setCheckoutUrl(data.url);
          }
        } catch (error: any) {
          console.error('[Checkout] Error:', error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to initialize payment gateway. Please try again.',
          });
        } finally {
          setLoadingCheckout(false);
        }
      };

      initCheckout();
    } else {
      setSessionId(null);
      setCheckoutUrl(null);
    }
  }, [open, dbUser, toast]);

  const handleCheckoutRedirect = () => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="w-[95vw] sm:max-w-3xl lg:max-w-5xl p-0 rounded-2xl border-amber-500/30 bg-zinc-950 overflow-hidden max-h-[92vh]" 
        data-testid="modal-upgrade"
      >
        <div className="relative flex flex-col md:grid md:grid-cols-5 max-h-[92vh] overflow-y-auto">
          {/* Left panel: Benefits List */}
          <div className="md:col-span-2 p-5 sm:p-6 flex flex-col bg-gradient-to-b from-zinc-950 to-zinc-900 border-b md:border-b-0 md:border-r border-zinc-800/80">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest">GG33 Pro</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Unlimited Access
              </span>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-100 mb-2">Unlock Full Numerology Power</h3>
            <p className="text-xs text-zinc-400 mb-5">Get instant access to all tools, AI guidance, and comprehensive readings.</p>
            
            <div className="space-y-2.5 flex-1">
              {benefits.map((benefit) => (
                <div 
                  key={benefit.label}
                  className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-500/30 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center flex-shrink-0 border border-amber-500/20 mt-0.5">
                    <benefit.icon className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-zinc-200 leading-tight">{benefit.label}</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">{benefit.description}</p>
                  </div>
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-center gap-2 text-xs text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>30-Day Guarantee • Cancel Anytime via Whop</span>
            </div>
          </div>

          {/* Right panel: Checkout Actions & Embed */}
          <div className="md:col-span-3 p-5 sm:p-6 flex flex-col bg-zinc-900/30 backdrop-blur-md justify-between min-h-[420px]">
            <div>
              <DialogHeader className="pb-4">
                <DialogTitle className="text-lg sm:text-xl font-bold text-zinc-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  Checkout Session
                </DialogTitle>
              </DialogHeader>

              {/* Loading State */}
              {loadingCheckout && (
                <div className="h-72 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
                  <p className="text-sm font-medium text-zinc-300">Initializing Whop checkout...</p>
                </div>
              )}

              {/* Mobile Direct Action Button */}
              {!loadingCheckout && checkoutUrl && (
                <div className="mb-4">
                  <Button
                    onClick={handleCheckoutRedirect}
                    className="w-full h-12 text-sm font-bold bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-600 text-zinc-950 shadow-lg shadow-amber-500/20 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
                  >
                    <Crown className="w-4 h-4" />
                    <span>Proceed to Whop Checkout</span>
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </Button>
                  <p className="text-[11px] text-center text-zinc-400 mt-2">
                    Supports 100+ local payment methods via Whop
                  </p>
                </div>
              )}

              {/* Embedded Whop Checkout */}
              {!loadingCheckout && sessionId && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider hidden md:block">
                    Or Pay Inline:
                  </p>
                  <div className="border border-zinc-800 rounded-xl overflow-hidden bg-black/60 min-h-[350px]">
                    <WhopCheckoutEmbed
                      sessionId={sessionId}
                      returnUrl={typeof window !== "undefined" ? window.location.origin + "/?status=success" : undefined}
                      theme="dark"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-zinc-400" />
                <span>SSL Encrypted Checkout</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-400 hover:text-zinc-200 text-[11px] h-7 px-2"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
