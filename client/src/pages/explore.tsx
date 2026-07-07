import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LoadingScreen } from '@/components/LoadingScreen';
import { parseUTCDate } from '@shared/dateUtils';
import { Navigation } from '@/components/Navigation';
import { StarField } from '@/components/StarField';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UpgradeModal } from '@/components/UpgradeModal';
import { Compass, TrendingUp, Calendar, Star, Globe, Heart, Loader2, MapPin, Briefcase, Users, Check, AlertCircle, X, Lock, Crown, CalendarDays, CalendarRange, Home, Car, Hash, Type, Grid, Square, Moon, Zap, Palette, Sun, UserCircle, CircleDashed } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link } from 'wouter';
import { calculateComprehensiveProfile, calculateLifePathNumber } from '@/lib/numerology';
import {
  YearlyForecastDialog, MonthlyForecastDialog, HomePickerDialog, CarsDialog,
  LuckyNumberDialog, LetterologyDialog, MatrixNumbersDialog, CueCardsDialog,
  DreamInterpreterDialog, EnergyInsightsDialog, ColorologyDialog,
  VedicAstrologyDialog, AllAboutYouDialog, SaturnInsightsDialog
} from '@/components/ExploreDialogs';
const ODIS_ID_KEY = 'gg33-odis-id';

type FeatureType = 'trending' | 'best-days' | 'celebrity' | 'travel' | 'relationship' | 'career' | 'yearly-forecast' | 'monthly-forecast' | 'home-picker' | 'cars' | 'lucky-number' | 'letterology' | 'matrix-numbers' | 'cue-cards' | 'dream-interpreter' | 'energy-insights' | 'colorology' | 'vedic-astrology' | 'all-about-you' | 'saturn-insights' | null;

interface ProfileData {
  odisId: string;
  fullName: string;
  birthDate: string;
  birthTime?: string;
  birthLocation?: string;
}

const explorations = [
  {
    id: 'trending' as FeatureType,
    title: 'Trending Energies',
    description: 'See what energy patterns are most active today',
    icon: TrendingUp,
    tag: 'Popular',
    requiresProfile: false,
  },
  {
    id: 'best-days' as FeatureType,
    title: 'Best Days This Month',
    description: 'Find your optimal days for key activities',
    icon: Calendar,
    tag: 'Planning',
    requiresProfile: true,
    isNew: true,
  },
  {
    id: 'yearly-forecast' as FeatureType,
    title: 'Yearly Forecast',
    description: 'Cosmic themes and cycles for your year ahead',
    icon: CalendarDays,
    tag: 'Planning',
    requiresProfile: true,
    isNew: true,
  },
  {
    id: 'monthly-forecast' as FeatureType,
    title: 'Monthly Forecast',
    description: 'Detailed monthly predictions and guidance',
    icon: CalendarRange,
    tag: 'Planning',
    requiresProfile: true,
    isNew: true,
  },
  {
    id: 'celebrity' as FeatureType,
    title: 'Celebrity Matches',
    description: 'Discover which celebrities share your energy',
    icon: Star,
    tag: 'Fun',
    requiresProfile: true,
  },
  {
    id: 'letterology' as FeatureType,
    title: 'Letterology',
    description: 'The hidden meaning behind the letters in your name',
    icon: Type,
    tag: 'Insights',
    requiresProfile: true,
    isNew: true,
  },
  {
    id: 'lucky-number' as FeatureType,
    title: 'Lucky Numbers',
    description: 'Your personal numbers for manifestation',
    icon: Hash,
    tag: 'Fun',
    requiresProfile: true,
    isNew: true,
  },
  {
    id: 'matrix-numbers' as FeatureType,
    title: 'Matrix Numbers',
    description: 'Decode your personal matrix sequence',
    icon: Grid,
    tag: 'Insights',
    requiresProfile: true,
    isNew: true,
  },
  {
    id: 'travel' as FeatureType,
    title: 'Travel Destinations',
    description: 'Cities that align with your energy signature',
    icon: Globe,
    tag: 'Travel',
    requiresProfile: true,
  },
  {
    id: 'relationship' as FeatureType,
    title: 'Relationship Patterns',
    description: 'Understanding your compatibility tendencies',
    icon: Heart,
    tag: 'Insights',
    requiresProfile: true,
  },
  {
    id: 'career' as FeatureType,
    title: 'Career Alignment',
    description: 'Industries and roles that match your energy',
    icon: Compass,
    tag: 'Career',
    requiresProfile: true,
  },
  {
    id: 'home-picker' as FeatureType,
    title: 'Home Picker',
    description: 'Find places to live that match your vibe',
    icon: Home,
    tag: 'Lifestyle',
    requiresProfile: true,
    isNew: true,
  },
  {
    id: 'cars' as FeatureType,
    title: 'Cars',
    description: 'Vehicles that align with your energetic signature',
    icon: Car,
    tag: 'Lifestyle',
    requiresProfile: true,
    isNew: true,
  },
  {
    id: 'cue-cards' as FeatureType,
    title: 'Cue Cards',
    description: 'Draw daily cards for immediate guidance',
    icon: Square,
    tag: 'Spirit',
    requiresProfile: false,
    isNew: true,
  },
  {
    id: 'dream-interpreter' as FeatureType,
    title: 'Dream Interpreter',
    description: 'Understand your subconscious messages',
    icon: Moon,
    tag: 'Spirit',
    requiresProfile: false,
    isNew: true,
  },
  {
    id: 'energy-insights' as FeatureType,
    title: 'Energy Insights',
    description: 'Deep dive into your core energetic makeup',
    icon: Zap,
    tag: 'Insights',
    requiresProfile: true,
    isNew: true,
  },
  {
    id: 'colorology' as FeatureType,
    title: 'Colorology',
    description: 'Colors that boost your aura and success',
    icon: Palette,
    tag: 'Fun',
    requiresProfile: true,
    isNew: true,
  },
  {
    id: 'vedic-astrology' as FeatureType,
    title: 'Vedic Astrology',
    description: 'Ancient Eastern astrological wisdom for you',
    icon: Sun,
    tag: 'Insights',
    requiresProfile: true,
    isNew: true,
  },
  {
    id: 'all-about-you' as FeatureType,
    title: 'All About You',
    description: 'Comprehensive summary of your cosmic DNA',
    icon: UserCircle,
    tag: 'Profile',
    requiresProfile: true,
    isNew: true,
  },
  {
    id: 'saturn-insights' as FeatureType,
    title: 'Saturn Insights',
    description: 'Lessons and karmic cycles of your Saturn return',
    icon: CircleDashed,
    tag: 'Insights',
    requiresProfile: true,
    isNew: true,
  },
];

