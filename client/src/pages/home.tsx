import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigation } from '@/components/Navigation';
import { StarField } from '@/components/StarField';
import { ProfileSetup, ProfileData } from '@/components/ProfileSetup';
import { LoadingScreen } from '@/components/LoadingScreen';
import { AppLoadingScreen } from '@/components/AppLoadingScreen';
import { ProfileOverview } from '@/components/ProfileOverview';
import { PersonalityInsights } from '@/components/PersonalityInsights';
import { DailyEnergy } from '@/components/DailyEnergy';
import { ExternalLink, Loader2 } from 'lucide-react';
import { parseUTCDate } from '@shared/dateUtils';
import { useAuth } from '@/context/AuthContext';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface MembershipInfo {
  hasMembership: boolean;
  membershipId: string | null;
  status: string | null;
  manageUrl: string | null;
}

interface WhopUserData {
  profilePictureUrl: string | null;
  username: string;
  name: string | null;
}

export default function Home() {
  const { toast } = useToast();
  const { dbUser, needsOnboarding, refreshDbUser } = useAuth();
  
  const [isCalculating, setIsCalculating] = useState(false);
  const [pendingProfile, setPendingProfile] = useState<ProfileData | null>(null);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);

  // Check for checkout redirects (status=success & payment_id=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const paymentId = params.get('payment_id');

    if (status === 'success' && dbUser) {
      const verifyPayment = async () => {
        setIsVerifyingPayment(true);
        toast({
          title: 'Activating GG33 Pro',
          description: 'Please wait a moment while we unlock all Pro access...',
        });

        try {
          const res = await apiRequest('POST', '/api/upgrade-to-pro', {
            paymentId: paymentId || 'whop_checkout_success',
            odisId: dbUser.odisId,
          });

          const data = await res.json();
          if (data.success) {
            toast({
              title: 'Welcome to GG33 Pro!',
              description: 'You now have full access to Cues Database, Explore, and CueChats!',
            });
            await refreshDbUser();
            await Promise.all([
              queryClient.invalidateQueries({ queryKey: ['/api/me'] }),
              queryClient.invalidateQueries({ queryKey: ['/api/membership'] }),
              queryClient.invalidateQueries({ queryKey: ['/api/profile', dbUser.odisId] }),
            ]);
          } else {
            toast({
              variant: 'destructive',
              title: 'Verification Failed',
              description: data.error || 'Could not verify your payment with Whop.',
            });
          }
        } catch (error: any) {
          console.error('[VerifyPayment] Error:', error);
          toast({
            variant: 'destructive',
            title: 'Verification Error',
            description: 'Could not connect to verify payment. You can verify manually in the Get Pro modal.',
          });
        } finally {
          setIsVerifyingPayment(false);
          // Clear query params from address bar
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      };

      verifyPayment();
    }
  }, [dbUser]);

  const profile: ProfileData | null = dbUser ? {
    odisId: dbUser.odisId,
    fullName: dbUser.fullName,
    birthDate: parseUTCDate(dbUser.birthDate),
    birthTime: dbUser.birthTime || '12:00',
    birthLocation: dbUser.birthLocation || 'Unknown',
  } : null;

  const whopUser: WhopUserData | null = dbUser ? {
    profilePictureUrl: (dbUser as any).whopProfilePictureUrl || null,
    username: (dbUser as any).whopUsername || dbUser.fullName,
    name: dbUser.fullName || null,
  } : null;

  const { data: membership } = useQuery<MembershipInfo>({
    queryKey: ['/api/membership'],
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    enabled: !!dbUser,
  });

  const isPro = dbUser?.isPro ?? membership?.hasMembership ?? false;

  const handleProfileComplete = (profileData: ProfileData) => {
    setPendingProfile(profileData);
    setIsCalculating(true);
  };

  const handleCalculationComplete = async () => {
    setPendingProfile(null);
    setIsCalculating(false);
    await refreshDbUser();
  };

  if (isVerifyingPayment) {
    return <AppLoadingScreen message="Verifying your Pro upgrade..." subMessage="GG33 Pro Activation" />;
  }

  if (isCalculating) {
    return (
      <>
        <StarField />
        <LoadingScreen onComplete={handleCalculationComplete} profile={pendingProfile || undefined} />
      </>
    );
  }

  if (needsOnboarding || !profile) {
    return (
      <>
        <StarField />
        <ProfileSetup onComplete={handleProfileComplete} />
      </>
    );
  }

  return (
    <>
      <StarField />
      <Navigation />

      <main className="pt-16 pb-12 px-4 min-h-screen" data-testid="dashboard">
        <div className="w-full max-w-6xl mx-auto space-y-6">
          <ProfileOverview profile={profile} whopUser={whopUser} isPro={isPro} />

          <div className="grid lg:grid-cols-2 gap-6 items-stretch">
            <PersonalityInsights profile={profile} />
            <DailyEnergy profile={profile} isPro={isPro} />
          </div>

          {membership?.manageUrl && isPro && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => window.open(membership.manageUrl!, '_blank')}
                className="text-[11px] text-zinc-600 hover:text-zinc-400 flex items-center gap-1 transition-colors"
                data-testid="link-manage-subscription"
              >
                Manage Plan
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
