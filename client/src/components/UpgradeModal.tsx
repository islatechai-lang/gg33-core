import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Crown, Check, Sparkles, Users, Database, Compass, MessageCircle, GraduationCap, Hash, Clock, Zap, Lock, Loader2, Sun } from 'lucide-react';
import proBgImage from '@assets/generated_images/clean_minimal_sacred_geometry_background.png';
import { apiRequest, queryClient } from '@/lib/queryClient';
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
  const { dbUser, refreshDbUser } = useAuth();
  
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [planId, setPlanId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  
  const [manualPaymentId, setManualPaymentId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

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
            setPlanId(data.planId);
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
      setPlanId(null);
      setCheckoutUrl(null);
      setManualPaymentId('');
    }
  }, [open, dbUser]);

  // Refresh Whop scripts to capture dynamic data-whop-checkout elements
  useEffect(() => {
    if (sessionId) {
      // Whop's loader script parses elements with data-whop-checkout on load.
      // If we insert them dynamically, we should notify the loader script.
      // Standard Whop JS loader exposes Whop objects or we can re-inject the loader.
      try {
        const whopWindow = window as any;
        if (whopWindow.Whop && typeof whopWindow.Whop.init === 'function') {
          whopWindow.Whop.init();
        }
      } catch (err) {
        console.error('Failed to re-initialize Whop checkout loader:', err);
      }
    }
  }, [sessionId]);

  const handleManualVerify = async () => {
    if (!manualPaymentId) return;

    setIsVerifying(true);
    try {
      const res = await apiRequest('POST', '/api/upgrade-to-pro', {
        paymentId: manualPaymentId,
        odisId: dbUser?.odisId,
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: 'Welcome to Pro!',
          description: 'Your purchase has been verified. You now have full access.',
        });
        await refreshDbUser();
        // Invalidate queries to update layout
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['/api/me'] }),
          queryClient.invalidateQueries({ queryKey: ['/api/membership'] }),
        ]);
        onOpenChange(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Verification Failed',
          description: data.error || 'Could not verify payment with Whop.',
        });
      }
    } catch (err: any) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err?.message || 'Verification failed. Make sure your payment ID is correct.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-3xl lg:max-w-5xl mx-4 p-0 rounded-xl border-amber-9/30 overflow-hidden max-h-[90vh]" 
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

          {/* Right panel: Checkout Embed / Manual Verify (3/5 columns) */}
          <div className="md:col-span-3 p-6 flex flex-col bg-zinc-900/20 backdrop-blur-md justify-between min-h-[450px]">
            <div>
              <DialogHeader className="pb-4">
                <DialogTitle className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  Complete Your Upgrade
                </DialogTitle>
              </DialogHeader>

              {/* Loader */}
              {loadingCheckout && (
                <div className="h-60 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                  <p className="text-sm text-zinc-400">Loading checkout session...</p>
                </div>
              )}

              {/* Whop Embedded Checkout Element */}
              {!loadingCheckout && sessionId && (
                <div className="space-y-4">
                  <div className="border border-zinc-800 rounded-lg overflow-hidden bg-black/40 min-h-[350px] p-2">
                    <div
                      data-whop-checkout-plan-id={planId}
                      data-whop-checkout-session={sessionId}
                      data-whop-checkout-return-url={window.location.origin + "/?status=success"}
                      className="w-full h-full min-h-[340px]"
                    />
                  </div>
                  
                  {checkoutUrl && (
                    <Button
                      variant="outline"
                      className="w-full border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                      onClick={() => window.open(checkoutUrl, '_blank')}
                    >
                      Pay in new window instead
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Manual Verification Fallback */}
            {!loadingCheckout && (
              <div className="mt-6 pt-4 border-t border-zinc-800/80">
                <p className="text-xs font-semibold text-zinc-300 mb-2">Already paid? Verify manually</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter Whop Payment ID (e.g., pay_xxxxx)"
                    value={manualPaymentId}
                    onChange={(e) => setManualPaymentId(e.target.value)}
                    className="bg-zinc-950 border-zinc-800 text-zinc-200 placeholder-zinc-500 text-xs h-9 focus:border-amber-500"
                  />
                  <Button
                    onClick={handleManualVerify}
                    disabled={isVerifying || !manualPaymentId}
                    variant="gold"
                    size="sm"
                    className="font-bold text-xs h-9"
                  >
                    {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
