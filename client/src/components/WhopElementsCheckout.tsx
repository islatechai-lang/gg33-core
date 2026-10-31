import { useEffect, useState } from 'react';
import { WhopElements, Checkout, CheckoutElement } from '@whop/elements-react';
import { loadWhop } from '@whop/elements';
import { Loader2 } from 'lucide-react';

interface Props {
  planId: string;
  email?: string;
  onComplete?: (paymentId?: string) => void;
}

export default function WhopElementsCheckout({ planId, email, onComplete }: Props) {
  const [elements, setElements] = useState<any>(null);

  useEffect(() => {
    try {
      setElements(loadWhop());
    } catch (e) {
      console.error('Failed to load Whop elements:', e);
    }
  }, []);

  if (!elements) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
        <p className="text-sm font-medium text-zinc-400">Loading secure checkout...</p>
      </div>
    );
  }

  return (
    <WhopElements
      elements={elements}
      appearance={{
        theme: {
          appearance: 'dark',
          accentColor: 'amber',
        },
      }}
    >
      <Checkout
        plan={planId}
        onComplete={(completion: any) => {
          const paymentId = completion?.paymentId || completion?.sessionId || 'whop_checkout_success';
          onComplete?.(paymentId);
        }}
        fallback={
          <div className="h-96 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
            <p className="text-sm font-medium text-zinc-400">Loading payment form...</p>
          </div>
        }
      >
        <CheckoutElement buyerEmail={email} />
      </Checkout>
    </WhopElements>
  );
}
