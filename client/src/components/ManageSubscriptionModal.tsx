import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, ExternalLink, AlertTriangle, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface ManageSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManageSubscriptionModal({ open, onOpenChange }: ManageSubscriptionModalProps) {
  const { dbUser, refreshDbUser } = useAuth();
  const { toast } = useToast();
  const [isCancelling, setIsCancelling] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      const res = await apiRequest('POST', '/api/membership/cancel', {});
      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Subscription Cancelled',
          description: 'Your Pro membership has been cancelled.',
        });
        await refreshDbUser();
        await queryClient.invalidateQueries({ queryKey: ['/api/membership'] });
        await queryClient.invalidateQueries({ queryKey: ['/api/me'] });
        if (dbUser?.odisId) {
          await queryClient.invalidateQueries({ queryKey: ['/api/profile', dbUser.odisId] });
        }
        setShowConfirmCancel(false);
        onOpenChange(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Cancellation Failed',
          description: data.error || 'Could not cancel membership. You can also manage it directly on Whop.',
        });
      }
    } catch (err: any) {
      console.error('Cancellation error:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to connect to subscription service.',
      });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-md p-0 rounded-2xl border-zinc-800 bg-zinc-950 overflow-hidden text-zinc-100">
        <div className="p-6 space-y-6">
          {/* Header */}
          <DialogHeader className="space-y-2 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Crown className="w-4 h-4 text-amber-400" />
                </div>
                <DialogTitle className="text-lg font-bold text-zinc-100">
                  Manage Subscription
                </DialogTitle>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                PRO ACTIVE
              </span>
            </div>
            <DialogDescription className="text-xs text-zinc-400">
              Your GG33 Pro membership is currently active.
            </DialogDescription>
          </DialogHeader>

          {/* Membership Info Card */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Current Plan</span>
              <span className="font-bold text-zinc-200">GG33 Pro ($35/mo)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Billing Provider</span>
              <span className="font-semibold text-zinc-200">Whop Payments</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Access Status</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Unlimited
              </span>
            </div>
          </div>

          {!showConfirmCancel ? (
            <div className="space-y-3">
              {/* Whop Portal Link */}
              <Button
                variant="outline"
                className="w-full h-11 border-zinc-800 hover:bg-zinc-900 text-zinc-200 flex items-center justify-between px-4 rounded-xl"
                onClick={() => window.open('https://whop.com/hub/', '_blank')}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold">View Invoices & Payment Methods on Whop</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              </Button>

              {/* Cancel Trigger */}
              <Button
                variant="ghost"
                className="w-full text-xs text-zinc-500 hover:text-red-400 hover:bg-red-500/10 h-9 transition-colors"
                onClick={() => setShowConfirmCancel(true)}
              >
                Cancel Subscription
              </Button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 space-y-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1 text-left">
                  <p className="text-xs font-bold text-red-300">Are you sure you want to cancel?</p>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    You will immediately lose access to all GG33 Pro features, including Daily Energy readings, Cues Database, Explore insights, Study Zone courses, and AI CueChats.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-zinc-800 text-xs"
                  onClick={() => setShowConfirmCancel(false)}
                  disabled={isCancelling}
                >
                  Keep My Plan
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1 text-xs font-bold bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleCancelSubscription}
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      Cancelling...
                    </>
                  ) : (
                    'Confirm Cancel'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
