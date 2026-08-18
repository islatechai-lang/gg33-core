import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigation } from '@/components/Navigation';
import { StarField } from '@/components/StarField';
import { BirthChartWheel } from '@/components/BirthChartWheel';
import {
  calculateNatalChart,
  generateChartSynthesis,
  NatalChartData,
  ChartSynthesis
} from '@/lib/astrologyCalculations';
import { parseUTCDate } from '@shared/dateUtils';
import { useAuth } from '@/context/AuthContext';
import { UpgradeModal } from '@/components/UpgradeModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  Sun,
  Moon,
  Compass,
  Layers,
  Flame,
  Mountain,
  Wind,
  Droplets,
  Zap,
  Shield,
  Crown,
  Heart,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface MembershipInfo {
  hasMembership: boolean;
  membershipId: string | null;
  status: string | null;
  manageUrl: string | null;
}

export default function BirthChartPage() {
  const { dbUser } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const { data: membership } = useQuery<MembershipInfo>({
    queryKey: ['/api/membership'],
    staleTime: 0,
    refetchOnWindowFocus: true,
    enabled: !!dbUser,
  });

  const isPro = dbUser?.isPro ?? membership?.hasMembership ?? false;

  // Compute Natal Chart from user profile data
  const chartData: NatalChartData | null = useMemo(() => {
    if (!dbUser) return null;
    const bDate = parseUTCDate(dbUser.birthDate);
    const bTime = dbUser.birthTime || '12:00';
    const bLocation = dbUser.birthLocation || 'Unknown Location';
    return calculateNatalChart(bDate, bTime, bLocation);
  }, [dbUser]);

  // Compute Plain-English Synthesis
  const synthesis: ChartSynthesis | null = useMemo(() => {
    if (!chartData) return null;
    return generateChartSynthesis(chartData);
  }, [chartData]);

  if (!chartData || !synthesis) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <StarField />
        <Navigation />
        <p className="text-zinc-400">Calculating your astrological birth chart...</p>
      </div>
    );
  }

  return (
    <>
      <StarField />
      <Navigation />

      <main className="pt-20 pb-16 px-4 min-h-screen">
        <div className="w-full max-w-6xl mx-auto space-y-8">
          {/* Header Banner */}
          <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-zinc-950 via-zinc-900 to-amber-950/20 border border-zinc-800 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-500/10 border-amber-500/30 text-amber-400 text-xs px-3 py-1 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Western Astrological Ephemeris
                  </Badge>
                  {isPro && (
                    <Badge className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 text-xs">
                      Pro Unlocked
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-100 tracking-tight">
                  {dbUser?.fullName ? `${dbUser.fullName}'s` : 'Your'} Natal Birth Chart
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    {chartData.birthDateFormatted}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {chartData.birthTimeFormatted}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    {chartData.birthLocation}
                  </span>
                </div>
              </div>

              {/* Big 3 Quick Pill */}
              <div className="flex items-center gap-3 bg-zinc-950/80 p-3 rounded-2xl border border-zinc-800/80 backdrop-blur-md self-start md:self-auto">
                <div className="text-center px-3 py-1 border-r border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold">Sun ☉</span>
                  <span className="text-sm font-bold text-amber-400">{chartData.sun.sign}</span>
                </div>
                <div className="text-center px-3 py-1 border-r border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold">Moon ☽</span>
                  <span className="text-sm font-bold text-indigo-400">{chartData.moon.sign}</span>
                </div>
                <div className="text-center px-3 py-1">
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold">Rising ↗</span>
                  <span className="text-sm font-bold text-cyan-400">{chartData.rising.sign}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Core Archetype Summary Blueprint */}
          <Card className="bg-gradient-to-r from-amber-500/10 via-zinc-950 to-zinc-950 border border-amber-500/40 shadow-2xl p-6 sm:p-8 relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Crown className="w-4 h-4" /> Your Cosmic Archetype
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-100">
                    {synthesis.archetypeTitle}
                  </h2>
                </div>
                <Badge variant="outline" className="border-amber-500/40 text-amber-300 bg-amber-500/10 text-xs px-3 py-1 font-semibold">
                  {chartData.elementBalance.dominantElement} Dominant • {chartData.modalityBalance.dominantModality}
                </Badge>
              </div>

              <p className="text-sm sm:text-base text-zinc-200 font-medium italic">
                "{synthesis.tagline}"
              </p>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pt-2 border-t border-zinc-800/80">
                {synthesis.coreIdentitySummary}
              </p>
            </div>
          </Card>

          {/* Plain English Deep Insights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Superpowers Card */}
            <Card className="bg-zinc-950/80 border-zinc-800 backdrop-blur-xl p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-100">Your Core Superpowers</h3>
                  <p className="text-[11px] text-zinc-400">Natural gifts encoded into your planetary alignment</p>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                {synthesis.superpowers.map((sp, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800/70 space-y-1">
                    <span className="text-xs font-bold text-amber-400 block">{sp.title}</span>
                    <p className="text-xs text-zinc-300 leading-relaxed">{sp.desc}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* 2. Karmic Growth & Shadow to Master */}
            <Card className="bg-zinc-950/80 border-zinc-800 backdrop-blur-xl p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-100">Karmic Shadow & Growth Edge</h3>
                  <p className="text-[11px] text-zinc-400">The friction point you are destined to master</p>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800/70 space-y-1.5">
                  <span className="text-xs font-bold text-red-300 block">{synthesis.karmicChallenge.title}</span>
                  <p className="text-xs text-zinc-300 leading-relaxed">{synthesis.karmicChallenge.challenge}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> The Breakthrough Solution
                  </span>
                  <p className="text-xs text-zinc-200 leading-relaxed">{synthesis.karmicChallenge.solution}</p>
                </div>
              </div>
            </Card>

            {/* 3. Love & Relationship Dynamics */}
            <Card className="bg-zinc-950/80 border-zinc-800 backdrop-blur-xl p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-100">Love, Chemistry & Relationships</h3>
                  <p className="text-[11px] text-zinc-400">How you connect, express affection, and choose partners</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800/70 space-y-2">
                <span className="text-xs font-bold text-pink-400 block">{synthesis.relationshipStyle.title}</span>
                <p className="text-xs text-zinc-300 leading-relaxed">{synthesis.relationshipStyle.desc}</p>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Your Relationship Non-Negotiables:</span>
                <ul className="space-y-1 text-xs text-zinc-300">
                  {synthesis.relationshipStyle.needs.map((need, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                      <span>{need}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            {/* 4. Career Calling & Wealth Potential */}
            <Card className="bg-zinc-950/80 border-zinc-800 backdrop-blur-xl p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-100">Career Trajectory & Wealth Calling</h3>
                  <p className="text-[11px] text-zinc-400">Midheaven direction & professional authority</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800/70 space-y-1.5">
                <span className="text-xs font-bold text-cyan-400 block">{synthesis.careerAndCalling.title}</span>
                <p className="text-xs text-zinc-300 leading-relaxed">{synthesis.careerAndCalling.path}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 space-y-1">
                <span className="text-xs font-bold text-cyan-300 block">Strategic Career Advice</span>
                <p className="text-xs text-zinc-200 leading-relaxed">{synthesis.careerAndCalling.advice}</p>
              </div>
            </Card>
          </div>

          {/* 3 Golden Rules for Daily Alignment */}
          <Card className="bg-zinc-950/90 border border-zinc-800 p-6 sm:p-7 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm sm:text-base">
              <Sparkles className="w-4 h-4" />
              <span>3 Golden Rules to Master Your Chart's Energy</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {synthesis.alignmentRules.map((rule, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-extrabold text-amber-400 font-mono">RULE 0{idx + 1}</span>
                    <p className="text-xs text-zinc-300 leading-relaxed">{rule}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* The Big Three Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Sun Sign Card */}
            <Card className="bg-gradient-to-b from-amber-500/10 via-zinc-950 to-zinc-950 border-amber-500/30 shadow-xl overflow-hidden hover:border-amber-500/50 transition-all">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Sun className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className="border-amber-500/30 text-amber-400 text-xs">
                    {chartData.sun.formattedDegree}
                  </Badge>
                </div>
                <div>
                  <span className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider block">Sun Sign • Core Vitality</span>
                  <h3 className="text-lg font-bold text-zinc-100">{chartData.sun.sign}</h3>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Your Sun in {chartData.sun.sign} represents your fundamental life energy, sovereign purpose, and conscious willpower. It is how you radiate strength into the world.
                </p>
              </CardContent>
            </Card>

            {/* Moon Sign Card */}
            <Card className="bg-gradient-to-b from-indigo-500/10 via-zinc-950 to-zinc-950 border-indigo-500/30 shadow-xl overflow-hidden hover:border-indigo-500/50 transition-all">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                    <Moon className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 text-xs">
                    {chartData.moon.formattedDegree}
                  </Badge>
                </div>
                <div>
                  <span className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider block">Moon Sign • Inner Soul</span>
                  <h3 className="text-lg font-bold text-zinc-100">{chartData.moon.sign}</h3>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Your Moon in {chartData.moon.sign} governs your emotional sanctuary, subconscious instincts, and private feeling realm. It reveals what fulfills you deep within.
                </p>
              </CardContent>
            </Card>

            {/* Ascendant (Rising) Card */}
            <Card className="bg-gradient-to-b from-cyan-500/10 via-zinc-950 to-zinc-950 border-cyan-500/30 shadow-xl overflow-hidden hover:border-cyan-500/50 transition-all">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <Compass className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 text-xs">
                    {chartData.rising.formattedDegree}
                  </Badge>
                </div>
                <div>
                  <span className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider block">Ascendant • Outer Aura</span>
                  <h3 className="text-lg font-bold text-zinc-100">{chartData.rising.sign} Rising</h3>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Your Ascendant in {chartData.rising.sign} shapes your outer persona, physical presence, and the lens through which you instinctively approach new beginnings.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Chart Wheel Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-amber-400" />
                  Interactive Natal Wheel & Aspects
                </h2>
                <p className="text-xs text-zinc-400">
                  Geometric aspect chords connect your planets across the 12 celestial houses.
                </p>
              </div>
            </div>

            <BirthChartWheel chart={chartData} isPro={isPro} />
          </div>

          {/* Detailed Planetary Placements Table */}
          <Card className="bg-zinc-950/80 border-zinc-800/80 backdrop-blur-xl shadow-2xl overflow-hidden">
            <CardHeader className="p-5 sm:p-6 border-b border-zinc-800/60">
              <CardTitle className="text-base sm:text-lg font-bold text-zinc-100 flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                Complete Planetary Placements
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/40 text-zinc-400 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 px-4 sm:px-6">Planet / Point</th>
                    <th className="py-3.5 px-4">Sign & Degree</th>
                    <th className="py-3.5 px-4">House</th>
                    <th className="py-3.5 px-4 hidden sm:table-cell">Element</th>
                    <th className="py-3.5 px-4 hidden md:table-cell">Modality</th>
                    <th className="py-3.5 px-4 hidden lg:table-cell">Core Meaning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {chartData.planets.map((planet) => (
                    <tr key={planet.id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 flex items-center gap-2.5 font-bold text-zinc-100">
                        <span className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 font-serif text-sm">
                          {planet.glyph}
                        </span>
                        <div>
                          <span>{planet.name}</span>
                          {planet.isRetrograde && (
                            <span className="ml-1.5 text-[10px] text-red-400 font-mono font-normal">
                              ℞
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-amber-400/90">
                        {planet.formattedDegree}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-zinc-200">
                        {planet.house}{planet.house === 1 ? 'st' : planet.house === 2 ? 'nd' : planet.house === 3 ? 'rd' : 'th'} House
                      </td>
                      <td className="py-3.5 px-4 hidden sm:table-cell">
                        <Badge variant="outline" className="text-[10px]" style={{ color: planet.color, borderColor: `${planet.color}40` }}>
                          {planet.element}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-400 hidden md:table-cell">
                        {planet.modality}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-400 text-[11px] max-w-xs truncate hidden lg:table-cell">
                        {planet.keywords}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Elemental & Modalities Balance Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Elements Balance */}
            <Card className="bg-zinc-950/80 border-zinc-800/80 backdrop-blur-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  Elemental Alchemy
                </h3>
                <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-xs">
                  Dominant: {chartData.elementBalance.dominantElement}
                </Badge>
              </div>

              <div className="space-y-3 pt-2">
                {/* Fire */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-red-400 font-semibold">
                      <Flame className="w-3.5 h-3.5" /> Fire (Passion & Drive)
                    </span>
                    <span className="font-mono text-zinc-300">{chartData.elementBalance.fire}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full transition-all duration-500" style={{ width: `${chartData.elementBalance.fire}%` }} />
                  </div>
                </div>

                {/* Earth */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <Mountain className="w-3.5 h-3.5" /> Earth (Structure & Practicality)
                    </span>
                    <span className="font-mono text-zinc-300">{chartData.elementBalance.earth}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${chartData.elementBalance.earth}%` }} />
                  </div>
                </div>

                {/* Air */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                      <Wind className="w-3.5 h-3.5" /> Air (Intellect & Communication)
                    </span>
                    <span className="font-mono text-zinc-300">{chartData.elementBalance.air}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full transition-all duration-500" style={{ width: `${chartData.elementBalance.air}%` }} />
                  </div>
                </div>

                {/* Water */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                      <Droplets className="w-3.5 h-3.5" /> Water (Emotion & Intuition)
                    </span>
                    <span className="font-mono text-zinc-300">{chartData.elementBalance.water}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${chartData.elementBalance.water}%` }} />
                  </div>
                </div>
              </div>
            </Card>

            {/* Modalities Balance */}
            <Card className="bg-zinc-950/80 border-zinc-800/80 backdrop-blur-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Quadruplicity Modalities
                </h3>
                <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-xs">
                  Dominant: {chartData.modalityBalance.dominantModality}
                </Badge>
              </div>

              <div className="space-y-3 pt-2">
                {/* Cardinal */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-amber-400 font-semibold">Cardinal (Initiating & Pioneering)</span>
                    <span className="font-mono text-zinc-300">{chartData.modalityBalance.cardinal}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${chartData.modalityBalance.cardinal}%` }} />
                  </div>
                </div>

                {/* Fixed */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-violet-400 font-semibold">Fixed (Perseverance & Mastery)</span>
                    <span className="font-mono text-zinc-300">{chartData.modalityBalance.fixed}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 rounded-full transition-all duration-500" style={{ width: `${chartData.modalityBalance.fixed}%` }} />
                  </div>
                </div>

                {/* Mutable */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-teal-400 font-semibold">Mutable (Adaptability & Flow)</span>
                    <span className="font-mono text-zinc-300">{chartData.modalityBalance.mutable}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full transition-all duration-500" style={{ width: `${chartData.modalityBalance.mutable}%` }} />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Major Aspects Grid Breakdown */}
          <Card className="bg-zinc-950/80 border-zinc-800/80 backdrop-blur-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-zinc-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Active Astrological Aspects ({chartData.aspects.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {chartData.aspects.map((asp) => (
                <div
                  key={asp.id}
                  className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-2 hover:border-amber-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-sm text-zinc-100">
                      <span className="text-base" style={{ color: asp.color }}>{asp.symbol}</span>
                      <span>{asp.planet1.name} {asp.aspectType} {asp.planet2.name}</span>
                    </div>
                    <Badge variant="outline" style={{ borderColor: `${asp.color}50`, color: asp.color }} className="text-[10px]">
                      orb {asp.formattedOrb}
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {asp.interpretation}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>

      <UpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
    </>
  );
}
