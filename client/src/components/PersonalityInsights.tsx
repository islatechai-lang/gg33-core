import { useQuery } from '@tanstack/react-query';
import { calculateComprehensiveProfile } from '@/lib/numerology';
import { ProfileData } from '@/components/ProfileSetup';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Palette, Lightbulb, Brain } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { apiRequest } from '@/lib/queryClient';
import { displayUTCDate } from '@shared/dateUtils';

interface PersonalityInsightsProps {
  profile: ProfileData;
}

interface PersonalityResponse {
  overview: string;
  strengths: string[];
  challenges: string[];
  lifeLesson: string;
  careerPaths: string[];
  relationshipStyle: string;
  spiritualGifts: string[];
}

export function PersonalityInsights({ profile }: PersonalityInsightsProps) {
  const fullProfile = calculateComprehensiveProfile(
    profile.fullName,
    profile.birthDate,
    profile.birthTime,
    profile.birthLocation
  );

  const aiProfileData = {
    name: profile.fullName.split(' ')[0],
    birthDate: displayUTCDate(profile.birthDate, { month: 'long', day: 'numeric', year: 'numeric' }),
    lifePathNumber: fullProfile.lifePathNumber,
    expressionNumber: fullProfile.expressionNumber,
    soulUrgeNumber: fullProfile.soulUrgeNumber,
    personalityNumber: fullProfile.personalityNumber,
    maturityNumber: fullProfile.maturityNumber,
    westernZodiac: fullProfile.westernZodiac.sign,
    westernElement: fullProfile.westernZodiac.element,
    chineseZodiac: fullProfile.chineseZodiac.animal,
    chineseElement: fullProfile.chineseZodiac.element,
  };

  const { data: existingInsight, isLoading: isCheckingExisting } = useQuery({
    queryKey: ['/api/personality', profile.odisId],
    queryFn: async () => {
      const response = await fetch(`/api/personality/${profile.odisId}`);
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) throw new Error('Failed to fetch personality insight');
      const data = await response.json();
      return data.insight as PersonalityResponse;
    },
    staleTime: Infinity,
    retry: false,
  });

  const { data: newInsight, isLoading: isGenerating } = useQuery({
    queryKey: ['/api/personality/generate', profile.odisId],
    queryFn: async () => {
      const response = await apiRequest('POST', '/api/personality', {
        odisId: profile.odisId,
        profile: aiProfileData,
      });
      const data = await response.json();
      return data.insight as PersonalityResponse;
    },
    enabled: existingInsight === null && !isCheckingExisting,
    retry: 2,
  });

  const displayData = existingInsight || newInsight;
  const isLoading = isCheckingExisting || (isGenerating && !displayData);

  const fallbackData = {
    overview: fullProfile.personality.paragraph,
    strengths: fullProfile.personality.strengths,
    challenges: fullProfile.personality.challenges,
    luckyColors: fullProfile.personality.luckyColors,
  };

  return (
    <Card variant="frosted" className="overflow-hidden relative h-full rounded-2xl sm:rounded-3xl border border-white/[0.08]" data-testid="card-personality">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-purple-500/5 pointer-events-none" />

      <CardContent className="relative p-5 sm:p-7 flex flex-col h-full">
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-zinc-950 flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0">
            <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">Personality Insights</h2>
            {isLoading && <p className="text-xs text-zinc-400">Generating personalized insights...</p>}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4 flex-1">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <div className="pt-4">
              <Skeleton className="h-7 w-28 mb-3" />
              <div className="flex gap-2">
                <Skeleton className="h-7 w-24" />
                <Skeleton className="h-7 w-24" />
                <Skeleton className="h-7 w-24" />
              </div>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-6 font-normal" data-testid="text-personality-paragraph">
              {displayData?.overview || fallbackData.overview}
            </p>

            <div className="space-y-5 flex-1">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Your Superpowers
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(displayData?.strengths || fallbackData.strengths || []).slice(0, 5).map((strength, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 border border-amber-500/25 text-amber-300 shadow-sm transition-all hover:bg-amber-500/15"
                      data-testid={`badge-strength-${i}`}
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>

              {(displayData?.challenges || fallbackData.challenges) && (displayData?.challenges || fallbackData.challenges).length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-3 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-purple-400" />
                    Growth Edges
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(displayData?.challenges || fallbackData.challenges).slice(0, 4).map((challenge, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 border border-purple-500/25 text-purple-300 shadow-sm transition-all hover:bg-purple-500/15"
                        data-testid={`badge-challenge-${i}`}
                      >
                        {challenge}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {displayData?.spiritualGifts && displayData.spiritualGifts.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-400 mb-2.5 flex items-center gap-2">
                    <Palette className="w-3.5 h-3.5 text-teal-400" />
                    Spiritual Gifts
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">{displayData.spiritualGifts.join(' • ')}</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.08]">
              <div className="flex items-start gap-3 bg-white/[0.02] p-3.5 rounded-2xl border border-white/[0.06]">
                <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-zinc-300 italic leading-relaxed" data-testid="text-life-lesson">
                  {displayData?.lifeLesson || `Trust your Life Path ${fullProfile.lifePathNumber} energy to guide you forward.`}
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
