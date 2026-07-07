import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { calculateComprehensiveCompatibility, type ComprehensiveCompatibility } from '@/lib/numerology';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, Heart, Sparkles, ArrowRight, Star, Zap, Brain, 
  MessageCircle, TrendingUp, Sun, Target, Loader2,
  CheckCircle, AlertTriangle, Lightbulb, HeartHandshake, Info
} from 'lucide-react';

interface CompatibilityCheckerProps {
  userBirthDate: Date;
  userName: string;
  userFullName?: string;
}

interface AIInsights {
  overviewNarrative: string;
  emotionalConnection: string;
  communicationDynamic: string;
  growthPotential: string;
  dailyLifeTogether: string;
  advice: string;
}

type AnalysisPhase = 'idle' | 'calculating' | 'analyzing' | 'generating' | 'complete';

const analysisMessages: Record<AnalysisPhase, string> = {
  idle: '',
  calculating: 'Calculating numerology profiles...',
  analyzing: 'Analyzing dimensional compatibility...',
  generating: 'Generating personalized insights...',
  complete: 'Analysis complete!',
};

export function CompatibilityChecker({ userBirthDate, userName, userFullName }: CompatibilityCheckerProps) {
  const [targetName, setTargetName] = useState('');
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);
  const [result, setResult] = useState<ComprehensiveCompatibility | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
  const [phase, setPhase] = useState<AnalysisPhase>('idle');
  const [progress, setProgress] = useState(0);

  const aiMutation = useMutation({
    mutationFn: async (data: { person1: any; person2: any; overallScore: number; level: string }) => {
      const response = await apiRequest('POST', '/api/compatibility', data);
      const json = await response.json();
      return json.insights as AIInsights;
    },
    onSuccess: (insights) => {
      setAiInsights(insights);
      setPhase('complete');
      setProgress(100);
    },
    onError: () => {
      setPhase('complete');
      setProgress(100);
    },
  });

  useEffect(() => {
    if (phase === 'idle' || phase === 'complete') return;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (phase === 'calculating' && prev < 30) return prev + 2;
        if (phase === 'analyzing' && prev < 60) return prev + 1.5;
        if (phase === 'generating' && prev < 95) return prev + 0.5;
        return prev;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [phase]);

  const handleCheck = async () => {
    if (!targetDate || !targetName) return;
    
    setPhase('calculating');
    setProgress(0);
    setResult(null);
    setAiInsights(null);

    await new Promise(resolve => setTimeout(resolve, 800));
    
    const person1Name = userFullName || userName;
    
    const compatibility = calculateComprehensiveCompatibility(
      person1Name,
      userBirthDate,
      targetName,
      targetDate
    );
    
    setResult(compatibility);
    setPhase('analyzing');
    setProgress(30);

    await new Promise(resolve => setTimeout(resolve, 600));
    
    setPhase('generating');
    setProgress(60);

    aiMutation.mutate({
      person1: {
        name: person1Name,
        birthDate: userBirthDate.toISOString(),
        lifePathNumber: compatibility.person1Profile.lifePathNumber,
        expressionNumber: compatibility.person1Profile.expressionNumber,
        soulUrgeNumber: compatibility.person1Profile.soulUrgeNumber,
        personalityNumber: compatibility.person1Profile.personalityNumber,
        attitudeNumber: compatibility.person1Profile.attitudeNumber,
        dayOfBirthNumber: compatibility.person1Profile.dayOfBirthNumber,
        westernZodiac: compatibility.person1Profile.westernZodiac.sign,
        westernElement: compatibility.person1Profile.westernZodiac.element,
        chineseZodiac: compatibility.person1Profile.chineseZodiac.animal,
        chineseElement: compatibility.person1Profile.chineseZodiac.element,
        energySignature: compatibility.person1Profile.energySignature,
      },
      person2: {
        name: targetName,
        birthDate: targetDate.toISOString(),
        lifePathNumber: compatibility.person2Profile.lifePathNumber,
        expressionNumber: compatibility.person2Profile.expressionNumber,
        soulUrgeNumber: compatibility.person2Profile.soulUrgeNumber,
        personalityNumber: compatibility.person2Profile.personalityNumber,
        attitudeNumber: compatibility.person2Profile.attitudeNumber,
        dayOfBirthNumber: compatibility.person2Profile.dayOfBirthNumber,
        westernZodiac: compatibility.person2Profile.westernZodiac.sign,
        westernElement: compatibility.person2Profile.westernZodiac.element,
        chineseZodiac: compatibility.person2Profile.chineseZodiac.animal,
        chineseElement: compatibility.person2Profile.chineseZodiac.element,
        energySignature: compatibility.person2Profile.energySignature,
      },
      overallScore: compatibility.overallScore,
      level: compatibility.level,
    });
  };

  const isAnalyzing = phase !== 'idle' && phase !== 'complete';

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Ideal': case 'Excellent': return 'bg-green-9 text-white';
      case 'Harmonious': case 'Good': return 'bg-green-7 text-white';
      case 'Neutral': case 'Moderate': return 'bg-amber-7 text-white';
      case 'Challenging': case 'Low': return 'bg-red-7 text-white';
      case 'Avoid': return 'bg-red-9 text-white';
      default: return 'bg-gray-7 text-white';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-9';
    if (score >= 60) return 'bg-green-7';
    if (score >= 45) return 'bg-amber-7';
    return 'bg-red-7';
  };

  const getDimensionIcon = (dimension: string) => {
    switch (dimension) {
      case 'lifePath': return Star;
      case 'expression': return MessageCircle;
      case 'soulUrge': return Heart;
      case 'personality': return Brain;
      case 'attitude': return Zap;
      case 'dayOfBirth': return Sun;
      default: return Star;
    }
  };

  const getDimensionLabel = (dimension: string) => {
    switch (dimension) {
      case 'lifePath': return 'Life Path';
      case 'expression': return 'Expression';
      case 'soulUrge': return 'Soul Urge';
      case 'personality': return 'Personality';
      case 'attitude': return 'Attitude';
      case 'dayOfBirth': return 'Day of Birth';
      default: return dimension;
    }
  };

  return (
    <Card variant="frosted" className="overflow-hidden relative" data-testid="card-compatibility">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-a2 to-transparent pointer-events-none" />
      
      <CardHeader className="relative">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-8 to-amber-9 flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-4">Compatibility Analysis</CardTitle>
            <CardDescription className="text-2 text-gray-11">
              Deep multi-dimensional energy analysis
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 relative">
        {/* Input Form */}
        <div className="space-y-4 p-4 rounded-lg bg-gray-a2 border border-gray-a4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetName" className="text-2">Their Full Name</Label>
              <Input
                id="targetName"
                variant="frosted"
                placeholder="Enter their full name"
                value={targetName}
                onChange={(e) => setTargetName(e.target.value)}
                disabled={isAnalyzing}
                data-testid="input-target-name"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-2">Their Birth Date</Label>
              <DatePicker
                value={targetDate}
                onChange={setTargetDate}
                disabled={isAnalyzing}
                fromYear={1920}
                toYear={new Date().getFullYear()}
                data-testid="input-target-date"
              />
            </div>
          </div>
          <Button
            variant="gold"
            className="w-full"
            onClick={handleCheck}
            disabled={!targetName || !targetDate || isAnalyzing}
            data-testid="button-check-compatibility"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Analyze Compatibility
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>

        {/* Analyzing State */}
        {isAnalyzing && (
          <div className="p-8 rounded-xl bg-gradient-to-br from-violet-a3 to-amber-a2 border border-violet-a4 text-center" data-testid="analyzing-state">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-8 to-amber-8 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <h3 className="text-4 font-semibold text-gray-12 mb-2">
              {analysisMessages[phase]}
            </h3>
            <p className="text-2 text-gray-11 mb-4">
              Analyzing numerology, zodiac patterns, and energy signatures...
            </p>
            <div className="max-w-xs mx-auto">
              <Progress value={progress} className="h-2" />
              <p className="text-1 text-gray-10 mt-2">{Math.round(progress)}% complete</p>
            </div>
          </div>
        )}

        {/* Results */}
        {phase === 'complete' && result && (
          <div className="space-y-6 animate-fade-in" data-testid="compatibility-result">
            
            {/* Overall Score Header */}
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-a3 to-gray-a2 border border-gray-a4">
              <div className="flex items-center justify-center gap-6 mb-4">
                <div className="text-center">
                  <p className="text-2 font-medium text-gray-12 mb-1">{userName}</p>
                  <Badge variant="outline" size="sm">LP {result.person1Profile.lifePathNumber}</Badge>
                </div>
                
                <div className="relative">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center text-6 font-bold ${getScoreColor(result.overallScore)} text-white shadow-lg`}>
                    {result.overallScore}%
                  </div>
                  <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-amber-9" />
                </div>
                
                <div className="text-center">
                  <p className="text-2 font-medium text-gray-12 mb-1">{targetName.split(' ')[0]}</p>
                  <Badge variant="outline" size="sm">LP {result.person2Profile.lifePathNumber}</Badge>
                </div>
              </div>
              
              <Badge className={`text-3 px-4 py-2 ${getLevelColor(result.level)}`} size="lg">
                {result.level} Match
              </Badge>
              
              {aiInsights && (
                <p className="text-2 text-gray-11 mt-4 max-w-xl mx-auto leading-relaxed">
                  {aiInsights.overviewNarrative}
                </p>
              )}
            </div>

            {/* Tabbed Content */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
                <TabsTrigger value="dimensions" data-testid="tab-dimensions">Dimensions</TabsTrigger>
                <TabsTrigger value="zodiac" data-testid="tab-zodiac">Zodiac</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                {/* AI Insights */}
                {aiInsights && (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-pink-a2 border border-pink-a4">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className="w-4 h-4 text-pink-9" />
                          <p className="text-2 font-medium text-gray-12">Emotional Connection</p>
                        </div>
                        <p className="text-2 text-gray-11">{aiInsights.emotionalConnection}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-blue-a2 border border-blue-a4">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageCircle className="w-4 h-4 text-blue-9" />
                          <p className="text-2 font-medium text-gray-12">Communication</p>
                        </div>
                        <p className="text-2 text-gray-11">{aiInsights.communicationDynamic}</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-violet-a2 border border-violet-a4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-violet-9" />
                          <p className="text-2 font-medium text-gray-12">Growth Potential</p>
                        </div>
                        <p className="text-2 text-gray-11">{aiInsights.growthPotential}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-green-a2 border border-green-a4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-green-9" />
                          <p className="text-2 font-medium text-gray-12">Daily Life Together</p>
                        </div>
                        <p className="text-2 text-gray-11">{aiInsights.dailyLifeTogether}</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-amber-a2 border border-amber-a4">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-amber-9" />
                        <p className="text-2 font-medium text-gray-12">Key Advice</p>
                      </div>
                      <p className="text-2 text-gray-11">{aiInsights.advice}</p>
                    </div>
                  </div>
                )}

                {/* Strengths & Challenges */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-gray-a2 border border-gray-a4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-green-9" />
                      <h4 className="text-3 font-medium text-gray-12">Strengths</h4>
                    </div>
                    <ul className="space-y-2">
                      {result.strengths.map((strength, i) => (
                        <li key={i} className="text-2 text-gray-11 flex items-start gap-2">
                          <span className="text-green-9 mt-0.5">+</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-a2 border border-gray-a4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-amber-9" />
                      <h4 className="text-3 font-medium text-gray-12">Challenges</h4>
                    </div>
                    <ul className="space-y-2">
                      {result.challenges.length > 0 ? result.challenges.map((challenge, i) => (
                        <li key={i} className="text-2 text-gray-11 flex items-start gap-2">
                          <span className="text-amber-9 mt-0.5">!</span>
                          {challenge}
                        </li>
                      )) : (
                        <li className="text-2 text-gray-10">No major challenges identified</li>
                      )}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              {/* Dimensions Tab */}
              <TabsContent value="dimensions" className="space-y-3">
                {Object.entries(result.dimensions).map(([key, dim]) => {
                  const Icon = getDimensionIcon(key);
                  return (
                    <div key={key} className="p-4 rounded-lg bg-gray-a2 border border-gray-a4">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-gray-10" />
                          <span className="text-2 font-medium text-gray-12">{getDimensionLabel(key)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" size="sm">{dim.person1Value}</Badge>
                          <span className="text-1 text-gray-9">vs</span>
                          <Badge variant="outline" size="sm">{dim.person2Value}</Badge>
                          <Badge className={getLevelColor(dim.level)} size="sm">{dim.score}%</Badge>
                        </div>
                      </div>
                      <Progress value={dim.score} className="h-1.5 mb-2" />
                      <p className="text-1 text-gray-10">{dim.insight}</p>
                    </div>
                  );
                })}
              </TabsContent>

              {/* Zodiac Tab */}
              <TabsContent value="zodiac" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Chinese Zodiac */}
                  <div className="p-4 rounded-lg bg-gray-a2 border border-gray-a4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-red-9" />
                        <h4 className="text-3 font-medium text-gray-12">Chinese Zodiac</h4>
                      </div>
                      <Badge className={getLevelColor(result.zodiac.chineseLevel)} size="sm">
                        {result.zodiac.chineseScore}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-center gap-4 mb-3 py-2">
                      <div className="text-center">
                        <p className="text-3 font-medium text-gray-12">{result.person1Profile.chineseZodiac.animal}</p>
                        <p className="text-1 text-gray-10">{result.person1Profile.chineseZodiac.element}</p>
                      </div>
                      <HeartHandshake className="w-5 h-5 text-gray-9" />
                      <div className="text-center">
                        <p className="text-3 font-medium text-gray-12">{result.person2Profile.chineseZodiac.animal}</p>
                        <p className="text-1 text-gray-10">{result.person2Profile.chineseZodiac.element}</p>
                      </div>
                    </div>
                    <p className="text-1 text-gray-11">{result.zodiac.chineseInsight}</p>
                  </div>

                  {/* Western Zodiac */}
                  <div className="p-4 rounded-lg bg-gray-a2 border border-gray-a4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-9" />
                        <h4 className="text-3 font-medium text-gray-12">Western Zodiac</h4>
                      </div>
                      <Badge className={getLevelColor(result.zodiac.westernLevel)} size="sm">
                        {result.zodiac.westernScore}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-center gap-4 mb-3 py-2">
                      <div className="text-center">
                        <p className="text-3 font-medium text-gray-12">{result.person1Profile.westernZodiac.sign}</p>
                        <p className="text-1 text-gray-10">{result.person1Profile.westernZodiac.element}</p>
                      </div>
                      <HeartHandshake className="w-5 h-5 text-gray-9" />
                      <div className="text-center">
                        <p className="text-3 font-medium text-gray-12">{result.person2Profile.westernZodiac.sign}</p>
                        <p className="text-1 text-gray-10">{result.person2Profile.westernZodiac.element}</p>
                      </div>
                    </div>
                    <p className="text-1 text-gray-11">{result.zodiac.westernInsight}</p>
                  </div>
                </div>

                {/* Element Harmony */}
                <div className="p-4 rounded-lg bg-gradient-to-r from-violet-a2 to-amber-a2 border border-gray-a4 text-center">
                  <p className="text-2 font-medium text-gray-12 mb-1">Element Harmony</p>
                  <p className="text-2 text-gray-11">{result.zodiac.elementHarmony}</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Relationship Insights Section */}
        <div className="mt-8 p-6 rounded-xl bg-gray-a2 border border-gray-a4 space-y-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-9 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-3 font-semibold text-gray-12 mb-2">Relationship Insights</h3>
              <p className="text-2 text-gray-11 leading-relaxed">
                Understanding energy compatibility helps you navigate relationships more consciously. High compatibility doesn't guarantee success, and challenges can lead to growth.
              </p>
              <p className="text-2 text-gray-11 leading-relaxed mt-2">
                Use these insights as guidance, not absolute predictions. Every relationship requires effort and understanding.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-a4 pt-4">
            <h4 className="text-2 font-medium text-gray-12 mb-3">Compatibility Levels</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-green-a2">
                <div className="w-2 h-2 rounded-full bg-green-9" />
                <div>
                  <p className="text-1 font-medium text-gray-12">Ideal</p>
                  <p className="text-0 text-gray-10">Exceptional alignment</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-green-a2/50">
                <div className="w-2 h-2 rounded-full bg-green-7" />
                <div>
                  <p className="text-1 font-medium text-gray-12">Harmonious</p>
                  <p className="text-0 text-gray-10">Natural flow</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-a2">
                <div className="w-2 h-2 rounded-full bg-amber-7" />
                <div>
                  <p className="text-1 font-medium text-gray-12">Neutral</p>
                  <p className="text-0 text-gray-10">Balanced connection</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-red-a2/50">
                <div className="w-2 h-2 rounded-full bg-red-7" />
                <div>
                  <p className="text-1 font-medium text-gray-12">Challenging</p>
                  <p className="text-0 text-gray-10">Growth opportunities</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-red-a2">
                <div className="w-2 h-2 rounded-full bg-red-9" />
                <div>
                  <p className="text-1 font-medium text-gray-12">Avoid</p>
                  <p className="text-0 text-gray-10">Exercise caution</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
