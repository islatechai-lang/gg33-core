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
    <Card variant="frosted" className="overflow-hidden relative h-full" data-testid="card-personality">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-a2 via-transparent to-transparent pointer-events-none" />

      <CardContent className="relative p-6 sm:p-8 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-xl bg-gold-gradient flex items-center justify-center flex-shrink-0">
            <Brain className="w-6 h-6 text-gray-1" />
          </div>
          <div>
            <h2 className="text-5 font-semibold">Personality Insights</h2>
            {isLoading && <p className="text-2 text-gray-10">Generating personalized insights...</p>}
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
            <p className="text-3 text-gray-11 leading-relaxed mb-5" data-testid="text-personality-paragraph">
              {displayData?.overview || fallbackData.overview}
            </p>

            <div className="space-y-5 flex-1">
              <div>
                <h4 className="text-2 font-medium text-gray-10 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-9" />
                  Your Strengths
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(displayData?.strengths || fallbackData.strengths || []).slice(0, 5).map((strength, i) => (
                    <Badge key={i} color="amber" variant="outline" data-testid={`badge-strength-${i}`}>
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>

              {(displayData?.challenges || fallbackData.challenges) && (displayData?.challenges || fallbackData.challenges).length > 0 && (
                <div>
                  <h4 className="text-2 font-medium text-gray-10 mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-violet-9" />
                    Growth Areas
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(displayData?.challenges || fallbackData.challenges).slice(0, 4).map((challenge, i) => (
                      <Badge key={i} variant="outline" data-testid={`badge-challenge-${i}`}>
                        {challenge}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {displayData?.spiritualGifts && displayData.spiritualGifts.length > 0 && (
                <div>
                  <h4 className="text-2 font-medium text-gray-10 mb-3 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-blue-9" />
                    Spiritual Gifts
                  </h4>
                  <p className="text-3 text-gray-11">{displayData.spiritualGifts.join(', ')}</p>
                </div>
              )}
            </div>

            <div className="mt-5 pt-5 border-t border-gray-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-amber-9 flex-shrink-0 mt-0.5" />
                <p className="text-2 text-gray-11 italic" data-testid="text-life-lesson">
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
