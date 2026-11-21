import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  LifeBuoy,
  Bug,
  Lightbulb,
  HelpCircle,
  CreditCard,
  Mail,
  Copy,
  Check,
  Send,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface SupportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SUPPORT_EMAIL = 'princederder44@gmail.com';

const categories = [
  { id: 'bug', label: 'Report a Bug', icon: Bug, color: 'text-rose-400 border-rose-500/25 bg-rose-500/10' },
  { id: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'text-amber-400 border-amber-500/25 bg-amber-500/10' },
  { id: 'question', label: 'Question / Advice', icon: HelpCircle, color: 'text-blue-400 border-blue-500/25 bg-blue-500/10' },
  { id: 'billing', label: 'Billing / Pro', icon: CreditCard, color: 'text-emerald-400 border-emerald-500/25 bg-emerald-500/10' },
];

export function SupportModal({ open, onOpenChange }: SupportModalProps) {
  const { toast } = useToast();
  const { user, dbUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('bug');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL);
      setCopied(true);
      toast({
        title: 'Email Copied!',
        description: `${SUPPORT_EMAIL} copied to your clipboard.`,
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast({
        variant: 'destructive',
        title: 'Copy Failed',
        description: `Please copy manually: ${SUPPORT_EMAIL}`,
      });
    }
  };

  const handleSendMessage = () => {
    const categoryObj = categories.find((c) => c.id === selectedCategory);
    const categoryLabel = categoryObj ? categoryObj.label : 'General Inquiry';
    const userEmail = user?.email || dbUser?.email || 'Anonymous';
    const userName = dbUser?.fullName || 'User';

    const subject = encodeURIComponent(`[GG33 CORE Support] ${categoryLabel} - ${userName}`);
    const bodyContent = `${message ? `${message}\n\n` : ''}---\nSender: ${userName} (${userEmail})\nCategory: ${categoryLabel}\nApp: GG33 CORE Web/Mobile App`;
    const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${encodeURIComponent(bodyContent)}`;

    window.open(mailtoUrl, '_blank');

    toast({
      title: 'Opening Email Client',
      description: 'Your report is ready to send. Thank you for your feedback!',
    });

    setMessage('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-md p-0 rounded-3xl border-white/10 bg-zinc-950/95 backdrop-blur-2xl text-zinc-100 shadow-2xl overflow-hidden">
        <div className="p-5 sm:p-6 space-y-4">
          <DialogHeader className="space-y-1 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm flex-shrink-0">
                <LifeBuoy className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-white flex items-center gap-1.5">
                  Help & Support
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-400">
                  Report a bug, suggest features, or contact the creator directly.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Category Chips */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
              What can we help you with?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'border-amber-400/50 bg-amber-500/15 text-amber-200 shadow-sm'
                        : 'border-white/[0.08] bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message Area */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
              Your Message or Concern
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe what happened, what feature you'd love to see, or any question..."
              rows={3}
              className="w-full rounded-2xl bg-white/[0.04] border border-white/10 p-3 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-400/50 transition-colors resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            variant="gold"
            onClick={handleSendMessage}
            className="w-full h-11 rounded-2xl font-bold text-xs sm:text-sm gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98]"
          >
            <Send className="w-4 h-4" />
            <span>Send to Support</span>
          </Button>

          {/* Direct Email Card */}
          <div className="pt-2 border-t border-white/[0.06]">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-zinc-300 flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-zinc-400 font-medium">Direct Creator Email</p>
                  <p className="text-xs font-mono text-zinc-200 truncate">{SUPPORT_EMAIL}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyEmail}
                className="h-8 px-2.5 rounded-xl text-xs border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white flex-shrink-0 ml-2"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400 mr-1" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            </div>
            <p className="text-[10px] text-zinc-500 text-center mt-2">
              ⚡ We take every bug and suggestion seriously. Responses typically within 24 hours.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
