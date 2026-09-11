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
  Share2,
  Copy,
  Check,
  MessageCircle,
  Send,
  Facebook,
  Mail,
  Smartphone,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Optional custom URL/text override if needed for specific pages
  customUrl?: string;
  customText?: string;
}

// Default app share URL — ready to swap with Play Store link once live!
export const APP_SHARE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://gg33-core.vercel.app';
export const APP_SHARE_TITLE = 'GG33 CORE — Numerology & Astrology Birth Chart';
export const APP_SHARE_TEXT = 'Discover your authentic numerology blueprint, daily energy alignment, and Western astrology birth chart with GG33 CORE! 🔢✨';

export function ShareModal({ open, onOpenChange, customUrl, customText }: ShareModalProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const shareUrl = customUrl || APP_SHARE_URL;
  const shareText = customText || APP_SHARE_TEXT;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: 'Link Copied! 📋',
        description: 'Share link has been copied to your clipboard.',
      });
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy link:', err);
      toast({
        variant: 'destructive',
        title: 'Copy Failed',
        description: 'Please copy the link manually from the input.',
      });
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: APP_SHARE_TITLE,
          text: shareText,
          url: shareUrl,
        });
        onOpenChange(false);
      } catch (err) {
        // User cancelled or share failed, fallback remains open
        console.log('Share dismissed or not completed');
      }
    }
  };

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20',
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-sky-500/10 text-sky-400 border-sky-500/30 hover:bg-sky-500/20',
      href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'X (Twitter)',
      icon: ExternalLink,
      color: 'bg-zinc-800/80 text-zinc-200 border-zinc-700 hover:bg-zinc-800',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'SMS',
      icon: Smartphone,
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20',
      href: `sms:?body=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500/20',
      href: `mailto:?subject=${encodeURIComponent(APP_SHARE_TITLE)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`,
    },
  ];

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-md p-0 rounded-2xl border-zinc-800 bg-zinc-950 overflow-hidden text-zinc-100 shadow-2xl">
        <div className="p-6 space-y-5">
          {/* Header */}
          <DialogHeader className="space-y-1.5 text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-zinc-100 flex items-center gap-1.5">
                  Share GG33 CORE
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-400">
                  Share esoteric numerology & birth charts with friends
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Social Quick-Share Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onOpenChange(false)}
                  className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-all cursor-pointer ${social.color}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[11px] font-semibold">{social.name}</span>
                </a>
              );
            })}
          </div>

          {/* Native System Share Button (if available on mobile browser) */}
          {hasNativeShare && (
            <Button
              onClick={handleNativeShare}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs h-10 rounded-xl shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              Open Device Share Menu
            </Button>
          )}

          {/* Copy Link Input Bar */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
              Or Copy Share Link
            </label>
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent px-2.5 text-xs text-zinc-300 font-mono focus:outline-none truncate select-all"
              />
              <Button
                size="sm"
                onClick={handleCopyLink}
                className={`h-8 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  copied
                    ? 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
