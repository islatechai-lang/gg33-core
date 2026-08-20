import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { TimePicker } from '@/components/ui/time-picker';
import { User, Calendar, Clock, MapPin, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { parseUTCDate, formatUTCDate } from '@shared/dateUtils';

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileModal({ open, onOpenChange }: EditProfileModalProps) {
  const { dbUser, refreshDbUser } = useAuth();
  const { toast } = useToast();

  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [birthTime, setBirthTime] = useState('');
  const [isTimeUnknown, setIsTimeUnknown] = useState(false);
  const [birthLocation, setBirthLocation] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Sync state with dbUser when modal opens
  useEffect(() => {
    if (open && dbUser) {
      setFullName(dbUser.fullName || '');
      setBirthDate(dbUser.birthDate ? parseUTCDate(dbUser.birthDate) : undefined);
      
      const timeVal = dbUser.birthTime || '12:00';
      if (!dbUser.birthTime || dbUser.birthTime === '12:00' || dbUser.birthTime === 'unknown') {
        setBirthTime('12:00');
        setIsTimeUnknown(dbUser.birthTime === 'unknown' || !dbUser.birthTime);
      } else {
        setBirthTime(timeVal);
        setIsTimeUnknown(false);
      }

      setBirthLocation(dbUser.birthLocation || '');
    }
  }, [open, dbUser]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!dbUser?.odisId) return;

    if (!fullName.trim() || fullName.trim().length < 2) {
      toast({
        variant: 'destructive',
        title: 'Invalid Name',
        description: 'Please enter a valid full name (at least 2 characters).',
      });
      return;
    }

    if (!birthDate) {
      toast({
        variant: 'destructive',
        title: 'Birth Date Required',
        description: 'Please select your birth date.',
      });
      return;
    }

    setIsSaving(true);
    try {
      const formattedDateStr = formatUTCDate(birthDate);
      const finalBirthTime = isTimeUnknown ? '12:00' : (birthTime || '12:00');
      const finalLocation = birthLocation.trim() || 'Unknown Location';

      const res = await apiRequest('PUT', `/api/profile/${dbUser.odisId}`, {
        fullName: fullName.trim(),
        birthDate: formattedDateStr,
        birthTime: finalBirthTime,
        birthLocation: finalLocation,
      });

      const data = await res.json();

      if (data.success || data.user) {
        toast({
          title: 'Profile Updated!',
          description: 'Your numerology, daily energy, and birth chart have been recalculated.',
        });

        await refreshDbUser();
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['/api/me'] }),
          queryClient.invalidateQueries({ queryKey: ['/api/profile', dbUser.odisId] }),
          queryClient.invalidateQueries({ queryKey: ['/api/daily-energy'] }),
        ]);

        onOpenChange(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Update Failed',
          description: data.error || 'Failed to update profile information.',
        });
      }
    } catch (err: any) {
      console.error('Profile update error:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not connect to server to save changes.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-md p-0 rounded-2xl border-zinc-800 bg-zinc-950 overflow-hidden text-zinc-100 max-h-[92vh] flex flex-col">
        <form onSubmit={handleSave} className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="p-6 pb-4 border-b border-zinc-800/80">
            <DialogHeader className="space-y-1 text-left">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <DialogTitle className="text-lg font-bold text-zinc-100">
                  Edit Personal Profile
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-zinc-400">
                Update your birth details. All numerology and astrological chart calculations will automatically recalculate.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Form Fields */}
          <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" /> Full Name
              </Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full birth name"
                className="h-10 bg-zinc-900/80 border-zinc-800 focus:border-amber-500 text-xs text-zinc-100 rounded-xl"
                disabled={isSaving}
              />
              <p className="text-[11px] text-zinc-500">Used for your Destiny, Soul Urge, and Personality numbers.</p>
            </div>

            {/* Birth Date */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> Date of Birth
              </Label>
              <DatePicker
                value={birthDate}
                onChange={setBirthDate}
                placeholder="Select birth date"
                className="w-full h-10 bg-zinc-900/80 border-zinc-800 rounded-xl text-xs"
                disabled={isSaving}
              />
              <p className="text-[11px] text-zinc-500">Used to calculate your Life Path, Zodiacs, and Planetary positions.</p>
            </div>

            {/* Birth Time */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> Time of Birth
                </Label>
                <button
                  type="button"
                  onClick={() => setIsTimeUnknown(!isTimeUnknown)}
                  className={`text-[11px] font-medium transition-colors ${
                    isTimeUnknown ? 'text-amber-400 underline' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {isTimeUnknown ? '✓ Time set to Solar Noon' : 'I don\'t know exact time'}
                </button>
              </div>

              {!isTimeUnknown ? (
                <TimePicker
                  value={birthTime}
                  onChange={setBirthTime}
                  className="w-full h-10 bg-zinc-900/80 border-zinc-800 rounded-xl text-xs"
                  disabled={isSaving}
                />
              ) : (
                <div className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800 text-[11px] text-zinc-400">
                  Defaulted to 12:00 PM (Solar Noon standard for Astrological charts).
                </div>
              )}
              <p className="text-[11px] text-zinc-500">Provides exact Ascendant (Rising Sign) and house cusp degrees.</p>
            </div>

            {/* Birth Location */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" /> Place of Birth (City, Country)
              </Label>
              <Input
                value={birthLocation}
                onChange={(e) => setBirthLocation(e.target.value)}
                placeholder="e.g. Los Angeles, California or London, UK"
                className="h-10 bg-zinc-900/80 border-zinc-800 focus:border-amber-500 text-xs text-zinc-100 rounded-xl"
                disabled={isSaving}
              />
              <p className="text-[11px] text-zinc-500">Used for geographic coordinates in your Astrological Natal chart.</p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-6 border-t border-zinc-800/80 flex items-center justify-end gap-3 bg-zinc-950">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-zinc-800 text-xs h-9 px-4 rounded-xl text-zinc-300 hover:bg-zinc-900"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs h-9 px-5 rounded-xl shadow-md shadow-amber-500/20"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  Recalculating...
                </>
              ) : (
                'Save & Recalculate'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
