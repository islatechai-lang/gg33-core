import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { parseUTCDate } from '@shared/dateUtils';
import { Navigation } from '@/components/Navigation';
import { StarField } from '@/components/StarField';
import { CompatibilityChecker } from '@/components/CompatibilityChecker';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { NavLink } from '@/components/NavLink';
import { Heart, Sparkles, Lock, Crown } from 'lucide-react';
import { UpgradeModal } from '@/components/UpgradeModal';

interface ProfileData {
  odisId: string;
  name: string;
  fullName: string;
  birthDate: Date;
  birthTime: string;
  birthLocation: string;
}

interface MeApiResponse {
  user?: {
    odisId: string;
    fullName: string;
    birthDate: string;
    birthTime?: string;
    birthLocation?: string;
    isPro?: boolean;
  };
  needsOnboarding?: boolean;
}

export default function Compatibility() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const { data: meData, isLoading } = useQuery<MeApiResponse>({
    queryKey: ['/api/me'],
    queryFn: async () => {
      try {
        const res = await apiRequest('GET', '/api/me');
        return await res.json() as MeApiResponse;
      } catch (error) {
        // If API request fails (e.g., 401 Unauthorized), assume needs onboarding
        return { needsOnboarding: true };
      }
    },
  });

  useEffect(() => {
    if (meData?.user?.odisId) {
      localStorage.setItem('gg33-odis-id', meData.user.odisId);
    }
  }, [meData]);

  const isPro = meData?.user?.isPro ?? false;

  const profile: ProfileData | null = meData?.user ? {
    odisId: meData.user.odisId,
    fullName: meData.user.fullName,
    name: meData.user.fullName.split(' ')[0],
    birthDate: parseUTCDate(meData.user.birthDate),
    birthTime: meData.user.birthTime || '12:00',
    birthLocation: meData.user.birthLocation || 'Unknown',
  } : null;

  if (isLoading) {
    return (
      <>
        <StarField />
        <Navigation />
        <main className="pt-20 pb-12 px-4 min-h-screen">
          <div className="container mx-auto max-w-4xl flex items-center justify-center">
            <div className="animate-pulse text-gray-11">Loading...</div>
          </div>
        </main>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <StarField />
        <Navigation />
        <main className="pt-20 pb-12 px-4 min-h-screen">
          <div className="container mx-auto max-w-4xl">
            <Card variant="frosted" className="text-center">
              <CardContent className="py-12">
                <Heart className="w-16 h-16 mx-auto text-amber-9 mb-6" />
                <h2 className="text-5 font-semibold mb-4">
                  Set Up Your Profile First
                </h2>
                <p className="text-gray-11 text-2 mb-6">
                  To check compatibility, we need your birth date to calculate your energy signature.
                </p>
                <NavLink to="/" className="text-amber-11 hover:underline">
                  Go to Home to set up your profile
                </NavLink>
              </CardContent>
            </Card>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <StarField />
      <Navigation />

      <main className="pt-16 sm:pt-20 pb-20 lg:pb-12 px-3 sm:px-4 min-h-screen" data-testid="page-compatibility">
        <div className="container mx-auto max-w-3xl space-y-6">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
              Compatibility <span className="gradient-text">Analysis</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Discover how your energetic blueprint aligns with anyone.
            </p>
          </div>

          {isPro ? (
            <CompatibilityChecker
              userBirthDate={profile.birthDate}
              userName={profile.name}
              userFullName={profile.fullName}
            />
          ) : (
            <Card variant="frosted" className="text-center rounded-3xl border border-zinc-800/80 bg-zinc-950/70" data-testid="card-compatibility-locked">
              <CardContent className="py-10">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 text-amber-400 shadow-lg shadow-amber-500/10">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <Badge variant="secondary" size="sm">Pro Feature</Badge>
                </div>
                <h2 className="text-lg font-bold mb-2 text-zinc-100">
                  Unlock Full Compatibility Analysis
                </h2>
                <p className="text-zinc-400 text-xs sm:text-sm mb-6 max-w-md mx-auto leading-relaxed">
                  Discover deep multi-dimensional energy alignment, life path synergy, and relationship dynamics.
                </p>
                <Button
                  variant="gold"
                  size="default"
                  onClick={() => setShowUpgradeModal(true)}
                  className="rounded-xl font-bold"
                  data-testid="button-unlock-compatibility"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <UpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
    </>
  );
}