function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse" data-testid="loading-skeleton">
      <div className="h-6 bg-gray-a3 rounded w-3/4" />
      <div className="h-4 bg-gray-a3 rounded w-1/2" />
      <div className="space-y-2 mt-4">
        <div className="h-20 bg-gray-a3 rounded" />
        <div className="h-20 bg-gray-a3 rounded" />
        <div className="h-20 bg-gray-a3 rounded" />
      </div>
    </div>
  );
}

function TrendingEnergiesDialog({ open, onClose, profileData }: { open: boolean; onClose: () => void; profileData: ProfileData | null }) {
  const birthDate = profileData?.birthDate ? parseUTCDate(profileData.birthDate) : null;
  const lifePath = birthDate ? calculateLifePathNumber(birthDate) : null;

  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/explore/trending-energies', lifePath],
    queryFn: async () => {
      const url = new URL('/api/explore/trending-energies', window.location.origin);
      if (lifePath) url.searchParams.append('lp', lifePath.toString());
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Failed to load');
      return res.json();
    },
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden border-none bg-gray-1 shadow-2xl" data-testid="dialog-trending-energies">
        <div className="flex flex-col h-full max-h-[90vh]">
        <div className="p-6 pb-4 bg-gradient-to-br from-amber-a3 to-transparent border-b border-amber-a4">
        <DialogHeader className="p-0 space-y-1">
          <DialogTitle className="flex items-center gap-3 text-2xl font-black tracking-tight text-gray-12">
            <div className="p-2 bg-amber-9 rounded-lg text-white shadow-lg shadow-amber-9/20">
            <TrendingUp className="w-6 h-6" />
            </div>
            Trending Energies
          </DialogTitle>
          <DialogDescription className="text-gray-11 font-medium ml-12">What energy patterns are most active today</DialogDescription>
        </DialogHeader>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-8">
          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="text-red-9 flex items-center gap-2" data-testid="error-trending">
              <AlertCircle className="w-4 h-4" />
              Failed to load trending energies
            </div>
          ) : data ? (
            <div className="space-y-6" data-testid="content-trending">
              <div className="flex flex-col gap-4 p-5 bg-amber-a2 rounded-xl border-2 border-amber-a4 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-amber-11 uppercase tracking-widest">Universal Day Number</div>
                  <div className="text-xs text-gray-10 font-mono">{data.date}</div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-6xl font-black text-amber-9 drop-shadow-sm" data-testid="text-universal-day">{data.universalDay}</div>
                  <div className="flex-1">
                    <div className="text-xl font-bold text-gray-12" data-testid="text-day-title">{data.todayTitle}</div>
                    <div className="text-md text-amber-11 font-medium italic" data-testid="text-day-theme">{data.todayTheme}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-9" />
                  Top Life Paths in Database
                </h3>
                <div className="grid gap-2">
                  {data.topLifePaths?.map((lp: { number: number; count: number; title: string; theme: string }, i: number) => (
                    <div key={lp.number} className="flex items-center justify-between p-3 bg-gray-a2 rounded-lg" data-testid={`card-lifepath-${lp.number}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-a3 flex items-center justify-center font-bold text-amber-9">
                          {lp.number}
                        </div>
                        <div>
                          <div className="font-medium">{lp.title}</div>
                          <div className="text-xs text-gray-11">{lp.theme}</div>
                        </div>
                      </div>
                      <Badge variant="secondary" size="sm">{lp.count.toLocaleString()} entities</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {data.personalTakeaway && (
                <div className="p-4 bg-amber-a3 rounded-lg border-2 border-amber-9 shadow-sm" data-testid="card-personal-takeaway">
                  <div className="flex items-center gap-2 mb-2 text-amber-11 font-bold">
                    <Star className="fill-amber-9 w-4 h-4" />
                    Your Daily Alignment
                  </div>
                  <p className="text-sm leading-relaxed text-gray-12 italic">
                    "{data.personalTakeaway}"
                  </p>
                </div>
              )}

              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-9" />
                  Top Elements
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.topElements?.map((el: { element: string; count: number }) => (
                    <Badge key={el.element} variant="outline" data-testid={`badge-element-${el.element}`}>
                      {el.element}: {el.count.toLocaleString()}
                    </Badge>
                  ))}
                </div>
              </div>

              {data.representativeCues?.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-9" />
                    Today's Energy Representatives
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {data.representativeCues?.map((cue: { id: number; name: string; type: string; energySignature: string }) => (
                      <div key={cue.id} className="p-2 bg-gray-a2 rounded-lg" data-testid={`card-cue-${cue.id}`}>
                        <div className="font-medium text-sm truncate">{cue.name}</div>
                        <div className="text-xs text-gray-11">{cue.type}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
          </div>
        </ScrollArea>
        </div>
      </DialogContent>
    </Dialog >
  );
}

function BestDaysDialog({ open, onClose, birthDate }: { open: boolean; onClose: () => void; birthDate: string | null }) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/explore/best-days', birthDate],
    queryFn: async () => {
      if (!birthDate) return null;
      const response = await fetch(`/api/explore/best-days/${birthDate}`);
      if (!response.ok) throw new Error('Failed to fetch best days');
      return response.json();
    },
    enabled: open && !!birthDate,
  });

  // Set initial selected day to today if in current month
  useEffect(() => {
    if (data && !selectedDay) {
      const now = new Date();
      if (data.month === now.getMonth() + 1 && data.year === now.getFullYear()) {
        setSelectedDay(now.getDate());
      } else {
        setSelectedDay(1);
      }
    }
  }, [data, selectedDay]);

  const getRatingColor = (rating: string) => {
    const r = rating.toLowerCase();
    switch (r) {
      case 'excellent': return 'bg-green-a3 border-green-a6 text-green-11';
      case 'good': return 'bg-amber-a3 border-amber-a6 text-amber-11';
      case 'challenging': return 'bg-red-a3 border-red-a6 text-red-11';
      default: return 'bg-gray-a3 border-gray-a6 text-gray-11';
    }
  };

  const selectedDayData = data?.days?.find((d: any) => d.day === selectedDay);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden border-none bg-gray-1 shadow-2xl" data-testid="dialog-best-days">
        <div className="flex flex-col h-full max-h-[90vh]">
          <div className="p-6 pb-4 bg-gradient-to-br from-amber-a3 to-transparent border-b border-amber-a4">
            <DialogHeader className="p-0 space-y-1">
              <DialogTitle className="flex items-center gap-3 text-2xl font-black tracking-tight text-gray-12">
                <div className="p-2 bg-amber-9 rounded-lg text-white shadow-lg shadow-amber-9/20">
                  <Calendar className="w-6 h-6" />
                </div>
                Best Days This Month
              </DialogTitle>
              <DialogDescription className="text-gray-11 font-medium ml-12">Your personalized cosmic roadmap based on Life Path {data?.lifePathNumber}</DialogDescription>
            </DialogHeader>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-6 space-y-8">
              {isLoading ? (
                <div className="py-12"><LoadingSkeleton /></div>
              ) : error ? (
                <div className="text-red-9 flex flex-col items-center justify-center py-12 gap-3 bg-red-a2 rounded-2xl border border-red-a4" data-testid="error-best-days">
                  <AlertCircle className="w-10 h-10 opacity-50" />
                  <div className="font-bold">Failed to load cosmic calendar</div>
                </div>
              ) : data ? (
                <div className="space-y-8" data-testid="content-best-days">
                  {/* Selected Day Focus - The "Perfect" detailed section */}
                  {selectedDayData && (
                    <div className="relative overflow-hidden rounded-3xl border-2 border-amber-a4 bg-gray-a2 backdrop-blur-xl shadow-xl group transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
                      <div className={`absolute top-0 right-0 p-4 font-black text-6xl opacity-10 select-none ${getRatingColor(selectedDayData.rating)}`}>
                        {selectedDayData.day}
                      </div>
                      <div className="p-8 flex flex-col md:flex-row gap-8 relative z-10">
                        <div className="flex-shrink-0 flex flex-col items-center justify-center w-24 h-24 rounded-2xl bg-amber-9 text-white shadow-xl shadow-amber-9/30">
                          <div className="text-3xl font-black">{selectedDayData.day}</div>
                          <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">Feb</div>
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary" className="bg-amber-a3 text-amber-11 font-bold px-3 py-1">Personal Day {selectedDayData.personalDay}</Badge>
                            <Badge className={`${getRatingColor(selectedDayData.rating)} border px-3 py-1 font-bold uppercase tracking-wider text-[10px]`}>
                              {selectedDayData.rating} Energy
                            </Badge>
                          </div>
                          <div>
                            <h2 className="text-3xl font-black text-gray-12 leading-none mb-2">{selectedDayData.theme}</h2>
                            <p className="text-gray-11 text-lg font-medium leading-relaxed">{selectedDayData.description}</p>
                          </div>
                          <div className="bg-amber-a2 border-l-4 border-amber-9 p-4 rounded-r-xl">
                            <div className="text-xs font-black text-amber-11 uppercase tracking-widest mb-1">Why this Day works for you</div>
                            <p className="text-sm text-gray-12 leading-relaxed italic font-medium">"{selectedDayData.why}"</p>
                          </div>
                          <div className="flex flex-wrap gap-2 pt-2">
                            {selectedDayData.activities.map((act: string, idx: number) => (
                              <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-gray-a2 border border-gray-a4 rounded-full text-sm font-semibold text-gray-11">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-9" />
                                {act}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Top Recommended Days */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-9" />
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-11 underline decoration-amber-9/30 underline-offset-4">Top Power Days</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {data.days?.filter((d: any) => d.rating.toLowerCase() === 'excellent' || d.rating.toLowerCase() === 'good').slice(0, 4).map((day: any) => (
                          <button
                            key={day.day}
                            onClick={() => setSelectedDay(day.day)}
                            className={`p-4 rounded-2xl border-2 text-left transition-all duration-300 hover:-translate-y-1 ${selectedDay === day.day ? 'ring-4 ring-amber-9/20 scale-[1.02]' : ''} ${getRatingColor(day.rating)}`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-2xl font-black">{day.day}</span>
                              <Badge variant="outline" className="text-[9px] font-black border-current/30">{day.personalDay}</Badge>
                            </div>
                            <div className="text-xs font-bold uppercase truncate opacity-80">{day.theme}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Full Month Calendar */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-amber-9" />
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-11 underline decoration-amber-9/30 underline-offset-4">Full Monthly Grid</h3>
                      </div>
                      <div className="p-4 bg-gray-a2 backdrop-blur-md rounded-3xl border border-gray-a4 shadow-sm">
                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                            <div key={i} className="text-[10px] text-gray-11 font-black py-1">{d}</div>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {(() => {
                            const now = new Date();
                            const isCurrentMonth = data.month === now.getMonth() + 1 && data.year === now.getFullYear();
                            const todayDate = now.getDate();
                            const firstDayOfMonth = new Date(data.year, data.month - 1, 1).getDay();

                            const emptyCells = Array(firstDayOfMonth).fill(null).map((_, j) => (
                              <div key={`empty-${j}`} className="aspect-square" />
                            ));

                            const dayCells = data.days?.map((day: any) => {
                              const isToday = isCurrentMonth && day.day === todayDate;
                              const isSelected = selectedDay === day.day;
                              return (
                                <button
                                  key={day.day}
                                  onClick={() => setSelectedDay(day.day)}
                                  className={`aspect-square rounded-xl flex items-center justify-center text-xs transition-all ${day.rating.toLowerCase() === 'excellent' ? 'bg-green-a4 text-green-11 font-black ring-1 ring-green-a6' :
                                    day.rating.toLowerCase() === 'good' ? 'bg-amber-a3 text-amber-11 font-bold border border-amber-a5' :
                                      'bg-gray-a2 text-gray-12'
                                    } ${isToday ? 'ring-2 ring-amber-9 ring-offset-2' : ''} ${isSelected ? 'ring-2 ring-gray-12 ring-offset-2 scale-110 z-10 shadow-lg' : 'hover:scale-105'} `}
                                  title={`${day.theme} (Personal Day ${day.personalDay})${isToday ? ' - Today' : ''}`}
                                >
                                  {day.day}
                                </button>
                              );
                            }) || [];

                            return [...emptyCells, ...dayCells];
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CelebrityMatchesDialog({ open, onClose, lifePathNumber, energySignature }: {
  open: boolean;
  onClose: () => void;
  lifePathNumber: number | null;
  energySignature: string | null;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/explore/celebrity-matches', lifePathNumber, energySignature],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (lifePathNumber) params.append('lifePathNumber', lifePathNumber.toString());
      if (energySignature) params.append('energySignature', energySignature);
      params.append('limit', '12');
      const response = await fetch(`/api/explore/celebrity-matches?${params}`);
      if (!response.ok) throw new Error('Failed to fetch celebrity matches');
      return response.json();
    },
    enabled: open && (!!lifePathNumber || !!energySignature),
  });

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden border-none bg-gray-1 shadow-2xl" data-testid="dialog-celebrity-matches">
        <div className="flex flex-col h-full max-h-[90vh]">
        <div className="p-6 pb-4 bg-gradient-to-br from-amber-a3 to-transparent border-b border-amber-a4">
        <DialogHeader className="p-0 space-y-1">
          <DialogTitle className="flex items-center gap-3 text-2xl font-black tracking-tight text-gray-12">
            <div className="p-2 bg-amber-9 rounded-lg text-white shadow-lg shadow-amber-9/20">
            <Star className="w-6 h-6" />
            </div>
            Celebrity Matches
          </DialogTitle>
          <DialogDescription className="text-gray-11 font-medium ml-12">Famous people who share your energy signature</DialogDescription>
        </DialogHeader>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-8">
          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="text-red-9 flex items-center gap-2" data-testid="error-celebrity">
              <AlertCircle className="w-4 h-4" />
              Failed to load celebrity matches
            </div>
          ) : data ? (
            <div className="space-y-4" data-testid="content-celebrity">
              <div className="text-sm text-gray-11">
                Found matches from {data.totalCelebrities?.toLocaleString()} celebrities in database
              </div>

              <div className="grid gap-3">
                {data.matches?.map((celeb: {
                  id: number;
                  name: string;
                  category: string;
                  country: string;
                  lifePathNumber: number;
                  energySignature: string;
                  foundedOrBirth: string;
                  score: number;
                  matchReasons: string[];
                }) => (
                  <div key={celeb.id} className="flex items-start gap-4 p-4 bg-gray-a2 rounded-lg" data-testid={`card-celebrity-${celeb.id}`}>
                    <div className="w-12 h-12 rounded-full bg-amber-a3 flex items-center justify-center text-amber-9 font-bold text-lg shrink-0">
                      {celeb.lifePathNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <div className="font-medium" data-testid={`text-celebrity-name-${celeb.id}`}>{celeb.name}</div>
                          <div className="text-sm text-gray-11">{celeb.category}{celeb.country ? ` | ${celeb.country}` : ''}</div>
                        </div>
                        <Badge variant="secondary" size="sm">{celeb.score}% match</Badge>
                      </div>
                      <div className="text-xs text-gray-11 mt-1">{celeb.energySignature}</div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {celeb.matchReasons.map((reason: string, i: number) => (
                          <Badge key={i} variant="outline" size="sm" className="text-xs">
                            <Check className="w-3 h-3 mr-1" />
                            {reason}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {(!data.matches || data.matches.length === 0) && (
                <div className="text-center py-8 text-gray-11">
                  No celebrity matches found with your energy signature
                </div>
              )}
            </div>
          ) : null}
          </div>
        </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TravelDestinationsDialog({ open, onClose, lifePathNumber, element, birthYear }: {
  open: boolean;
  onClose: () => void;
  lifePathNumber: number | null;
  element: string | null;
  birthYear: number | null;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/explore/travel-destinations', lifePathNumber, element, birthYear],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (lifePathNumber) params.append('lifePathNumber', lifePathNumber.toString());
      if (element) params.append('element', element);
      if (birthYear) params.append('birthYear', birthYear.toString());
      params.append('limit', '12');
      const response = await fetch(`/api/explore/travel-destinations?${params}`);
      if (!response.ok) throw new Error('Failed to fetch travel destinations');
      return response.json();
    },
    enabled: open && (!!lifePathNumber || !!element),
  });

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden border-none bg-gray-1 shadow-2xl" data-testid="dialog-travel-destinations">
        <div className="flex flex-col h-full max-h-[90vh]">
        <div className="p-6 pb-4 bg-gradient-to-br from-amber-a3 to-transparent border-b border-amber-a4">
        <DialogHeader className="p-0 space-y-1">
          <DialogTitle className="flex items-center gap-3 text-2xl font-black tracking-tight text-gray-12">
            <div className="p-2 bg-amber-9 rounded-lg text-white shadow-lg shadow-amber-9/20">
            <Globe className="w-6 h-6" />
            </div>
            Travel Destinations
          </DialogTitle>
          <DialogDescription className="text-gray-11 font-medium ml-12">Countries that align with your zodiac energy</DialogDescription>
        </DialogHeader>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-8">
          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="text-red-9 flex items-center gap-2" data-testid="error-travel">
              <AlertCircle className="w-4 h-4" />
              Failed to load destinations
            </div>
          ) : data ? (
            <div className="space-y-4" data-testid="content-travel">
              {data.userZodiac && (
                <div className="text-sm text-gray-11 flex items-center gap-2">
                  <span>Your zodiac:</span>
                  <Badge variant="secondary" size="sm">{data.userZodiac}</Badge>
                </div>
              )}

              <div className="grid gap-4">
                {data.destinations?.map((dest: {
                  id: number;
                  name: string;
                  foundingYear: number;
                  zodiacAnimal: string;
                  compatibleSigns: string[];
                  description: string;
                  vibe: string;
                  bestFor: string;
                  score: number;
                  isUserMatch: boolean;
                }) => (
                  <div
                    key={dest.id}
                    className={`p-4 rounded-lg ${dest.isUserMatch ? 'bg-amber-a2 border border-amber-a4' : 'bg-gray-a2'}`}
                    data-testid={`card-destination-${dest.id}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-amber-9 shrink-0" />
                        <div>
                          <div className="font-medium" data-testid={`text-destination-name-${dest.id}`}>
                            {dest.name}
                            {dest.isUserMatch && (
                              <Check className="w-4 h-4 text-green-9 inline ml-2" />
                            )}
                          </div>
                          <div className="text-xs text-gray-11">
                            Est. {dest.foundingYear} - Year of the {dest.zodiacAnimal}
                          </div>
                        </div>
                      </div>
                      <Badge variant={dest.isUserMatch ? 'default' : 'secondary'} size="sm">
                        {dest.score}% match
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-11 mt-3" data-testid={`text-destination-description-${dest.id}`}>
                      {dest.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="outline" size="sm" className="text-xs">
                        {dest.vibe}
                      </Badge>
                      <Badge variant="outline" size="sm" className="text-xs">
                        {dest.bestFor}
                      </Badge>
                    </div>

                    <div className="mt-3">
                      <div className="text-xs text-gray-10 mb-1">Compatible signs:</div>
                      <div className="flex flex-wrap gap-1">
                        {dest.compatibleSigns.map((sign: string) => (
                          <Badge
                            key={sign}
                            variant={data.userZodiac === sign ? 'default' : 'outline'}
                            size="sm"
                            className={`text-xs ${data.userZodiac === sign ? 'bg-green-a3 text-green-11 border-green-a6' : ''}`}
                          >
                            {sign}
                            {data.userZodiac === sign && <Check className="w-3 h-3 ml-1" />}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {(!data.destinations || data.destinations.length === 0) && (
                <div className="text-center py-8 text-gray-11">
                  No matching destinations found
                </div>
              )}
            </div>
          ) : null}
          </div>
        </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RelationshipPatternsDialog({ open, onClose, lifePathNumber }: {
  open: boolean;
  onClose: () => void;
  lifePathNumber: number | null;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/explore/relationship-patterns', lifePathNumber],
    queryFn: async () => {
      if (!lifePathNumber) return null;
      const response = await fetch(`/api/explore/relationship-patterns/${lifePathNumber}`);
      if (!response.ok) throw new Error('Failed to fetch relationship patterns');
      return response.json();
    },
    enabled: open && !!lifePathNumber,
  });

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden border-none bg-gray-1 shadow-2xl" data-testid="dialog-relationship-patterns">
        <div className="flex flex-col h-full max-h-[90vh]">
        <div className="p-6 pb-4 bg-gradient-to-br from-amber-a3 to-transparent border-b border-amber-a4">
        <DialogHeader className="p-0 space-y-1">
          <DialogTitle className="flex items-center gap-3 text-2xl font-black tracking-tight text-gray-12">
            <div className="p-2 bg-amber-9 rounded-lg text-white shadow-lg shadow-amber-9/20">
            <Heart className="w-6 h-6" />
            </div>
            Relationship Patterns
          </DialogTitle>
          <DialogDescription className="text-gray-11 font-medium ml-12">Understanding your compatibility tendencies</DialogDescription>
        </DialogHeader>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-8">
          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="text-red-9 flex items-center gap-2" data-testid="error-relationship">
              <AlertCircle className="w-4 h-4" />
              Failed to load relationship patterns
            </div>
          ) : data ? (
            <div className="space-y-6" data-testid="content-relationship">
              <div className="p-4 bg-amber-a2 rounded-lg border border-amber-a4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-amber-a3 flex items-center justify-center text-amber-9 font-bold text-xl">
                    {data.lifePathNumber}
                  </div>
                  <div>
                    <div className="font-bold" data-testid="text-relationship-title">{data.title}</div>
                    <div className="text-sm text-gray-11">Life Path {data.lifePathNumber}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-11" data-testid="text-relationship-description">{data.description}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-a2 rounded-lg border border-green-a4 shadow-sm transition-all hover:bg-green-a3">
                  <div className="font-medium text-green-11 mb-2 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Best Matches
                  </div>
                  <div className="space-y-2">
                    {data.bestMatches?.map((match: { number: number; title: string }) => (
                      <div key={match.number} className="flex items-center gap-2" data-testid={`card-best-match-${match.number}`}>
                        <div className="w-6 h-6 rounded-full bg-green-a3 flex items-center justify-center text-green-11 text-sm font-bold shadow-inner">
                          {match.number}
                        </div>
                        <span className="text-sm font-medium">{match.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-amber-a2 rounded-lg border border-amber-a4 shadow-sm transition-all hover:bg-amber-a3">
                  <div className="font-medium text-amber-11 mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Good Matches
                  </div>
                  <div className="space-y-2">
                    {data.goodMatches?.map((match: { number: number; title: string }) => (
                      <div key={match.number} className="flex items-center gap-2" data-testid={`card-good-match-${match.number}`}>
                        <div className="w-6 h-6 rounded-full bg-amber-a3 flex items-center justify-center text-amber-11 text-sm font-bold shadow-inner">
                          {match.number}
                        </div>
                        <span className="text-sm font-medium">{match.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-gray-a2 rounded-lg border border-gray-a4 shadow-sm transition-all hover:bg-gray-a3">
                  <div className="font-medium text-gray-11 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Challenging
                  </div>
                  <div className="space-y-2">
                    {data.challengingMatches?.map((match: { number: number; title: string }) => (
                      <div key={match.number} className="flex items-center gap-2" data-testid={`card-challenging-match-${match.number}`}>
                        <div className="w-6 h-6 rounded-full bg-gray-a3 flex items-center justify-center text-gray-11 text-sm font-bold shadow-inner">
                          {match.number}
                        </div>
                        <span className="text-sm font-medium">{match.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-a2/50 backdrop-blur-sm rounded-2xl border border-gray-a3">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-amber-11">
                    <Compass className="w-4 h-4" />
                    Western Zodiac Affinities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.westernSigns?.map((sign: string) => (
                      <Badge key={sign} variant="secondary" className="bg-amber-a3 text-amber-11 border-amber-a4 hover:bg-amber-a4">
                        {sign}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-10 mt-3 italic">These signs naturally resonate with your Life Path\'s elemental focus.</p>
                </div>

                <div className="p-4 bg-gray-a2/50 backdrop-blur-sm rounded-2xl border border-gray-a3">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-amber-11">
                    <Globe className="w-4 h-4" />
                    Chinese Zodiac Affinities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.chineseSigns?.map((sign: string) => (
                      <Badge key={sign} variant="secondary" className="bg-amber-a3 text-amber-11 border-amber-a4 hover:bg-amber-a4">
                        {sign}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-10 mt-3 italic">Signs that offer the best energetic synergy for long-term growth.</p>
                </div>
              </div>

              <div className="p-4 bg-gray-a2 rounded-lg">
                <h4 className="font-medium mb-2">Relationship Tips</h4>
                <ul className="space-y-1 text-sm text-gray-11">
                  {data.tips?.map((tip: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-9 mt-0.5">*</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
          </div>
        </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CareerAlignmentDialog({ open, onClose, lifePathNumber }: {
  open: boolean;
  onClose: () => void;
  lifePathNumber: number | null;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/explore/career-alignment', lifePathNumber],
    queryFn: async () => {
      if (!lifePathNumber) return null;
      const response = await fetch(`/api/explore/career-alignment/${lifePathNumber}`);
      if (!response.ok) throw new Error('Failed to fetch career alignment');
      return response.json();
    },
    enabled: open && !!lifePathNumber,
  });

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden border-none bg-gray-1 shadow-2xl" data-testid="dialog-career-alignment">
        <div className="flex flex-col h-full max-h-[90vh]">
        <div className="p-6 pb-4 bg-gradient-to-br from-amber-a3 to-transparent border-b border-amber-a4">
        <DialogHeader className="p-0 space-y-1">
          <DialogTitle className="flex items-center gap-3 text-2xl font-black tracking-tight text-gray-12">
            <div className="p-2 bg-amber-9 rounded-lg text-white shadow-lg shadow-amber-9/20">
            <Briefcase className="w-6 h-6" />
            </div>
            Career Alignment
          </DialogTitle>
          <DialogDescription className="text-gray-11 font-medium ml-12">Industries and roles that match your energy</DialogDescription>
        </DialogHeader>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-8">
          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="text-red-9 flex items-center gap-2" data-testid="error-career">
              <AlertCircle className="w-4 h-4" />
              Failed to load career alignment
            </div>
          ) : data ? (
            <div className="space-y-6" data-testid="content-career">
              <div className="p-4 bg-amber-a2 rounded-lg border border-amber-a4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-amber-a3 flex items-center justify-center text-amber-9 font-bold text-xl">
                    {data.lifePathNumber}
                  </div>
                  <div>
                    <div className="font-bold" data-testid="text-career-title">{data.title}</div>
                    <div className="text-sm text-gray-11">Life Path {data.lifePathNumber}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-11" data-testid="text-career-description">{data.description}</p>
              </div>

              {data.whyTheseFit && (
                <div className="p-4 bg-green-a2 rounded-lg border border-green-a4">
                  <p className="text-sm" data-testid="text-why-these-fit">{data.whyTheseFit}</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-a2 rounded-lg">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-amber-9" />
                    Ideal Industries
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.industries?.map((industry: string, i: number) => (
                      <Badge key={i} variant="outline" data-testid={`badge-industry-${i}`}>{industry}</Badge>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-gray-a2 rounded-lg">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-9" />
                    Core Strengths
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {data.coreStrengths?.map((strength: string, i: number) => (
                      <div key={i} className="p-2 bg-amber-a2 rounded text-center text-sm font-medium" data-testid={`card-strength-${i}`}>
                        {strength}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-a2 rounded-lg">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-amber-9" />
                  Suggested Roles
                </h4>
                <div className="space-y-3">
                  {data.suggestedRoles?.map((role: { name: string; reason: string }, i: number) => (
                    <div key={i} className="p-3 bg-background rounded-lg" data-testid={`card-role-${i}`}>
                      <div className="font-medium text-amber-11">{role.name}</div>
                      <div className="text-sm text-gray-11 mt-1">{role.reason}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
          </div>
        </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProfileRequiredPrompt({ onClose }: { onClose: () => void }) {
  return (
    <Dialog open={true} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md" data-testid="dialog-profile-required">
        <DialogHeader>
          <DialogTitle>Profile Required</DialogTitle>
          <DialogDescription>
            This feature requires your birth date to provide personalized insights.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-4">
          <p className="text-sm text-gray-11">
            Create your profile to unlock personalized numerology features including best days,
            celebrity matches, travel destinations, relationship patterns, and career alignment.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose} data-testid="button-close-profile-prompt">
              Cancel
            </Button>
            <Link href="/">
              <Button data-testid="button-create-profile">Create Profile</Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Explore() {
  const [activeFeature, setActiveFeature] = useState<FeatureType>(null);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const savedOdisId = typeof window !== 'undefined' ? localStorage.getItem(ODIS_ID_KEY) : null;

  const { data: profileData, isLoading: isProfileLoading } = useQuery<ProfileData & { isPro?: boolean } | null>({
    queryKey: ['/api/profile', savedOdisId],
    queryFn: async () => {
      if (!savedOdisId) return null;
      const response = await fetch(`/api/profile/${savedOdisId}`);
      if (!response.ok) return null;
      const data = await response.json();
      return { ...data.user, isPro: data.isPro } as ProfileData & { isPro?: boolean };
    },
    enabled: !!savedOdisId,
    staleTime: 1000 * 60 * 5,
  });

  const hasProfile = !!profileData;
  const isPro = profileData?.isPro ?? false;
  const profileLoaded = !savedOdisId || !isProfileLoading;
  const birthDate = profileData?.birthDate || null;

  const calculatedProfile = useMemo(() => {
    if (!profileData?.birthDate || !profileData?.fullName) return null;
    try {
      return calculateComprehensiveProfile(
        profileData.fullName,
        new Date(profileData.birthDate),
        profileData.birthTime || '12:00',
        profileData.birthLocation || 'Unknown'
      );
    } catch {
      return null;
    }
  }, [profileData]);

  const lifePathNumber = calculatedProfile?.lifePathNumber || null;
  const energySignature = calculatedProfile?.energySignature || null;
  const element = energySignature ? energySignature.split(' ')[0] : null;

  const handleCardClick = (featureId: FeatureType) => {
    if (!isPro) {
      setShowUpgradeModal(true);
      return;
    }

    const feature = explorations.find(e => e.id === featureId);

    if (feature?.requiresProfile && !hasProfile) {
      setShowProfilePrompt(true);
      return;
    }

    setActiveFeature(featureId);
  };

  const handleCloseDialog = () => {
    setActiveFeature(null);
  };

  return (
    <>
      <StarField />
      <Navigation />

      <main className="pt-20 pb-12 px-4 min-h-screen" data-testid="page-explore">
        <div className="container mx-auto max-w-6xl space-y-8">
          <div className="text-center">
            <Badge variant="outline" className="mb-4">
              <Compass className="w-3 h-3 mr-1" />
              Discovery
            </Badge>
            <h1 className="text-6 md:text-7 font-semibold mb-4">
              <span className="gradient-text">Explore</span> Your Energy
            </h1>
            <p className="text-gray-11 text-3 max-w-2xl mx-auto">
              Discover insights about your energy patterns and how they connect to the world around you.
            </p>
          </div>

          {profileLoaded && !hasProfile && (
            <Card variant="frosted" className="border-amber-a4">
              <CardContent className="py-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-9" />
                    <div>
                      <div className="font-medium">Create your profile for personalized features</div>
                      <div className="text-sm text-gray-11">Unlock all 20 explore features with your birth date</div>
                    </div>
                  </div>
                  <Link href="/">
                    <Button data-testid="button-create-profile-banner">Create Profile</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
            {explorations.map((item) => (
              <Card
                key={item.id}
                variant="frosted"
                className={`hover:border-amber-6/30 transition-all cursor-pointer group relative flex flex-col min-h-[180px] sm:min-h-[210px] lg:min-h-[230px] ${profileLoaded && item.requiresProfile && !hasProfile ? 'opacity-60' : ''
                  }`}
                onClick={() => handleCardClick(item.id)}
                data-testid={`card-explore-${item.id}`}
              >
                {!isPro && (
                  <div className="absolute inset-0 bg-gray-1/60 backdrop-blur-[1px] rounded-lg z-10 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gray-a3 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-gray-11" />
                      </div>
                      <Badge variant="secondary" size="sm">
                        <Crown className="w-3 h-3 mr-1" />
                        Pro
                      </Badge>
                    </div>
                  </div>
                )}
                <CardHeader className="p-5 sm:p-6 lg:p-7 pb-3 sm:pb-4 flex-none">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-amber-a3 flex items-center justify-center group-hover:bg-amber-a4 transition-colors">
                      <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-amber-9" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-amber-a2 text-amber-11 border-amber-a4 px-2 py-0 h-5 text-[10px] font-bold uppercase tracking-wider">
                            {item.tag}
                          </Badge>
                          {(item as any).isNew && (
                            <Badge className="bg-amber-9 text-white border-none px-2 py-0 h-5 text-[10px] font-black uppercase tracking-tighter">
                              New
                            </Badge>
                          )}
                        </div>
                        {profileLoaded && item.requiresProfile && !hasProfile && (
                          <Badge variant="outline" size="sm" className="text-[10px] opacity-70 border-dashed">
                            Profile needed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-4 sm:text-[1.15rem] mt-4 sm:mt-5">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-5 sm:p-6 lg:p-7 pt-0 mt-auto">
                  <p className="text-2 sm:text-[0.85rem] text-gray-11 leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <TrendingEnergiesDialog
        open={activeFeature === 'trending'}
        onClose={() => setActiveFeature(null)}
        profileData={profileData || null}
      />

      <BestDaysDialog
        open={activeFeature === 'best-days'}
        onClose={handleCloseDialog}
        birthDate={birthDate}
      />

      <CelebrityMatchesDialog
        open={activeFeature === 'celebrity'}
        onClose={handleCloseDialog}
        lifePathNumber={lifePathNumber}
        energySignature={energySignature}
      />

      <TravelDestinationsDialog
        open={activeFeature === 'travel'}
        onClose={handleCloseDialog}
        lifePathNumber={lifePathNumber}
        element={element}
        birthYear={birthDate ? new Date(birthDate).getFullYear() : null}
      />

      <RelationshipPatternsDialog
        open={activeFeature === 'relationship'}
        onClose={handleCloseDialog}
        lifePathNumber={lifePathNumber}
      />

      <CareerAlignmentDialog
        open={activeFeature === 'career'}
        onClose={handleCloseDialog}
        lifePathNumber={lifePathNumber}
      />

      <YearlyForecastDialog
        open={activeFeature === 'yearly-forecast'}
        onClose={handleCloseDialog}
        lifePathNumber={lifePathNumber}
      />

      <MonthlyForecastDialog
        open={activeFeature === 'monthly-forecast'}
        onClose={handleCloseDialog}
        lifePathNumber={lifePathNumber}
      />

      <HomePickerDialog
        open={activeFeature === 'home-picker'}
        onClose={handleCloseDialog}
        lifePathNumber={lifePathNumber}
      />

      <CarsDialog
        open={activeFeature === 'cars'}
        onClose={handleCloseDialog}
        lifePathNumber={lifePathNumber}
      />

      <LuckyNumberDialog
        open={activeFeature === 'lucky-number'}
        onClose={handleCloseDialog}
        lifePathNumber={lifePathNumber}
        birthDate={birthDate}
      />

      <LetterologyDialog
        open={activeFeature === 'letterology'}
        onClose={handleCloseDialog}
        profileData={profileData}
      />

      <MatrixNumbersDialog
        open={activeFeature === 'matrix-numbers'}
        onClose={handleCloseDialog}
        lifePathNumber={lifePathNumber}
        birthDate={birthDate}
      />

      <CueCardsDialog
        open={activeFeature === 'cue-cards'}
        onClose={handleCloseDialog}
      />

      <DreamInterpreterDialog
        open={activeFeature === 'dream-interpreter'}
        onClose={handleCloseDialog}
        lifePathNumber={lifePathNumber}
      />

      <EnergyInsightsDialog
        open={activeFeature === 'energy-insights'}
        onClose={handleCloseDialog}
        lifePathNumber={lifePathNumber}
        energySignature={energySignature}
      />

      <ColorologyDialog
        open={activeFeature === 'colorology'}
        onClose={handleCloseDialog}
        lifePathNumber={lifePathNumber}
      />

      <VedicAstrologyDialog
        open={activeFeature === 'vedic-astrology'}
        onClose={handleCloseDialog}
        birthDate={birthDate}
      />

      <AllAboutYouDialog
        open={activeFeature === 'all-about-you'}
        onClose={handleCloseDialog}
        profileData={profileData}
      />

      <SaturnInsightsDialog
        open={activeFeature === 'saturn-insights'}
        onClose={handleCloseDialog}
        birthDate={birthDate}
      />

      {showProfilePrompt && (
        <ProfileRequiredPrompt onClose={() => setShowProfilePrompt(false)} />
      )}

      <UpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
    </>
  );
}
