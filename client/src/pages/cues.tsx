import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigation } from '@/components/Navigation';
import { StarField } from '@/components/StarField';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UpgradeModal } from '@/components/UpgradeModal';
import { 
  Database, 
  Search, 
  Building2, 
  MapPin, 
  User, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Calendar,
  Globe,
  Loader2,
  Crown,
  Lock
} from 'lucide-react';

// Western Zodiac Images
import ariesImg from '@assets/generated_images/aries_zodiac_symbol_icon.png';
import taurusImg from '@assets/generated_images/taurus_zodiac_symbol_icon.png';
import geminiImg from '@assets/generated_images/gemini_zodiac_symbol_icon.png';
import cancerImg from '@assets/generated_images/cancer_zodiac_symbol_icon.png';
import leoImg from '@assets/generated_images/leo_zodiac_symbol_icon.png';
import virgoImg from '@assets/generated_images/virgo_zodiac_symbol_icon.png';
import libraImg from '@assets/generated_images/libra_zodiac_symbol_icon.png';
import scorpioImg from '@assets/generated_images/scorpio_zodiac_symbol_icon.png';
import sagittariusImg from '@assets/generated_images/sagittarius_zodiac_symbol_icon.png';
import capricornImg from '@assets/generated_images/capricorn_zodiac_symbol_icon.png';
import aquariusImg from '@assets/generated_images/aquarius_zodiac_symbol_icon.png';
import piscesImg from '@assets/generated_images/pisces_zodiac_symbol_icon.png';

// Chinese Zodiac Images
import ratImg from '@assets/generated_images/chinese_zodiac_rat_icon.png';
import oxImg from '@assets/generated_images/chinese_zodiac_ox_icon.png';
import tigerImg from '@assets/generated_images/chinese_zodiac_tiger_icon.png';
import rabbitImg from '@assets/generated_images/chinese_zodiac_rabbit_icon.png';
import dragonImg from '@assets/generated_images/chinese_zodiac_dragon_icon.png';
import snakeImg from '@assets/generated_images/chinese_zodiac_snake_icon.png';
import horseImg from '@assets/generated_images/chinese_zodiac_horse_icon.png';
import goatImg from '@assets/generated_images/chinese_zodiac_goat_icon.png';
import monkeyImg from '@assets/generated_images/chinese_zodiac_monkey_icon.png';
import roosterImg from '@assets/generated_images/chinese_zodiac_rooster_icon.png';
import dogImg from '@assets/generated_images/chinese_zodiac_dog_icon.png';
import pigImg from '@assets/generated_images/chinese_zodiac_pig_icon.png';

const westernZodiacImages: Record<string, string> = {
  'Aries': ariesImg,
  'Taurus': taurusImg,
  'Gemini': geminiImg,
  'Cancer': cancerImg,
  'Leo': leoImg,
  'Virgo': virgoImg,
  'Libra': libraImg,
  'Scorpio': scorpioImg,
  'Sagittarius': sagittariusImg,
  'Capricorn': capricornImg,
  'Aquarius': aquariusImg,
  'Pisces': piscesImg,
};

const chineseZodiacImages: Record<string, string> = {
  'Rat': ratImg,
  'Ox': oxImg,
  'Tiger': tigerImg,
  'Rabbit': rabbitImg,
  'Dragon': dragonImg,
  'Snake': snakeImg,
  'Horse': horseImg,
  'Goat': goatImg,
  'Monkey': monkeyImg,
  'Rooster': roosterImg,
  'Dog': dogImg,
  'Pig': pigImg,
};

interface Cue {
  id: number;
  name: string;
  type: 'Brand' | 'Location' | 'Person';
  foundedOrBirth: string;
  category?: string;
  country?: string;
  description?: string;
  lifePathNumber: number;
  energySignature: string;
}

interface EnhancedCue extends Cue {
  chineseZodiac: {
    animal: string;
    element: string;
    yinYang: string;
  };
  westernZodiac: {
    sign: string;
    element: string;
    rulingPlanet: string;
  };
  aboutDescription: string;
}

