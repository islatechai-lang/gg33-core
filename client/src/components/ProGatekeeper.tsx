import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Lock, Sparkles } from 'lucide-react';
import { UpgradeModal } from '@/components/UpgradeModal';

interface ProGatekeeperProps {
  isPro: boolean;
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function ProGatekeeper({ 
  isPro, 
  children, 
  title = "Unlock Full Insights",
  description = "Upgrade to Pro to access the complete interpretation and deeper meanings."
}: ProGatekeeperProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  if (isPro) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div 
        className="blur-sm select-none pointer-events-none opacity-60"
        aria-hidden="true"
      >
        {children}
      </div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-start pt-12 sm:pt-20 bg-gradient-to-b from-background/40 via-background/80 to-background/95">
        <div className="text-center p-8 max-w-md">
          <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-amber-8 to-amber-9 flex items-center justify-center mb-6 shadow-lg shadow-amber-9/30">
            <Lock className="w-8 h-8 text-white" />
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-5 h-5 text-amber-9" />
            <Badge variant="secondary" size="sm">Pro Feature</Badge>
          </div>
          
          <h3 className="text-5 font-semibold text-gray-12 mb-3">
            {title}
          </h3>
          
          <p className="text-3 text-gray-11 mb-6">
            {description}
          </p>
          
          <Button 
            variant="gold" 
            size="lg"
            onClick={() => setShowUpgradeModal(true)}
            data-testid="button-unlock-content"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Upgrade to Pro
          </Button>
        </div>
      </div>

      <UpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
    </div>
  );
}
