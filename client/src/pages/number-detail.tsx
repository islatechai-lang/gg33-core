import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, Heart, Brain, Sparkles, Target, Zap, Sun, Calendar, Hash, TrendingUp, Users, Clock } from 'lucide-react';
import { ProGatekeeper } from '@/components/ProGatekeeper';
import {
  lifePathContent,
  expressionContent,
  soulUrgeContent,
  personalityContent,
  attitudeContent,
  generationContent,
  dayOfBirthContent,
  maturityContent,
  getNumberContent,
  type LifePathContent,
  type ExpressionContent,
  type SoulUrgeContent,
  type PersonalityContent,
  type AttitudeContent,
  type GenerationContent,
  type DayOfBirthContent,
  type MaturityContent
} from '@/lib/numerologyContent';

type NumberType = 'lifepath' | 'expression' | 'soulurge' | 'personality' | 'attitude' | 'generation' | 'dayofbirth' | 'maturity';

interface NumberDetailProps {
  type: NumberType;
  number: number;
}

const typeConfig: Record<NumberType, { 
  title: string; 
  icon: typeof Star; 
  color: string;
  bgColor: string;
  description: string;
}> = {
  lifepath: {
    title: 'Life Path Number',
    icon: Star,
    color: 'text-amber-9',
    bgColor: 'bg-amber-a3',
    description: 'Your Life Path number reveals your life purpose and the journey you are meant to take.'
  },
  expression: {
    title: 'Expression Number',
    icon: Sparkles,
    color: 'text-violet-9',
    bgColor: 'bg-violet-a3',
    description: 'Your Expression number reveals your natural talents, abilities, and the way you are meant to express yourself in the world.'
  },
  soulurge: {
    title: 'Soul Urge Number',
    icon: Heart,
    color: 'text-rose-9',
    bgColor: 'bg-rose-a3',
    description: 'Your Soul Urge number reveals your deepest inner desires, motivations, and what truly makes your heart sing.'
  },
  personality: {
    title: 'Personality Number',
    icon: Brain,
    color: 'text-blue-9',
    bgColor: 'bg-blue-a3',
    description: 'Your Personality number reveals how others perceive you and the outer impression you make on the world.'
  },
  attitude: {
    title: 'Attitude Number',
    icon: Zap,
    color: 'text-orange-9',
    bgColor: 'bg-orange-a3',
    description: 'Your Attitude number reveals your initial approach to life situations and how you react to new circumstances.'
  },
  generation: {
    title: 'Generation Number',
    icon: Users,
    color: 'text-teal-9',
    bgColor: 'bg-teal-a3',
    description: 'Your Generation number reveals the collective energy you share with others born in your era.'
  },
  dayofbirth: {
    title: 'Day of Birth Number',
    icon: Calendar,
    color: 'text-emerald-9',
    bgColor: 'bg-emerald-a3',
    description: 'Your Day of Birth number reveals the special gifts and talents you brought into this life.'
  },
  maturity: {
    title: 'Maturity Number',
    icon: TrendingUp,
    color: 'text-indigo-9',
    bgColor: 'bg-indigo-a3',
    description: 'Your Maturity number reveals the direction your life will take as you grow older and wiser.'
  }
};

function Section({ title, content, icon: Icon }: { title: string; content: string; icon?: typeof Star }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-amber-9" />}
        <h3 className="text-4 font-semibold text-gray-12">{title}</h3>
      </div>
      <p className="text-3 text-gray-11 leading-relaxed">{content}</p>
    </div>
  );
}

function LifePathDetail({ content }: { content: LifePathContent }) {
  return (
    <div className="space-y-8">
      <Section title="Overview" content={content.description} icon={Star} />
      <Section title="Dark Side" content={content.darkSide} icon={Zap} />
      <Section title="Lessons to Learn" content={content.lessonsToLearn} icon={Brain} />
      <Section title="Work & Career" content={content.work} icon={Target} />
      <Section title="Love & Relationships" content={content.love} icon={Heart} />
      <Section title="Health" content={content.health} icon={Sun} />
      <Section title="Ultimate Accomplishment" content={content.accomplishment} icon={TrendingUp} />
    </div>
  );
}

function ExpressionDetail({ content }: { content: ExpressionContent }) {
  return (
    <div className="space-y-8">
      <Section title="Overview" content={content.description} icon={Sparkles} />
      <Section title="Natural Talents" content={content.talents} icon={Star} />
      <Section title="Challenges" content={content.challenges} icon={Zap} />
      <Section title="Ideal Careers" content={content.career} icon={Target} />
    </div>
  );
}

function SoulUrgeDetail({ content }: { content: SoulUrgeContent }) {
  return (
    <div className="space-y-8">
      <Section title="Overview" content={content.description} icon={Heart} />
      <Section title="Inner Desires" content={content.innerDesires} icon={Sparkles} />
      <Section title="Path to Fulfillment" content={content.fulfillment} icon={Star} />
    </div>
  );
}

