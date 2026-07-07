import { calculateComprehensiveProfile } from '@/lib/numerology';
import { ProfileData } from '@/components/ProfileSetup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Heart, Brain, Target, Hash } from 'lucide-react';

interface NumerologyNumbersProps {
  profile: ProfileData;
}

export function NumerologyNumbers({ profile }: NumerologyNumbersProps) {
  const fullProfile = calculateComprehensiveProfile(
    profile.fullName,
    profile.birthDate,
    profile.birthTime,
    profile.birthLocation
  );

  const numbers = [
    { label: 'Expression', value: fullProfile.expressionNumber, icon: Heart, color: 'text-pink-9' },
    { label: 'Soul Urge', value: fullProfile.soulUrgeNumber, icon: Sparkles, color: 'text-violet-9' },
    { label: 'Personality', value: fullProfile.personalityNumber, icon: Brain, color: 'text-blue-9' },
    { label: 'Maturity', value: fullProfile.maturityNumber, icon: Target, color: 'text-green-9' },
  ];

  return (
    <Card variant="frosted" className="overflow-hidden relative" data-testid="card-numerology-numbers">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-a2 to-transparent pointer-events-none" />
      
      <CardHeader className="relative pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-8 to-amber-9 flex items-center justify-center">
            <Hash className="w-5 h-5 text-gray-1" />
          </div>
          <CardTitle className="text-4">Core Numbers</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="relative">
        <div className="grid grid-cols-2 gap-3">
          {numbers.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="text-center p-4 rounded-md bg-gray-a3 border border-gray-5/30">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-5 font-semibold" data-testid={`text-${label.toLowerCase().replace(' ', '-')}`}>
                  {value}
                </span>
              </div>
              <p className="text-1 text-gray-10">{label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
