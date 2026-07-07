import {
  calculateComprehensiveProfile,
  getNumberMeaning,
  type FullProfile
} from '@/lib/numerology';
import { ProfileData } from '@/components/ProfileSetup';
import { displayUTCDate } from '@shared/dateUtils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Star, Flame, Wind, Droplets, Mountain, Zap, Heart, Brain, Target } from 'lucide-react';

interface ProfileCardProps {
  profile: ProfileData;
}

const elementIcons: Record<string, typeof Flame> = {
  'Fire': Flame,
  'Water': Droplets,
  'Earth': Mountain,
  'Air': Wind,
  'Wood': Sparkles,
  'Metal': Zap,
};

export function ProfileCard({ profile }: ProfileCardProps) {
  const fullProfile = calculateComprehensiveProfile(
    profile.fullName,
    profile.birthDate,
    profile.birthTime,
    profile.birthLocation
  );

  const lifePathMeaning = getNumberMeaning(fullProfile.lifePathNumber);
  const ElementIcon = elementIcons[fullProfile.westernZodiac.element] || Star;
  const ChineseElementIcon = elementIcons[fullProfile.chineseZodiac.element] || Star;

  const firstName = profile.fullName.split(' ')[0];

  return (
    <Card variant="frosted" className="overflow-hidden relative" data-testid="card-profile">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-a2 via-transparent to-violet-a2 pointer-events-none" />

      <CardHeader className="relative pb-0">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-1 text-gray-11">Welcome back,</p>
            <h2 className="text-5 font-semibold text-gray-12" data-testid="text-user-name">{firstName}</h2>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="mb-1" data-testid="badge-life-path">
              Life Path {fullProfile.lifePathNumber}
            </Badge>
            <p className="text-0 text-gray-10">
              {displayUTCDate(profile.birthDate)}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 relative pt-6">
        <div className="text-center py-6 rounded-lg bg-gray-a3 border border-gray-5/50">
          <p className="text-0 text-gray-10 uppercase tracking-wider mb-2">Your Energy Signature</p>
          <h3 className="text-6 font-semibold gradient-text" data-testid="text-energy-signature">
            {fullProfile.energySignature}
          </h3>
          <p className="text-3 text-gray-11 mt-1 italic">"{lifePathMeaning.title}"</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded-md bg-gray-a3 border border-gray-5/30">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Heart className="w-4 h-4 text-pink-9" />
              <span className="text-4 font-semibold" data-testid="text-expression">{fullProfile.expressionNumber}</span>
            </div>
            <p className="text-0 text-gray-10">Expression</p>
          </div>
          <div className="text-center p-3 rounded-md bg-gray-a3 border border-gray-5/30">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Sparkles className="w-4 h-4 text-violet-9" />
              <span className="text-4 font-semibold" data-testid="text-soul-urge">{fullProfile.soulUrgeNumber}</span>
            </div>
            <p className="text-0 text-gray-10">Soul Urge</p>
          </div>
          <div className="text-center p-3 rounded-md bg-gray-a3 border border-gray-5/30">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Brain className="w-4 h-4 text-blue-9" />
              <span className="text-4 font-semibold" data-testid="text-personality">{fullProfile.personalityNumber}</span>
            </div>
            <p className="text-0 text-gray-10">Personality</p>
          </div>
          <div className="text-center p-3 rounded-md bg-gray-a3 border border-gray-5/30">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="w-4 h-4 text-green-9" />
              <span className="text-4 font-semibold" data-testid="text-maturity">{fullProfile.maturityNumber}</span>
            </div>
            <p className="text-0 text-gray-10">Maturity</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-md bg-gray-a3">
            <p className="text-4 mb-1" data-testid="text-zodiac-animal">{fullProfile.chineseZodiac.animal}</p>
            <p className="text-0 text-gray-10">Chinese Zodiac</p>
          </div>
          <div className="text-center p-3 rounded-md bg-gray-a3">
            <p className="text-3 mb-1 flex items-center justify-center">
              <ChineseElementIcon className="w-5 h-5 text-amber-9" />
            </p>
            <p className="text-0 text-gray-10">{fullProfile.chineseZodiac.element}</p>
          </div>
          <div className="text-center p-3 rounded-md bg-gray-a3">
            <p className="text-3 mb-1 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-9" />
            </p>
            <p className="text-0 text-gray-10">{fullProfile.chineseZodiac.yinYang}</p>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-gray-a2 border border-gray-5/30">
          <div className="flex items-center gap-2 mb-2">
            <ElementIcon className="w-4 h-4 text-amber-9" />
            <span className="text-1 font-medium">{fullProfile.westernZodiac.sign}</span>
            <Badge variant="outline" size="sm">{fullProfile.westernZodiac.element}</Badge>
            <Badge variant="outline" size="sm">{fullProfile.westernZodiac.modality}</Badge>
          </div>
          <p className="text-0 text-gray-10">
            Ruled by {fullProfile.westernZodiac.rulingPlanet}
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-2 text-gray-11 leading-relaxed" data-testid="text-personality-paragraph">
            {fullProfile.personality.paragraph}
          </p>
        </div>

        <div>
          <h4 className="text-2 font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-9" />
            Top Strengths
          </h4>
          <div className="flex flex-wrap gap-2">
            {fullProfile.personality.strengths.map((strength, i) => (
              <Badge key={i} color="amber" variant="outline" data-testid={`badge-strength-${i}`}>
                {strength}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-2 font-semibold mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-violet-9" />
            Core Challenges
          </h4>
          <div className="flex flex-wrap gap-2">
            {fullProfile.personality.challenges.map((challenge, i) => (
              <Badge key={i} variant="outline" data-testid={`badge-challenge-${i}`}>
                {challenge}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-2 font-semibold mb-3">Lucky Colors</h4>
          <div className="flex gap-2 flex-wrap">
            {fullProfile.personality.luckyColors.map((color, i) => (
              <div
                key={i}
                className="px-3 py-1.5 rounded-full text-1 bg-gray-a3 border border-gray-5/50"
              >
                {color}
              </div>
            ))}
          </div>
        </div>

        {profile.birthTime && profile.birthTime !== '12:00' && (
          <div className="pt-4 border-t border-gray-5/30">
            <p className="text-0 text-gray-10">
              Born at {profile.birthTime}
              {profile.birthLocation && profile.birthLocation !== 'Unknown' && ` in ${profile.birthLocation}`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
