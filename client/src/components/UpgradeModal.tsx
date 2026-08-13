import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Check, Sparkles, Users, Database, Compass, MessageCircle, GraduationCap, Hash, Lock, Loader2, Sun, ExternalLink } from 'lucide-react';
import { WhopCheckoutEmbed } from "@whop/checkout/react";
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const benefits = [
  { icon: Users, label: 'Compatibility Analysis', description: 'Discover relationship dynamics' },
  { icon: Database, label: 'Cues Database', description: '22,000+ cues library' },
  { icon: Compass, label: 'Explore Modules', description: 'All numerology modules' },
  { icon: MessageCircle, label: 'CueChats AI', description: 'Personalized AI guidance' },
  { icon: GraduationCap, label: 'All Courses', description: 'Complete learning library' },
  { icon: Hash, label: 'Core & Name Numbers', description: 'Full meaning interpretations' },
  { icon: Sun, label: 'Daily Energy Readings', description: 'Reveal your daily frequency' },
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
      // Clear state when closed
      setSessionId(null);
      setCheckoutUrl(null);
    }
  }, [open, dbUser, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-3xl lg:max-w-5xl mx-4 p-0 rounded-xl border-amber-500/30 overflow-hidden max-h-[90vh]" 
        data-testid="modal-upgrade"
      >
        <div className="relative grid md:grid-cols-5 gap-0 max-h-[90vh] overflow-y-auto">
          {/* Left panel: Benefits List (2/5 columns) */}
          <div className="md:col-span-2 p-6 flex flex-col bg-zinc-950 border-r border-zinc-900">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-bold text-amber-500 uppercase tracking-widest">GG33 Pro</span>
            </div>
            
            <p className="text-lg font-semibold text-zinc-100 mb-4">Unlock Premium Access</p>
            
            <div className="flex flex-col gap-2.5 flex-1">
              {benefits.map((benefit) => (
                <div 
                  key={benefit.label}
                  className="flex items-start gap-3 p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800/60"
                  data-testid={`benefit-${benefit.label.toLowerCase().replace(/\s/g, '-')}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center flex-shrink-0 border border-amber-500/20">
                    <benefit.icon className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-zinc-200 leading-tight">{benefit.label}</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5 leading-normal">{benefit.description}</p>
                  </div>
                  <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-zinc-900 text-center text-xs text-zinc-500 flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3 text-zinc-500" />
              <span>Payments secured by Whop</span>
            </div>
          </div>

          {/* Right panel: Embedded Checkout (3/5 columns) */}
          <div className="md:col-span-3 p-6 flex flex-col bg-zinc-900/40 backdrop-blur-md justify-between min-h-[500px]">
            <div>
              <DialogHeader className="pb-4">
                <DialogTitle className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  Complete Your Upgrade
                </DialogTitle>
              </DialogHeader>

              {/* Loading State */}
              {loadingCheckout && (
                <div className="h-80 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
                  <p className="text-sm font-medium text-zinc-400">Loading secure checkout...</p>
                </div>
              )}

              {/* Embedded Whop Checkout */}
              {!loadingCheckout && sessionId && (
                <div className="space-y-4">
                  <div className="border border-zinc-800/80 rounded-xl overflow-hidden bg-black/60 min-h-[400px]">
                    <WhopCheckoutEmbed
                      sessionId={sessionId}
                      returnUrl={typeof window !== "undefined" ? window.location.origin + "/?status=success" : undefined}
                      theme="dark"
                    />
                  </div>

                  {checkoutUrl && (
                    <Button
                      variant="outline"
                      className="w-full border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 flex items-center justify-center gap-2 transition-colors text-xs py-2"
                      onClick={() => window.open(checkoutUrl, '_blank')}
                    >
                      <span>Open Checkout in New Tab</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
