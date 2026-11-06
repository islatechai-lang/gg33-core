import { useEffect, useState } from 'react';
import { WhopElements, Checkout, CheckoutElement } from '@whop/elements-react';
import { loadWhop } from '@whop/elements';
import { PaymentLoadingSpinner } from '@/components/PaymentLoadingSpinner';

interface Props {
  planId: string;
  onComplete?: (paymentId?: string) => void;
}

export default function WhopElementsCheckout({ planId, onComplete }: Props) {
  const [elements, setElements] = useState<any>(null);

  useEffect(() => {
    try {
      setElements(loadWhop());
    } catch (e) {
      console.error('Failed to load Whop elements:', e);
    }
  }, []);

  if (!elements) {
    return <PaymentLoadingSpinner text="Loading secure checkout..." />;
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
        fallback={<PaymentLoadingSpinner text="Loading payment form..." />}
      >
        <CheckoutElement />
      </Checkout>
    </WhopElements>
  );
}
