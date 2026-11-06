import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { ArrowLeft, Sparkles, ExternalLink } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/context/AuthContext';
import { Navigation } from '@/components/Navigation';
import { PaymentLoadingSpinner } from '@/components/PaymentLoadingSpinner';

const PLAN_ID = "plan_fIcwotlGpy6de";
const DIRECT_CHECKOUT_URL = `https://whop.com/checkout/${PLAN_ID}`;

// Dynamically import WhopElementsCheckout so that it only loads in browser with hardware-accelerated spinner
const WhopElementsCheckout = dynamic(
  () => import('@/components/WhopElementsCheckout'),
  {
    ssr: false,
    loading: () => <PaymentLoadingSpinner text="Loading secure checkout..." />,
  }
);

export default function CheckoutPage() {
  const router = useRouter();
  const { dbUser, refreshDbUser, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !dbUser) {
      router.replace('/login');
      return;
    }
  }, [dbUser, authLoading, router]);

  const handleComplete = async (paymentId?: string) => {
    try {
      await apiRequest('POST', '/api/upgrade-to-pro', {
        paymentId: paymentId || 'whop_checkout_success',
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
      <Navigation />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 sm:px-6 relative z-10">
        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors mb-6 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Dashboard</span>
        </button>

        {/* Focused Payment Container */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3 pb-6 border-b border-zinc-800">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center border border-amber-500/30 flex-shrink-0">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-zinc-100">Secure Payment</h3>
          </div>

          {/* Embedded Whop Element */}
          <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-900/40 min-h-[440px] p-2">
            <WhopElementsCheckout
              planId={PLAN_ID}
              onComplete={handleComplete}
            />
          </div>

          {/* Direct Link Fallback */}
          <div className="pt-4 border-t border-zinc-800/80 text-center">
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
      </main>
    </div>
  );
}
