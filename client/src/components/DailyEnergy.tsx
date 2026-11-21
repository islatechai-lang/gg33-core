import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  calculateComprehensiveProfile,
  calculateDailyEnergyScore
} from '@/lib/numerology';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Sparkles, Sun, Zap, Target, Quote } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ProfileData } from '@/components/ProfileSetup';
import { apiRequest } from '@/lib/queryClient';
import { displayUTCDate } from '@shared/dateUtils';
import { UpgradeModal } from '@/components/UpgradeModal';

interface DailyEnergyProps {
  profile: ProfileData;
  isPro?: boolean;
}

interface DailyEnergyResponse {
  theme: string;
  description: string;
  dos: string[];
  donts: string[];
  focusArea: string;
  affirmation: string;
}

function calculatePersonalDay(birthDate: Date): number {
  const today = new Date();
  const birthMonth = birthDate.getUTCMonth() + 1;
  const birthDay = birthDate.getUTCDate();
  const currentMonth = today.getUTCMonth() + 1;
  const currentDay = today.getUTCDate();
  const currentYear = today.getUTCFullYear();

  let personalYear = birthMonth + birthDay + currentYear;
  while (personalYear > 9 && personalYear !== 11 && personalYear !== 22 && personalYear !== 33) {
    personalYear = personalYear.toString().split('').reduce((a, b) => a + parseInt(b), 0);
  }

  let personalMonth = personalYear + currentMonth;
  while (personalMonth > 9 && personalMonth !== 11 && personalMonth !== 22 && personalMonth !== 33) {
    personalMonth = personalMonth.toString().split('').reduce((a, b) => a + parseInt(b), 0);
  }

  let personalDay = personalMonth + currentDay;
  while (personalDay > 9 && personalDay !== 11 && personalDay !== 22 && personalDay !== 33) {
    personalDay = personalDay.toString().split('').reduce((a, b) => a + parseInt(b), 0);
  }

  return personalDay;
}

function calculateUniversalDay(): number {
  const today = new Date();
  const month = today.getUTCMonth() + 1;
  const day = today.getUTCDate();
  const year = today.getUTCFullYear();

  let sum = month + day + year;
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').reduce((a, b) => a + parseInt(b), 0);
  }
  return sum;
}

