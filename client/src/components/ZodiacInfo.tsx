import { calculateComprehensiveProfile } from '@/lib/numerology';
import { ProfileData } from '@/components/ProfileSetup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Star, Flame, Wind, Droplets, Mountain, Zap, Moon } from 'lucide-react';

interface ZodiacInfoProps {
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

export function ZodiacInfo({ profile }: ZodiacInfoProps) {
  const fullProfile = calculateComprehensiveProfile(
    profile.fullName,
    profile.birthDate,
    profile.birthTime,
    profile.birthLocation
  );

  const ElementIcon = elementIcons[fullProfile.westernZodiac.element] || Star;
  const ChineseElementIcon = elementIcons[fullProfile.chineseZodiac.element] || Star;

  return (
    <Card variant="frosted" className="overflow-hidden relative" data-testid="card-zodiac-info">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-a2 to-transparent pointer-events-none" />
      
      <CardHeader className="relative pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-8 to-violet-9 flex items-center justify-center">
            <Moon className="w-5 h-5 text-white" />
          </div>
          <CardTitle className="text-4">Zodiac Signs</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative">
        <div className="p-4 rounded-lg bg-gray-a3 border border-gray-5/30">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <ElementIcon className="w-5 h-5 text-amber-9" />
              <span className="text-3 font-medium">{fullProfile.westernZodiac.sign}</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline" size="sm">{fullProfile.westernZodiac.element}</Badge>
              <Badge variant="outline" size="sm">{fullProfile.westernZodiac.modality}</Badge>
            </div>
          </div>
          <p className="text-1 text-gray-10 mt-2">
            Ruled by {fullProfile.westernZodiac.rulingPlanet}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-md bg-gray-a3">
            <p className="text-4 mb-1" data-testid="text-zodiac-animal">{fullProfile.chineseZodiac.animal}</p>
            <p className="text-0 text-gray-10">Chinese</p>
          </div>
          <div className="text-center p-3 rounded-md bg-gray-a3">
            <p className="flex items-center justify-center mb-1">
              <ChineseElementIcon className="w-5 h-5 text-amber-9" />
            </p>
            <p className="text-0 text-gray-10">{fullProfile.chineseZodiac.element}</p>
          </div>
          <div className="text-center p-3 rounded-md bg-gray-a3">
            <p className="flex items-center justify-center mb-1">
              <Star className="w-5 h-5 text-amber-9" />
            </p>
            <p className="text-0 text-gray-10">{fullProfile.chineseZodiac.yinYang}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
