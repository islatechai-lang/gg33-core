import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import {
  calculateComprehensiveProfile,
  getNumberMeaning
} from '@/lib/numerology';
import { ProfileData } from '@/components/ProfileSetup';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, Brain, Target, Calendar, Star, Zap, Hash, Sun, TrendingUp, ChevronRight, Lock, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { displayUTCDate } from '@shared/dateUtils';

interface WhopUserData {
  profilePictureUrl: string | null;
  username: string;
  name: string | null;
}

interface ProfileOverviewProps {
  profile: ProfileData;
  whopUser?: WhopUserData | null;
  isPro?: boolean;
}

function getWesternZodiacImage(sign: string): string {
  const signLower = sign.toLowerCase();
  return `/images/${signLower}.png?v=2`;
}

function getChineseZodiacImage(animal: string): string {
  const animalLower = animal.toLowerCase();
  return `/images/${animalLower}.png?v=2`;
}

interface NumberCardProps {
  number: number;
  label: string;
  type: string;
  icon: typeof Star;
  iconColor: string;
  bgColor: string;
  onClick: () => void;
}

function NumberCard({ number, label, type, icon: Icon, iconColor, bgColor, onClick }: NumberCardProps) {
  return (
    <button
      onClick={onClick}
      className="text-center p-2 sm:p-3 rounded-lg bg-gray-a3 hover-elevate active-elevate-2 cursor-pointer transition-all group relative"
      data-testid={`button-${type}-number`}
    >
      <div className={`w-8 h-8 sm:w-9 sm:h-9 mx-auto mb-2 rounded-lg ${bgColor} flex items-center justify-center`}>
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <p className="text-4 sm:text-5 font-bold text-gray-12">{number}</p>
      <p className="text-0 sm:text-1 text-gray-10 mt-1">{label}</p>
      <ChevronRight className="w-3 h-3 text-gray-8 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

interface MembershipInfo {
  hasMembership: boolean;
  membershipId: string | null;
  status: string | null;
  manageUrl: string | null;
  renewalPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

export function ProfileOverview({ profile, whopUser, isPro = false }: ProfileOverviewProps) {
  const [, setLocation] = useLocation();
  const fullProfile = calculateComprehensiveProfile(
    profile.fullName,
    profile.birthDate,
    profile.birthTime,
    profile.birthLocation
  );

  const { data: membership } = useQuery<MembershipInfo>({
    queryKey: ['/api/membership'],
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const lifePathMeaning = getNumberMeaning(fullProfile.lifePathNumber);
  const firstName = profile.fullName.split(' ')[0];
  const initials = profile.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const westernImage = getWesternZodiacImage(fullProfile.westernZodiac.sign);
  const chineseImage = getChineseZodiacImage(fullProfile.chineseZodiac.animal);

  return (
    <Card variant="frosted" className="overflow-hidden relative" data-testid="card-profile-overview">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-a2 via-transparent to-transparent pointer-events-none" />

      <CardContent className="relative p-6 sm:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-stretch justify-between gap-4">
            <div className="flex items-center gap-4">
              {whopUser?.profilePictureUrl ? (
                <Avatar className="w-16 h-16 rounded-xl flex-shrink-0">
                  <AvatarImage
                    src={whopUser.profilePictureUrl}
                    alt={whopUser.name || firstName}
                    className="object-cover"
                  />
                  <AvatarFallback className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-8 to-amber-9 text-white text-xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-8 to-amber-9 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-white">{initials}</span>
                </div>
              )}
              <div className="min-w-0">
                <p className="text-2 text-gray-10">Welcome back,</p>
                <h2 className="text-6 font-bold text-gray-12 truncate" data-testid="text-user-name">{firstName}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4 text-gray-9" />
                  <p className="text-2 text-gray-10">
                    {displayUTCDate(profile.birthDate, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-4 px-5 py-3 rounded-xl bg-gradient-to-br from-amber-a3 to-amber-a2 border border-amber-a4">
                <p className="text-0 text-amber-10 uppercase tracking-widest font-medium">Life Path</p>
                <span className="text-6 font-bold text-amber-11 leading-none" data-testid="text-life-path-number">
                  {fullProfile.lifePathNumber}
                </span>
                <div className="text-left border-l border-amber-a4 pl-4">
                  <p className="text-3 font-semibold text-gray-12 leading-tight">{lifePathMeaning.title}</p>
                  <p className="text-1 text-gray-10">{lifePathMeaning.keywords[0]}</p>
                </div>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-gray-a3 to-gray-a2 border border-gray-a4">
              <p className="text-1 text-gray-9 uppercase tracking-widest font-medium mb-1">Energy Signature</p>
              <h3 className="text-4 sm:text-5 font-bold gradient-text" data-testid="text-energy-signature">
                {fullProfile.energySignature}
              </h3>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-a3 border border-gray-a4">
              <img
                src={westernImage}
                alt={fullProfile.westernZodiac.sign}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-1 text-gray-9 uppercase tracking-wider font-medium">Western Zodiac</p>
                <p className="text-3 font-semibold text-gray-12">{fullProfile.westernZodiac.sign}</p>
                <p className="text-2 text-gray-10">{fullProfile.westernZodiac.element} · {fullProfile.westernZodiac.modality}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-a3 border border-gray-a4">
              <img
                src={chineseImage}
                alt={fullProfile.chineseZodiac.animal}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-1 text-gray-9 uppercase tracking-wider font-medium">Chinese Zodiac</p>
                <p className="text-3 font-semibold text-gray-12">{fullProfile.chineseZodiac.animal}</p>
                <p className="text-2 text-gray-10">{fullProfile.chineseZodiac.element} · {fullProfile.chineseZodiac.yinYang}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl bg-gray-a2 border border-gray-a4 p-4 sm:p-5 relative">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <Hash className="w-4 h-4 text-violet-9" />
                <p className="text-2 font-semibold text-gray-11 uppercase tracking-wider">Core Numbers</p>
                {!isPro && (
                  <span className="ml-auto flex items-center gap-1 text-0 text-amber-9">
                    <Lock className="w-3 h-3" />
                    Pro
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                <NumberCard
                  number={fullProfile.lifePathNumber}
                  label="Life Path"
                  type="lifepath"
                  icon={Star}
                  iconColor="text-amber-9"
                  bgColor="bg-amber-a3"
                  onClick={() => setLocation(`/number/lifepath/${fullProfile.lifePathNumber}`)}
                />
                <NumberCard
                  number={fullProfile.attitudeNumber}
                  label="Attitude"
                  type="attitude"
                  icon={Zap}
                  iconColor="text-green-9"
                  bgColor="bg-green-a3"
                  onClick={() => setLocation(`/number/attitude/${fullProfile.attitudeNumber}`)}
                />
                <NumberCard
                  number={fullProfile.generationNumber}
                  label="Generation"
                  type="generation"
                  icon={TrendingUp}
                  iconColor="text-blue-9"
                  bgColor="bg-blue-a3"
                  onClick={() => setLocation(`/number/generation/${fullProfile.generationNumber}`)}
                />
                <NumberCard
                  number={fullProfile.dayOfBirthNumber}
                  label="Day of Birth"
                  type="dayofbirth"
                  icon={Sun}
                  iconColor="text-orange-9"
                  bgColor="bg-orange-a3"
                  onClick={() => setLocation(`/number/dayofbirth/${fullProfile.dayOfBirthNumber}`)}
                />
              </div>
            </div>

            <div className="rounded-xl bg-gray-a2 border border-gray-a4 p-4 sm:p-5 relative">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <Sparkles className="w-4 h-4 text-pink-9" />
                <p className="text-2 font-semibold text-gray-11 uppercase tracking-wider">Name Numbers</p>
                {!isPro && (
                  <span className="ml-auto flex items-center gap-1 text-0 text-amber-9">
                    <Lock className="w-3 h-3" />
                    Pro
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                <NumberCard
                  number={fullProfile.expressionNumber}
                  label="Expression"
                  type="expression"
                  icon={Heart}
                  iconColor="text-pink-9"
                  bgColor="bg-pink-a3"
                  onClick={() => setLocation(`/number/expression/${fullProfile.expressionNumber}`)}
                />
                <NumberCard
                  number={fullProfile.soulUrgeNumber}
                  label="Soul Urge"
                  type="soulurge"
                  icon={Sparkles}
                  iconColor="text-violet-9"
                  bgColor="bg-violet-a3"
                  onClick={() => setLocation(`/number/soulurge/${fullProfile.soulUrgeNumber}`)}
                />
                <NumberCard
                  number={fullProfile.personalityNumber}
                  label="Personality"
                  type="personality"
                  icon={Brain}
                  iconColor="text-cyan-9"
                  bgColor="bg-cyan-a3"
                  onClick={() => setLocation(`/number/personality/${fullProfile.personalityNumber}`)}
                />
                <NumberCard
                  number={fullProfile.maturityNumber}
                  label="Maturity"
                  type="maturity"
                  icon={Target}
                  iconColor="text-teal-9"
                  bgColor="bg-teal-a3"
                  onClick={() => setLocation(`/number/maturity/${fullProfile.maturityNumber}`)}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
