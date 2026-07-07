import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { TimePicker } from '@/components/ui/time-picker';
import { Calendar, Sparkles, ArrowRight, ArrowLeft, Clock, MapPin, User, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { format } from 'date-fns';
import { formatUTCDate, parseUTCDate } from '@shared/dateUtils';

export interface ProfileData {
  odisId: string;
  fullName: string;
  birthDate: Date;
  birthTime: string;
  birthLocation: string;
}

interface ProfileSetupProps {
  onComplete: (profile: ProfileData) => void;
}

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [birthTime, setBirthTime] = useState('');
  const [birthLocation, setBirthLocation] = useState('');
  const [step, setStep] = useState(1);

  const totalSteps = 4;

  const canProceedToNext = useCallback(() => {
    switch (step) {
      case 1: return fullName.trim().length >= 2;
      case 2: return !!birthDate;
      case 3: return true;
      case 4: return true;
      default: return false;
    }
  }, [step, fullName, birthDate]);

  const goToNextStep = useCallback(() => {
    if (canProceedToNext() && step < totalSteps) {
      setStep(step + 1);
    }
  }, [canProceedToNext, step, totalSteps]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const target = e.target as HTMLElement;
        if (target.closest('[role="listbox"]') || target.closest('[role="dialog"]')) {
          return;
        }

        if (step < totalSteps && canProceedToNext()) {
          e.preventDefault();
          goToNextStep();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, canProceedToNext, goToNextStep, totalSteps]);

  const createProfileMutation = useMutation({
    mutationFn: async (data: { fullName: string; birthDate: string; birthTime: string; birthLocation: string }) => {
      const response = await apiRequest('POST', '/api/profile', {
        fullName: data.fullName,
        birthDate: data.birthDate,
        birthTime: data.birthTime || '12:00',
        birthLocation: data.birthLocation || 'Unknown',
      });
      return response.json();
    },
    onSuccess: (data) => {
      const user = data.user;
      onComplete({
        odisId: user.odisId,
        fullName: user.fullName,
        birthDate: parseUTCDate(user.birthDate),
        birthTime: user.birthTime || '12:00',
        birthLocation: user.birthLocation || 'Unknown',
      });
    },
    onError: (error) => {
      console.error('Failed to create profile:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName && birthDate) {
      createProfileMutation.mutate({
        fullName,
        birthDate: formatUTCDate(birthDate),
        birthTime,
        birthLocation,
      });
    }
  };

  const getStepInfo = () => {
    switch (step) {
      case 1:
        return {
          icon: User,
          title: 'Your Full Legal Name',
          description: 'We use your complete name to calculate your Expression Number, Soul Urge, and Personality Number',
        };
      case 2:
        return {
          icon: Calendar,
          title: 'Your Birth Date',
          description: 'Your birth date reveals your Life Path Number and Chinese Zodiac sign',
        };
      case 3:
        return {
          icon: Clock,
          title: 'Time of Birth',
          description: 'For precise Moon Sign calculation (optional but recommended)',
        };
      case 4:
        return {
          icon: MapPin,
          title: 'Birth Location',
          description: 'Helps determine your exact cosmic alignment (optional)',
        };
      default:
        return { icon: Sparkles, title: '', description: '' };
    }
  };

  const stepInfo = getStepInfo();
  const StepIcon = stepInfo.icon;
  const isSubmitting = createProfileMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card variant="frosted" className="w-full max-w-md relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-a3 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-violet-a3 rounded-full blur-3xl" />

        <CardHeader className="text-center relative z-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-gold-gradient flex items-center justify-center shadow-lg animate-scale-in">
            <StepIcon className="w-8 h-8 text-gray-1" />
          </div>
          <CardTitle className="text-6 gradient-text">Find Your Great</CardTitle>
          <CardDescription className="text-2 mt-2 text-gray-11">
            {stepInfo.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10">
          <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-profile-setup">
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-2 font-medium">
                    {stepInfo.title}
                  </Label>
                  <Input
                    id="fullName"
                    variant="frosted"
                    placeholder="e.g., John Michael Smith"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="text-3"
                    autoComplete="name"
                    data-testid="input-full-name"
                  />
                  <p className="text-0 text-gray-10">
                    Enter your name exactly as it appears on your birth certificate
                  </p>
                </div>
                <Button
                  type="button"
                  variant="gold"
                  className="w-full"
                  onClick={goToNextStep}
                  disabled={!canProceedToNext()}
                  data-testid="button-continue-1"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label className="text-2 font-medium">
                    {stepInfo.title}
                  </Label>
                  <DatePicker
                    value={birthDate}
                    onChange={setBirthDate}
                    placeholder="Select your birth date"
                    fromYear={1920}
                    toYear={new Date().getFullYear()}
                    data-testid="input-birthdate"
                  />
                  <p className="text-0 text-gray-10">
                    Choose the date you were born
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                    data-testid="button-back-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    variant="gold"
                    className="flex-1"
                    onClick={goToNextStep}
                    disabled={!canProceedToNext()}
                    data-testid="button-continue-2"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label className="text-2 font-medium">
                    {stepInfo.title}
                  </Label>
                  <TimePicker
                    value={birthTime}
                    onChange={setBirthTime}
                    data-testid="input-birthtime"
                  />
                  <p className="text-0 text-gray-10">
                    Check your birth certificate or ask a parent if unsure
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="flex-1"
                    data-testid="button-back-3"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    variant="gold"
                    className="flex-1"
                    onClick={goToNextStep}
                    data-testid="button-continue-3"
                  >
                    {birthTime ? 'Continue' : 'Skip'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="birthlocation" className="text-2 font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-9" />
                    {stepInfo.title}
                  </Label>
                  <Input
                    id="birthlocation"
                    type="text"
                    variant="frosted"
                    placeholder="e.g., Los Angeles, CA"
                    value={birthLocation}
                    onChange={(e) => setBirthLocation(e.target.value)}
                    className="text-3"
                    data-testid="input-birthlocation"
                  />
                  <p className="text-0 text-gray-10">
                    City and country where you were born
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(3)}
                    className="flex-1"
                    disabled={isSubmitting}
                    data-testid="button-back-4"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="gold"
                    className="flex-1"
                    disabled={isSubmitting}
                    data-testid="button-reveal"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Reveal My Energy
                        <Sparkles className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>

          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full transition-colors ${s === step ? 'bg-amber-9' : s < step ? 'bg-amber-7' : 'bg-gray-6'
                  }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