export function DailyEnergy({ profile, isPro = false }: DailyEnergyProps) {
  const fullProfile = calculateComprehensiveProfile(
    profile.fullName,
    profile.birthDate,
    profile.birthTime,
    profile.birthLocation
  );

  const energyScore = calculateDailyEnergyScore(profile.birthDate);
  const personalDayNumber = calculatePersonalDay(profile.birthDate);
  const universalDayNumber = calculateUniversalDay();
  const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const todayKey = new Date().toISOString().split('T')[0];

  const [isRevealed, setIsRevealed] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const aiProfileData = {
    name: profile.fullName.split(' ')[0],
    birthDate: displayUTCDate(profile.birthDate, { month: 'long', day: 'numeric', year: 'numeric' }),
    lifePathNumber: fullProfile.lifePathNumber,
    expressionNumber: fullProfile.expressionNumber,
    soulUrgeNumber: fullProfile.soulUrgeNumber,
    westernZodiac: fullProfile.westernZodiac.sign,
    chineseZodiac: fullProfile.chineseZodiac.animal,
  };

  const { data: existingEnergy, isLoading: isCheckingExisting } = useQuery({
    queryKey: ['/api/daily-energy', profile.odisId, todayKey],
    queryFn: async () => {
      const response = await fetch(`/api/daily-energy/${profile.odisId}/${todayKey}`);
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) throw new Error('Failed to fetch daily energy');
      const data = await response.json();
      return data.energy as DailyEnergyResponse;
    },
    enabled: isPro,
    staleTime: 1000 * 60 * 60,
    retry: false,
  });

  const { data: newEnergy, isLoading: isGenerating, refetch: generateEnergy } = useQuery({
    queryKey: ['/api/daily-energy/generate', profile.odisId, todayKey],
    queryFn: async () => {
      const response = await apiRequest('POST', '/api/daily-energy', {
        odisId: profile.odisId,
        profile: aiProfileData,
        personalDayNumber,
        universalDayNumber,
        energyScore,
        todayDate,
        date: todayKey,
      });
      const data = await response.json();
      return data.energy as DailyEnergyResponse;
    },
    enabled: false,
    retry: 2,
  });

  const handleRevealEnergy = async () => {
    if (!isPro) {
      setShowUpgradeModal(true);
      return;
    }
    setIsRevealed(true);
    if (!existingEnergy) {
      await generateEnergy();
    }
  };

  const hasExistingReading = !!existingEnergy;
  const displayData = existingEnergy || newEnergy;
  const isLoading = isCheckingExisting || (isPro && isRevealed && isGenerating && !displayData);

  const getEnergyLevel = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-green-11', bgColor: 'bg-green-9' };
    if (score >= 60) return { label: 'Good', color: 'text-amber-11', bgColor: 'bg-amber-9' };
    if (score >= 40) return { label: 'Moderate', color: 'text-blue-11', bgColor: 'bg-blue-9' };
    return { label: 'Low', color: 'text-gray-11', bgColor: 'bg-gray-9' };
  };

  const energyLevel = getEnergyLevel(energyScore);
  const isPowerDay = energyScore >= 75;

  const shouldShowRevealed = isPro && (isRevealed || hasExistingReading);

  return (
    <>
      <Card variant="frosted" className="overflow-hidden relative h-full" data-testid="card-daily-energy">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-a2 via-transparent to-transparent pointer-events-none" />

        <CardContent className="relative p-6 sm:p-8 flex flex-col h-full">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold-gradient flex items-center justify-center flex-shrink-0">
                <Sun className="w-6 h-6 text-gray-1" />
              </div>
              <div>
                <h2 className="text-5 font-semibold">Your Daily Energy</h2>
                <p className="text-2 text-gray-10">
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
            <Badge variant="outline">Day {personalDayNumber}</Badge>
          </div>

          {!shouldShowRevealed && !isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-violet-500/10 border border-amber-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(245,158,11,0.2)] animate-pulse">
                <Sparkles className="w-10 h-10 text-amber-400" />
              </div>
              <h3 className="text-5 font-extrabold text-white mb-2 tracking-tight">Your Reading Awaits</h3>
              <p className="text-2 text-zinc-400 mb-6 max-w-xs font-medium">
                Discover your personalized energy forecast for today based on your unique numerology profile.
              </p>
              <Button
                size="lg"
                onClick={handleRevealEnergy}
                className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-zinc-950 font-black rounded-full px-8 shadow-[0_4px_20px_rgba(245,158,11,0.3)] hover:shadow-[0_6px_28px_rgba(245,158,11,0.45)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                data-testid="button-reveal-energy"
              >
                <Sun className="w-5 h-5 mr-2" />
                {isPro ? "Reveal Today's Energy" : "Unlock Daily Energy"}
              </Button>
            </div>
          ) : isLoading ? (
            <div className="space-y-4 flex-1">
              <Skeleton className="h-7 w-36 rounded-xl" />
              <Skeleton className="h-5 w-full rounded-xl" />
              <Skeleton className="h-5 w-3/4 rounded-xl" />
              <div className="pt-4 grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                  <Skeleton className="h-5 w-20 rounded-lg mb-3" />
                  <Skeleton className="h-4 w-full rounded-lg" />
                  <Skeleton className="h-4 w-full rounded-lg" />
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                  <Skeleton className="h-5 w-20 rounded-lg mb-3" />
                  <Skeleton className="h-4 w-full rounded-lg" />
                  <Skeleton className="h-4 w-full rounded-lg" />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-5">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Today's Theme</p>
                  <h3 className="text-5 font-extrabold gradient-text tracking-tight" data-testid="text-daily-theme">
                    {displayData?.theme || 'Personal Growth'}
                  </h3>
                </div>
                <div className="text-center px-4.5 py-3 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-inner">
                  <div className="flex items-center justify-center gap-1">
                    <Zap className={`w-5 h-5 ${energyLevel.color}`} />
                    <span className="text-5 font-black text-white" data-testid="text-energy-score">{energyScore}</span>
                  </div>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${energyLevel.color}`}>{energyLevel.label}</p>
                </div>
              </div>

              <div className="w-full h-2.5 bg-white/[0.06] rounded-full overflow-hidden mb-5 border border-white/5">
                <div
                  className={`h-full ${energyLevel.bgColor} rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(245,158,11,0.5)]`}
                  style={{ width: `${energyScore}%` }}
                />
              </div>

              <p className="text-sm text-zinc-300 font-medium leading-relaxed mb-5" data-testid="text-daily-description">
                {displayData?.description || `Your Personal Day ${personalDayNumber} combines with Universal Day ${universalDayNumber} to create unique opportunities for growth and progress today.`}
              </p>

              {isPowerDay && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 mb-5 flex items-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                  <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <p className="text-xs font-bold text-emerald-300">Power Day! Your energy is amplified today.</p>
                </div>
              )}

              <div className="flex items-center gap-3 mb-5 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl">
                <Target className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span className="text-xs text-zinc-400">Focus Area: <strong className="text-white font-bold">{displayData?.focusArea || 'Personal development'}</strong></span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 flex-1">
                <div className="p-3.5 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/20 backdrop-blur-xl">
                  <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Do Today
                  </h4>
                  <ul className="space-y-2">
                    {(displayData?.dos || ['Focus on your core priorities', 'Stay grounded in your truth', 'Trust your inner intuition']).map((item, i) => (
                      <li key={i} className="text-xs text-zinc-300 flex items-start gap-2 font-medium">
                        <span className="text-emerald-400 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-500/[0.06] border border-rose-500/20 backdrop-blur-xl">
                  <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <X className="w-4 h-4 text-rose-400" />
                    Avoid Today
                  </h4>
                  <ul className="space-y-2">
                    {(displayData?.donts || ['Rushing into major decisions', 'Overcommitting your energy', 'Ignoring the need for rest']).map((item, i) => (
                      <li key={i} className="text-2 text-gray-11 flex items-start gap-2">
                        <span className="text-red-9 mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-gray-6">
                <div className="flex items-start gap-3">
                  <Quote className="w-5 h-5 text-violet-9 flex-shrink-0 mt-0.5" />
                  <p className="text-2 text-gray-11 italic" data-testid="text-affirmation">
                    "{displayData?.affirmation || `I trust my Life Path ${fullProfile.lifePathNumber} energy to guide me today.`}"
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <UpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
    </>
  );
}