interface CuesResponse {
  items: Cue[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

interface CuesStats {
  total: number;
  byType: {
    Brand: number;
    Location: number;
    Person: number;
  };
  byLifePath: Record<number, number>;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'Brand': return Building2;
    case 'Location': return MapPin;
    case 'Person': return User;
    default: return Database;
  }
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

function CueCardSkeleton() {
  return (
    <Card variant="glass">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="h-3 w-40 mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-28" />
      </CardContent>
    </Card>
  );
}

const FEATURED_CUE_NAMES = ['Apple Inc.', 'Microsoft', 'Google', 'Amazon', 'Meta', 'Netflix'];

export default function Cues() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [lifePathFilter, setLifePathFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCueId, setSelectedCueId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const pageSize = 24;

  const savedOdisId = localStorage.getItem('gg33-odis-id');
  const { data: profileData } = useQuery<{ isPro?: boolean }>({
    queryKey: ['/api/profile', savedOdisId],
    enabled: !!savedOdisId,
  });
  const isPro = profileData?.isPro ?? false;

  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: selectedCueData, isLoading: isLoadingCue } = useQuery<{ cue: EnhancedCue }>({
    queryKey: [`/api/cues/${selectedCueId}`],
    enabled: selectedCueId !== null,
  });

  const handleCueClick = useCallback((cueId: number) => {
    setSelectedCueId(cueId);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedCueId(null);
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, typeFilter, lifePathFilter]);

  // Build query URL
  const cuesUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('q', debouncedSearch);
    if (typeFilter) params.set('type', typeFilter);
    if (lifePathFilter) params.set('lifePath', lifePathFilter);
    params.set('page', currentPage.toString());
    params.set('pageSize', pageSize.toString());
    return `/api/cues?${params.toString()}`;
  }, [debouncedSearch, typeFilter, lifePathFilter, currentPage]);

  // Fetch cues
  const { data: cuesData, isLoading, isError, isFetching } = useQuery<CuesResponse>({
    queryKey: [cuesUrl],
  });

  // Fetch stats
  const { data: statsData } = useQuery<CuesStats>({
    queryKey: ['/api/cues-stats'],
  });

  const handleTypeFilter = useCallback((type: string) => {
    setTypeFilter(prev => prev === type ? '' : type);
  }, []);

  const handleLifePathChange = useCallback((value: string) => {
    setLifePathFilter(value === 'all' ? '' : value);
  }, []);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const lifePathNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];

  return (
    <>
      <StarField />
      <Navigation />
      
      <main className="pt-20 pb-12 px-4 min-h-screen" data-testid="page-cues">
        <div className="container mx-auto max-w-6xl space-y-8">
          {/* Header */}
          <div className="text-center">
            <Badge variant="outline" className="mb-4">
              <Database className="w-3 h-3 mr-1" />
              Energy Database
            </Badge>
            <h1 className="text-6 md:text-7 font-semibold mb-4">
              {statsData?.total.toLocaleString() || '22,000'}+ <span className="gradient-text">Cues</span>
            </h1>
            <p className="text-gray-11 text-3 max-w-2xl mx-auto">
              Explore our database of brands, cities, and notable people with their calculated energy signatures.
            </p>
            
            {/* Stats badges */}
            {statsData && (
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <Badge variant="outline" className="text-2">
                  <Building2 className="w-3 h-3 mr-1" />
                  {statsData.byType.Brand.toLocaleString()} Brands
                </Badge>
                <Badge variant="outline" className="text-2">
                  <MapPin className="w-3 h-3 mr-1" />
                  {statsData.byType.Location.toLocaleString()} Locations
                </Badge>
                <Badge variant="outline" className="text-2">
                  <User className="w-3 h-3 mr-1" />
                  {statsData.byType.Person.toLocaleString()} People
                </Badge>
              </div>
            )}
          </div>

          {/* Search and Filters */}
          <Card variant="frosted">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-10" />
                    <Input
                      variant="frosted"
                      placeholder={isPro ? "Search brands, cities, people..." : "Upgrade to Pro to search"}
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => isPro && setSearchQuery(e.target.value)}
                      disabled={!isPro}
                      data-testid="input-search-cues"
                    />
                  </div>
                  <Select value={lifePathFilter || 'all'} onValueChange={handleLifePathChange} disabled={!isPro}>
                    <SelectTrigger className="w-full md:w-[180px]" data-testid="select-life-path" disabled={!isPro}>
                      <SelectValue placeholder="Life Path #" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Life Paths</SelectItem>
                      {lifePathNumbers.map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          Life Path {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    variant={typeFilter === 'Brand' ? 'gold' : 'outline'} 
                    size="sm"
                    onClick={() => isPro && handleTypeFilter('Brand')}
                    disabled={!isPro}
                    data-testid="button-filter-brands"
                  >
                    <Building2 className="w-4 h-4 mr-1" />
                    Brands
                    {statsData && <span className="ml-1 opacity-60">({statsData.byType.Brand})</span>}
                  </Button>
                  <Button 
                    variant={typeFilter === 'Location' ? 'gold' : 'outline'} 
                    size="sm"
                    onClick={() => isPro && handleTypeFilter('Location')}
                    disabled={!isPro}
                    data-testid="button-filter-locations"
                  >
                    <MapPin className="w-4 h-4 mr-1" />
                    Locations
                    {statsData && <span className="ml-1 opacity-60">({statsData.byType.Location})</span>}
                  </Button>
                  <Button 
                    variant={typeFilter === 'Person' ? 'gold' : 'outline'} 
                    size="sm"
                    onClick={() => isPro && handleTypeFilter('Person')}
                    disabled={!isPro}
                    data-testid="button-filter-people"
                  >
                    <User className="w-4 h-4 mr-1" />
                    People
                    {statsData && <span className="ml-1 opacity-60">({statsData.byType.Person})</span>}
                  </Button>
                  {(typeFilter || lifePathFilter || searchQuery) && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setTypeFilter('');
                        setLifePathFilter('');
                        setSearchQuery('');
                      }}
                      data-testid="button-clear-filters"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Info */}
          {cuesData && (
            <div className="flex items-center justify-between text-2 text-gray-11">
              <span data-testid="text-results-count">
                Showing {((cuesData.page - 1) * cuesData.pageSize) + 1}-
                {Math.min(cuesData.page * cuesData.pageSize, cuesData.total)} of {cuesData.total.toLocaleString()} results
              </span>
              {isFetching && !isLoading && (
                <Loader2 className="w-4 h-4 animate-spin text-amber-9" />
              )}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <CueCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error State */}
          {isError && (
            <Card variant="glass" className="text-center py-12">
              <CardContent>
                <p className="text-red-400">Failed to load cues. Please try again.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!isLoading && cuesData?.items.length === 0 && (
            <Card variant="glass" className="text-center py-12">
              <CardContent>
                <Search className="w-12 h-12 mx-auto text-gray-10 mb-4" />
                <h3 className="text-4 font-semibold mb-2">No Results Found</h3>
                <p className="text-gray-11 text-2">
                  Try adjusting your search or filters.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Results Grid */}
          {!isLoading && cuesData && cuesData.items.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(isPro ? cuesData.items : cuesData.items.filter(cue => FEATURED_CUE_NAMES.includes(cue.name)).slice(0, 6)).map((cue) => {
                const TypeIcon = getTypeIcon(cue.type);
                return (
                  <Card 
                    key={cue.id} 
                    variant="glass" 
                    className="hover:border-amber-6/30 transition-colors cursor-pointer"
                    onClick={() => handleCueClick(cue.id)}
                    data-testid={`card-cue-${cue.id}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <TypeIcon className="w-4 h-4 text-gray-10 shrink-0" />
                          <CardTitle className="text-4 truncate">{cue.name}</CardTitle>
                        </div>
                        <Badge variant="secondary" size="sm" className="shrink-0">
                          LP {cue.lifePathNumber}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="outline" size="sm" className="text-1">
                          {cue.type}
                        </Badge>
                        {cue.category && (
                          <Badge variant="outline" size="sm" className="text-1">
                            {cue.category}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-2 text-amber-11 font-medium">
                        <Sparkles className="w-3 h-3" />
                        <span>{cue.energySignature}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-1 text-gray-11">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(cue.foundedOrBirth)}</span>
                        </div>
                        {cue.country && (
                          <div className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            <span>{cue.country}</span>
                          </div>
                        )}
                      </div>
                      {cue.description && (
                        <p className="text-1 text-gray-11 line-clamp-2">{cue.description}</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Upgrade CTA for non-Pro users */}
          {!isPro && cuesData && cuesData.items.length > 0 && (
            <Card variant="frosted" className="text-center py-8">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-amber-8 to-amber-9 flex items-center justify-center mb-4 shadow-lg shadow-amber-9/30">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-amber-9" />
                  <Badge variant="secondary" size="sm">Pro Feature</Badge>
                </div>
                <h3 className="text-5 font-semibold text-gray-12">
                  Unlock All 22,000+ Cues
                </h3>
                <p className="text-3 text-gray-11 max-w-md mx-auto">
                  Upgrade to Pro to search, filter, and explore the complete database of brands, locations, and notable people.
                </p>
                <Button 
                  variant="gold" 
                  size="lg"
                  onClick={() => setShowUpgradeModal(true)}
                  data-testid="button-upgrade-cues"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {isPro && cuesData && cuesData.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                data-testid="button-prev-page"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {/* First page */}
                {currentPage > 3 && (
                  <>
                    <Button
                      variant={currentPage === 1 ? 'gold' : 'ghost'}
                      size="sm"
                      onClick={() => goToPage(1)}
                    >
                      1
                    </Button>
                    {currentPage > 4 && <span className="text-gray-10 px-2">...</span>}
                  </>
                )}
                
                {/* Page numbers around current */}
                {Array.from({ length: Math.min(5, cuesData.totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (cuesData.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= cuesData.totalPages - 2) {
                    pageNum = cuesData.totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  if (pageNum < 1 || pageNum > cuesData.totalPages) return null;
                  if (currentPage > 3 && pageNum === 1) return null;
                  if (currentPage < cuesData.totalPages - 2 && pageNum === cuesData.totalPages) return null;
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'gold' : 'ghost'}
                      size="sm"
                      onClick={() => goToPage(pageNum)}
                      data-testid={`button-page-${pageNum}`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                {/* Last page */}
                {currentPage < cuesData.totalPages - 2 && (
                  <>
                    {currentPage < cuesData.totalPages - 3 && <span className="text-gray-10 px-2">...</span>}
                    <Button
                      variant={currentPage === cuesData.totalPages ? 'gold' : 'ghost'}
                      size="sm"
                      onClick={() => goToPage(cuesData.totalPages)}
                    >
                      {cuesData.totalPages}
                    </Button>
                  </>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={!cuesData.hasMore}
                data-testid="button-next-page"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Page info */}
          {cuesData && cuesData.totalPages > 1 && (
            <div className="text-center text-2 text-gray-11">
              Page {cuesData.page} of {cuesData.totalPages}
            </div>
          )}
        </div>
      </main>

      {/* Cue Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && handleCloseModal()}>
        <DialogContent className="max-w-md bg-gray-2 border-gray-6" data-testid="modal-cue-detail">
          {isLoadingCue ? (
            <div className="space-y-4 py-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-4 justify-center">
                <Skeleton className="h-16 w-16 rounded-md" />
                <Skeleton className="h-16 w-16 rounded-md" />
                <Skeleton className="h-16 w-16 rounded-md" />
              </div>
              <Skeleton className="h-20 w-full" />
            </div>
          ) : selectedCueData?.cue ? (
            <>
              <DialogHeader className="pr-8">
                <div className="flex items-center justify-between gap-2">
                  <DialogTitle className="text-5 font-semibold" data-testid="text-cue-name">
                    {selectedCueData.cue.name}
                  </DialogTitle>
                  <span className="text-2 text-gray-11 shrink-0" data-testid="text-cue-date">
                    {formatDate(selectedCueData.cue.foundedOrBirth)}
                  </span>
                </div>
                <DialogDescription className="sr-only">
                  Detailed information about {selectedCueData.cue.name}
                </DialogDescription>
              </DialogHeader>

              {/* Energy Numbers Display */}
              <div className="flex justify-center gap-6 py-4">
                <div className="flex flex-col items-center" data-testid="badge-life-path">
                  <div className="w-14 h-14 rounded-md bg-amber-9/20 border border-amber-6/40 flex items-center justify-center text-amber-11 text-5 font-bold">
                    {selectedCueData.cue.lifePathNumber}
                  </div>
                  <span className="text-1 text-gray-11 mt-1">Numerology</span>
                </div>
                <div className="flex flex-col items-center" data-testid="badge-chinese-zodiac">
                  <div className="w-14 h-14 rounded-md border border-amber-6/40 overflow-hidden">
                    <img 
                      src={chineseZodiacImages[selectedCueData.cue.chineseZodiac.animal]} 
                      alt={selectedCueData.cue.chineseZodiac.animal}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-1 text-gray-11 mt-1">{selectedCueData.cue.chineseZodiac.animal}</span>
                </div>
                <div className="flex flex-col items-center" data-testid="badge-western-zodiac">
                  <div className="w-14 h-14 rounded-md border border-amber-6/40 overflow-hidden">
                    <img 
                      src={westernZodiacImages[selectedCueData.cue.westernZodiac.sign]} 
                      alt={selectedCueData.cue.westernZodiac.sign}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-1 text-gray-11 mt-1">{selectedCueData.cue.westernZodiac.sign}</span>
                </div>
              </div>

              {/* Energy Signature */}
              <div className="flex items-center justify-center gap-2 text-amber-11 font-medium pb-2">
                <Sparkles className="w-4 h-4" />
                <span data-testid="text-energy-signature">{selectedCueData.cue.energySignature}</span>
              </div>

              {/* About Section */}
              <div className="border-t border-gray-6 pt-4">
                <h4 className="text-2 font-semibold text-gray-11 mb-2">About the Cue</h4>
                <p className="text-2 text-gray-11 leading-relaxed" data-testid="text-about-description">
                  {selectedCueData.cue.aboutDescription}
                </p>
              </div>

              {/* Additional Info */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="outline" size="sm">
                  {selectedCueData.cue.type}
                </Badge>
                {selectedCueData.cue.category && (
                  <Badge variant="outline" size="sm">
                    {selectedCueData.cue.category}
                  </Badge>
                )}
                {selectedCueData.cue.country && (
                  <Badge variant="outline" size="sm">
                    <Globe className="w-3 h-3 mr-1" />
                    {selectedCueData.cue.country}
                  </Badge>
                )}
                <Badge variant="secondary" size="sm">
                  {selectedCueData.cue.chineseZodiac.element} {selectedCueData.cue.chineseZodiac.yinYang}
                </Badge>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
