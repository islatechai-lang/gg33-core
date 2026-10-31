import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Crown, Check, Lock, ArrowLeft, Loader2, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/context/AuthContext';
import { Navigation } from '@/components/Navigation';
import { StarField } from '@/components/StarField';

const PLAN_ID = "plan_vjG5tjRpldDkY";
const DIRECT_CHECKOUT_URL = `https://whop.com/checkout/${PLAN_ID}`;

// Dynamically import WhopElementsCheckout so that it only loads in browser
const WhopElementsCheckout = dynamic(
  () => import('@/components/WhopElementsCheckout'),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
        <p className="text-sm font-medium text-zinc-400">Loading secure checkout...</p>
      </div>
    ),
  }
);

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

export default function CheckoutPage() {
  const router = useRouter();
  const { dbUser, refreshDbUser, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !dbUser) {
      router.replace('/login');
      return;
    }

    if (dbUser) {
      // Send notification email in background
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
  }, [dbUser, authLoading, router]);

  const returnUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/?status=success`
    : 'https://gg33-core.vercel.app/?status=success';

  const handleComplete = async () => {
    try {
      await apiRequest('POST', '/api/upgrade-to-pro', {
        paymentId: 'whop_checkout_success',
        odisId: dbUser?.odisId,
      });
      await refreshDbUser();
    } catch (e) {
      console.error('Error activating pro:', e);
    } finally {
      router.push('/?status=success');
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col relative selection:bg-amber-500/30">
      <StarField />
      <Navigation />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Dashboard</span>
        </button>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Order Summary Column (5 cols) */}
          <div className="lg:col-span-5 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-6 border-b border-zinc-800/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center border border-amber-500/30">
                  <Crown className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-zinc-100">GG33 Pro</h2>
                  <p className="text-xs text-amber-400 font-medium">$35 / month • All-Access Pass</p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 block text-center mb-1">
                  PRO
                </span>
                <span className="text-xs font-extrabold text-zinc-100">$35/mo</span>
              </div>
            </div>

            {/* Feature Bullet Points */}
            <div className="space-y-3">
              <p className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider">What's Included:</p>
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

            {/* Guarantees */}
            <div className="pt-6 border-t border-zinc-800/80 space-y-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>30-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                <span>Encrypted 256-bit Whop payment processing</span>
              </div>
            </div>
          </div>

          {/* Embedded Payment Container Column (7 cols) */}
          <div className="lg:col-span-7 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl min-h-[520px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-zinc-800/80 mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-zinc-100">Secure Payment</h3>
                </div>
                <div className="flex items-center gap-1 text-xs text-zinc-400">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Whop Checkout</span>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-zinc-800 bg-black/60 min-h-[440px] p-2">
                <WhopElementsCheckout
                  planId={PLAN_ID}
                  email={dbUser?.email || undefined}
                  returnUrl={returnUrl}
                  onComplete={handleComplete}
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800/80 text-center">
              <a
                href={DIRECT_CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-amber-400 transition-colors underline"
              >
                <span>Having trouble loading the form? Click here to pay directly on Whop</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
