import {
  calculateComprehensiveProfile,
  getNumberMeaning
} from '@/lib/numerology';
import { ProfileData } from '@/components/ProfileSetup';
import { displayUTCDate } from '@shared/dateUtils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Edit2, Check, X, Clock } from 'lucide-react';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { TimePicker } from '@/components/ui/time-picker';
import { Button } from '@/components/ui/button';

interface ProfileHeaderProps {
  profile: ProfileData;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [tempBirthTime, setTempBirthTime] = useState(profile.birthTime || '12:00');
  const { toast } = useToast();

  const updateProfileMutation = useMutation({
    mutationFn: async (newTime: string) => {
      const response = await apiRequest('PUT', `/api/profile/${profile.odisId}`, {
        birthTime: newTime,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/me'] });
      queryClient.invalidateQueries({ queryKey: [`/api/profile/${profile.odisId}`] });
      setIsEditingTime(false);
      toast({
        title: "Profile updated",
        description: "Your birth time has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Failed to update profile:', error);
      toast({
        title: "Update failed",
        description: "Could not update birth time. Please try again.",
        variant: "destructive",
      });
    },
  });

  const fullProfile = calculateComprehensiveProfile(
    profile.fullName,
    profile.birthDate,
    profile.birthTime,
    profile.birthLocation
  );

  const lifePathMeaning = getNumberMeaning(fullProfile.lifePathNumber);
  const firstName = profile.fullName.split(' ')[0];

  const handleSaveTime = () => {
    updateProfileMutation.mutate(tempBirthTime);
  };

  return (
    <Card variant="frosted" className="overflow-hidden relative" data-testid="card-profile-header">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-a2 via-transparent to-violet-a2 pointer-events-none" />

      <CardContent className="relative py-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0 text-center md:text-left">
            <p className="text-1 text-gray-11">Welcome back,</p>
            <h2 className="text-6 font-semibold text-gray-12" data-testid="text-user-name">{firstName}</h2>
            <div className="flex flex-col gap-2 mt-2 items-center md:items-start">
              <div className="flex items-center gap-2 justify-center md:justify-start flex-wrap">
                <Badge variant="outline" data-testid="badge-life-path">
                  Life Path {fullProfile.lifePathNumber}
                </Badge>
                <span className="text-1 text-gray-10">
                  {displayUTCDate(profile.birthDate, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isEditingTime ? (
                  <div className="flex items-center gap-2 bg-gray-a2 p-1 rounded-md animate-fade-in">
                    <TimePicker
                      value={tempBirthTime}
                      onChange={setTempBirthTime}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleSaveTime}
                      disabled={updateProfileMutation.isPending}
                      className="h-8 w-8"
                      data-testid="button-save-time"
                    >
                      <Check className="w-4 h-4 text-green-9" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setIsEditingTime(false);
                        setTempBirthTime(profile.birthTime || '12:00');
                      }}
                      className="h-8 w-8"
                      data-testid="button-cancel-time"
                    >
                      <X className="w-4 h-4 text-red-9" />
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditingTime(true)}
                    className="flex items-center gap-1.5 text-1 text-gray-11 hover:text-amber-9 transition-colors group px-2 py-1 rounded-md hover:bg-gray-a2"
                    data-testid="button-edit-time"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{profile.birthTime || 'Set birth time'}</span>
                    <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 text-center py-4 px-6 rounded-lg bg-gray-a3 border border-gray-5/50">
            <p className="text-0 text-gray-10 uppercase tracking-wider mb-1">Your Energy Signature</p>
            <h3 className="text-5 font-semibold gradient-text" data-testid="text-energy-signature">
              {fullProfile.energySignature}
            </h3>
            <p className="text-2 text-gray-11 mt-1 italic flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-9" />
              "{lifePathMeaning.title}"
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