function PersonalityDetail({ content }: { content: PersonalityContent }) {
  return (
    <div className="space-y-8">
      <Section title="Overview" content={content.description} icon={Brain} />
      <Section title="First Impression" content={content.firstImpression} icon={Star} />
      <Section title="Social Style" content={content.socialStyle} icon={Users} />
    </div>
  );
}

function AttitudeDetail({ content }: { content: AttitudeContent }) {
  return (
    <div className="space-y-8">
      <Section title="Overview" content={content.description} icon={Zap} />
      <Section title="Harmonious Behavior" content={content.harmoniousBehavior} icon={Heart} />
      <Section title="Dark Side" content={content.darkSide} icon={Star} />
    </div>
  );
}

function GenerationDetail({ content }: { content: GenerationContent }) {
  return (
    <div className="space-y-8">
      <Section title="Overview" content={content.description} icon={Users} />
      <Section title="Collective Energy" content={content.collectiveEnergy} icon={Sparkles} />
    </div>
  );
}

function DayOfBirthDetail({ content }: { content: DayOfBirthContent }) {
  return (
    <div className="space-y-8">
      <Section title="Overview" content={content.description} icon={Calendar} />
      <Section title="Special Gifts" content={content.specialGifts} icon={Star} />
    </div>
  );
}

function MaturityDetail({ content }: { content: MaturityContent }) {
  return (
    <div className="space-y-8">
      <Section title="Overview" content={content.description} icon={TrendingUp} />
      <Section title="Later Life Goals" content={content.laterLifeGoals} icon={Target} />
    </div>
  );
}

const ODIS_ID_KEY = 'gg33-odis-id';

export default function NumberDetailPage() {
  const [, setLocation] = useLocation();
  const [type, setType] = useState<NumberType | null>(null);
  const [number, setNumber] = useState<number | null>(null);
  const savedOdisId = localStorage.getItem(ODIS_ID_KEY);

  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: ['/api/profile', savedOdisId],
    queryFn: async () => {
      if (!savedOdisId) return null;
      const response = await fetch(`/api/profile/${savedOdisId}`);
      if (!response.ok) return null;
      const data = await response.json();
      return data.user;
    },
    enabled: !!savedOdisId,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const isPro = isProfileLoading ? true : (profileData?.isPro ?? false);

  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/number\/(\w+)\/(\d+)/);
    if (match) {
      setType(match[1] as NumberType);
      setNumber(parseInt(match[2]));
    }
  }, []);

  if (!type || !number) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-11">Loading...</p>
        </div>
      </div>
    );
  }

  const config = typeConfig[type];
  const normalizedNumber = getNumberContent(number);
  const Icon = config.icon;

  const getContent = () => {
    switch (type) {
      case 'lifepath':
        return lifePathContent[normalizedNumber];
      case 'expression':
        return expressionContent[normalizedNumber];
      case 'soulurge':
        return soulUrgeContent[normalizedNumber];
      case 'personality':
        return personalityContent[normalizedNumber];
      case 'attitude':
        return attitudeContent[normalizedNumber];
      case 'generation':
        return generationContent[normalizedNumber];
      case 'dayofbirth':
        return dayOfBirthContent[normalizedNumber];
      case 'maturity':
        return maturityContent[normalizedNumber];
      default:
        return null;
    }
  };

  const content = getContent();

  if (!content) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-11">Content not found for this number.</p>
          <Button variant="outline" onClick={() => setLocation('/')} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const renderDetail = () => {
    switch (type) {
      case 'lifepath':
        return <LifePathDetail content={content as LifePathContent} />;
      case 'expression':
        return <ExpressionDetail content={content as ExpressionContent} />;
      case 'soulurge':
        return <SoulUrgeDetail content={content as SoulUrgeContent} />;
      case 'personality':
        return <PersonalityDetail content={content as PersonalityContent} />;
      case 'attitude':
        return <AttitudeDetail content={content as AttitudeContent} />;
      case 'generation':
        return <GenerationDetail content={content as GenerationContent} />;
      case 'dayofbirth':
        return <DayOfBirthDetail content={content as DayOfBirthContent} />;
      case 'maturity':
        return <MaturityDetail content={content as MaturityContent} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-gray-a3">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setLocation('/')}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${config.color}`} />
            </div>
            <div>
              <h1 className="text-4 font-semibold text-gray-12">{config.title}</h1>
              <p className="text-2 text-gray-10">Number {number}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <ProGatekeeper 
          isPro={isPro}
          title={`Unlock ${config.title} Insights`}
          description={`Upgrade to Pro to access the complete interpretation of your ${config.title.toLowerCase()} and discover deeper meanings about your path.`}
        >
          <Card className="mb-8">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className={`w-20 h-20 rounded-xl ${config.bgColor} flex items-center justify-center`}>
                  <span className="text-8 font-bold text-gray-12">{number}</span>
                </div>
                <div className="flex-1">
                  <Badge variant="secondary" className="mb-2">{content.title}</Badge>
                  <p className="text-3 text-gray-11">{config.description}</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardContent className="p-6 sm:p-8">
              {renderDetail()}
            </CardContent>
          </Card>
        </ProGatekeeper>

      </div>
    </div>
  );
}
