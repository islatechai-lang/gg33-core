import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import {
  calculateComprehensiveProfile,
  getNumberMeaning
} from '@/lib/numerology';
import { ProfileData } from '@/components/ProfileSetup';
import { EditProfileModal } from '@/components/EditProfileModal';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, Brain, Target, Calendar, Star, Zap, Hash, Sun, TrendingUp, ChevronRight, Lock, Crown, Pencil, Clock, MapPin } from 'lucide-react';
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
      className="text-center p-2.5 sm:p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-amber-400/40 cursor-pointer transition-all duration-200 group relative active:scale-95 shadow-sm hover:shadow-[0_8px_25px_rgba(0,0,0,0.4)]"
      data-testid={`button-${type}-number`}
    >
      <div className={`w-8.5 h-8.5 sm:w-10 sm:h-10 mx-auto mb-2 rounded-xl ${bgColor} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-200`}>
        <Icon className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${iconColor}`} />
      </div>
      <p className="text-4 sm:text-5 font-black text-zinc-100 tracking-tight">{number}</p>
      <p className="text-[10px] sm:text-xs text-zinc-400 mt-1 font-medium truncate">{label}</p>
      <ChevronRight className="w-3 h-3 text-zinc-400 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
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
  const [showEditModal, setShowEditModal] = useState(false);

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
    <>
      <Card variant="frosted" className="overflow-hidden relative" data-testid="card-profile-overview">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-a2 via-transparent to-transparent pointer-events-none" />

        <CardContent className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-stretch justify-between gap-4">
              <div className="flex items-center gap-4">
                {whopUser?.profilePictureUrl ? (
                  <Avatar className="w-16 h-16 rounded-2xl flex-shrink-0 ring-2 ring-amber-400/50 shadow-[0_0_24px_rgba(245,158,11,0.25)]">
                    <AvatarImage
                      src={whopUser.profilePictureUrl}
                      alt={whopUser.name || firstName}
                      className="object-cover rounded-2xl"
                    />
                    <AvatarFallback className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-950 text-xl font-black">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0 ring-2 ring-amber-400/50 shadow-[0_0_24px_rgba(245,158,11,0.25)]">
                    <span className="text-xl font-black text-zinc-950">{initials}</span>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Welcome back,</p>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-5 sm:text-6 font-extrabold text-white tracking-tight truncate" data-testid="text-user-name">
                      {profile.fullName || firstName}
                    </h2>
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="p-1.5 rounded-xl bg-white/[0.06] hover:bg-amber-500/20 border border-white/10 hover:border-amber-400/40 text-zinc-400 hover:text-amber-300 transition-all cursor-pointer active:scale-90"
                      title="Edit Profile Information"
                      aria-label="Edit Profile"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      {displayUTCDate(profile.birthDate, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {profile.birthTime && profile.birthTime !== 'unknown' && profile.birthTime !== '12:00' && (
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        {profile.birthTime}
                      </span>
                    )}
                    {profile.birthLocation && profile.birthLocation !== 'Unknown Location' && profile.birthLocation !== 'Unknown' && (
                      <span className="flex items-center gap-1.5 font-medium truncate max-w-[180px]">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        {profile.birthLocation}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 1. Life Path & Energy Signature Side by Side */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
              {/* Life Path */}
              <div className="flex items-center gap-2.5 sm:gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-amber-500/[0.14] to-amber-600/[0.04] border border-amber-500/30 shadow-[0_4px_20px_rgba(245,158,11,0.12)] backdrop-blur-xl min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-zinc-950 font-black text-xl sm:text-2xl shadow-[0_4px_16px_rgba(245,158,11,0.35)] flex items-center justify-center flex-shrink-0" data-testid="text-life-path-number">
                  {fullProfile.lifePathNumber}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-xs text-amber-400 uppercase tracking-widest font-bold truncate">Life Path</p>
                  <p className="text-xs sm:text-sm font-extrabold text-white truncate leading-tight">{lifePathMeaning.title}</p>
                  <p className="text-[10px] sm:text-xs text-zinc-400 truncate">{lifePathMeaning.keywords[0]}</p>
                </div>
              </div>

              {/* Energy Signature */}
              <div className="flex flex-col justify-center p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 shadow-sm backdrop-blur-xl min-w-0 transition-all">
                <p className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-widest font-semibold truncate">Energy Signature</p>
                <h3 className="text-xs sm:text-sm md:text-base font-extrabold gradient-text truncate leading-tight mt-0.5 sm:mt-1" data-testid="text-energy-signature">
                  {fullProfile.energySignature}
                </h3>
                <p className="text-[10px] sm:text-xs text-zinc-400 truncate mt-0.5">Core vibration</p>
              </div>
            </div>

            {/* 2. Western Zodiac & Chinese Zodiac Side by Side */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
              <div className="flex items-center gap-2.5 sm:gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 shadow-sm backdrop-blur-xl min-w-0 transition-all group hover:-translate-y-0.5">
                <img
                  src={westernImage}
                  alt={fullProfile.westernZodiac.sign}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover flex-shrink-0 shadow-md group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-wider font-semibold truncate">Western Zodiac</p>
                  <p className="text-xs sm:text-sm font-bold text-white truncate">{fullProfile.westernZodiac.sign}</p>
                  <p className="text-[10px] sm:text-xs text-zinc-400 truncate">{fullProfile.westernZodiac.element} · {fullProfile.westernZodiac.modality}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 shadow-sm backdrop-blur-xl min-w-0 transition-all group hover:-translate-y-0.5">
                <img
                  src={chineseImage}
                  alt={fullProfile.chineseZodiac.animal}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover flex-shrink-0 shadow-md group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-wider font-semibold truncate">Chinese Zodiac</p>
                  <p className="text-xs sm:text-sm font-bold text-white truncate">{fullProfile.chineseZodiac.animal}</p>
                  <p className="text-[10px] sm:text-xs text-zinc-400 truncate">{fullProfile.chineseZodiac.element} · {fullProfile.chineseZodiac.yinYang}</p>
                </div>
              </div>
            </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-4 sm:p-5 relative backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <Hash className="w-4 h-4 text-violet-400" />
                <p className="text-2 font-bold text-zinc-300 uppercase tracking-wider">Core Numbers</p>
                {!isPro && (
                  <span className="ml-auto flex items-center gap-1 text-0 text-amber-400 font-bold">
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

            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-4 sm:p-5 relative backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <p className="text-2 font-bold text-zinc-300 uppercase tracking-wider">Name Numbers</p>
                {!isPro && (
                  <span className="ml-auto flex items-center gap-1 text-0 text-amber-400 font-bold">
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

      <EditProfileModal open={showEditModal} onOpenChange={setShowEditModal} />
    </>
  );
}
