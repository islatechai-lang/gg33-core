import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShieldCheck, FileText } from 'lucide-react';

interface LegalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'terms' | 'privacy';
}

export function LegalModal({ open, onOpenChange, type }: LegalModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-2xl p-0 rounded-2xl border-zinc-800 bg-zinc-950 overflow-hidden text-zinc-100 max-h-[85vh]">
        <div className="p-6 pb-4 border-b border-zinc-800/80">
          <DialogHeader className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                {type === 'terms' ? (
                  <FileText className="w-4 h-4 text-amber-400" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                )}
              </div>
              <DialogTitle className="text-xl font-bold text-zinc-100">
                {type === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-zinc-400">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="p-6 max-h-[60vh] text-xs leading-relaxed text-zinc-300 space-y-4">
          {type === 'terms' ? (
            <div className="space-y-4 pr-2">
              <section className="space-y-2">
                <h4 className="font-bold text-sm text-zinc-100">1. Acceptance of Terms</h4>
                <p>
                  By accessing and using GG33 CORE, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-sm text-zinc-100">2. Service Description</h4>
                <p>
                  GG33 CORE provides numerology calculations, astrology insights, pattern discovery, and educational resources for personal insight and entertainment purposes.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-sm text-zinc-100">3. Subscriptions & Billing</h4>
                <p>
                  Pro features are billed on a recurring monthly subscription basis via Whop. You may cancel your subscription at any time through the in-app subscription manager or Whop customer portal.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-sm text-zinc-100">4. User Accounts</h4>
                <p>
                  You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-sm text-zinc-100">5. Limitation of Liability</h4>
                <p>
                  GG33 CORE and its operators shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the service.
                </p>
              </section>
            </div>
          ) : (
            <div className="space-y-4 pr-2">
              <section className="space-y-2">
                <h4 className="font-bold text-sm text-zinc-100">1. Information We Collect</h4>
                <p>
                  We collect information you provide directly to us when creating an account, such as your email address, name, birth date, birth time, and birth location for calculating your numerology and astrology profile.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-sm text-zinc-100">2. How We Use Your Information</h4>
                <p>
                  Your birth information is used exclusively to generate personal astrological and numerological calculations, daily energy readings, and compatibility analyses.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-sm text-zinc-100">3. Data Protection & Security</h4>
                <p>
                  We implement industry-standard encryption and security measures. We do not sell or rent your personal data to third parties.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-sm text-zinc-100">4. Payment Processing</h4>
                <p>
                  Payment transactions are securely processed by Whop. We do not store your credit card or financial details on our servers.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-sm text-zinc-100">5. Contact Us</h4>
                <p>
                  If you have questions about this Privacy Policy, please contact our support team through the app.
                </p>
              </section>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
