import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

const ADMIN_EMAIL = 'princederder44@gmail.com';

function getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(navigator.userAgent)) {
    return 'mobile';
  }
  return 'desktop';
}

function getBrowserName(): string {
  if (typeof window === 'undefined') return 'Unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('SamsungBrowser')) return 'Samsung Internet';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  if (ua.includes('Edge') || ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  return 'Other';
}

function getOSName(): string {
  if (typeof window === 'undefined') return 'Unknown';
  const ua = navigator.userAgent;
  if (/Windows/i.test(ua)) return 'Windows';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  if (/Android/i.test(ua)) return 'Android';
  if (/Mac/i.test(ua)) return 'macOS';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Other';
}

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'anonymous';
  try {
    let sid = sessionStorage.getItem('gg33_sid');
    if (!sid) {
      sid = 'sid_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
      sessionStorage.setItem('gg33_sid', sid);
    }
    return sid;
  } catch {
    return 'anonymous';
  }
}

export function PageTracker() {
  const router = useRouter();
  const { dbUser } = useAuth();
  const lastTrackedPath = useRef<string | null>(null);
  const lastTrackedTime = useRef<number>(0);

  useEffect(() => {
    // If the logged-in user is the owner, immediately flag localStorage so all future requests & sessions are excluded
    if (dbUser?.email && dbUser.email.trim().toLowerCase() === ADMIN_EMAIL) {
      try {
        localStorage.setItem('gg33_admin_exclude', 'true');
      } catch {}

      // Identify to Microsoft Clarity as admin/excluded
      if (typeof window !== 'undefined' && typeof (window as any).clarity === 'function') {
        (window as any).clarity('set', 'is_admin', 'true');
        (window as any).clarity('identify', 'admin_owner');
      }
      return;
    }

    // Function to track current path
    const trackCurrentPage = (path: string) => {
      if (typeof window === 'undefined') return;

      // Check admin exclusions
      const isExcluded =
        dbUser?.email?.trim().toLowerCase() === ADMIN_EMAIL ||
        localStorage.getItem('gg33_admin_exclude') === 'true' ||
        path.startsWith('/admin');

      if (isExcluded) {
        return;
      }

      // Avoid duplicate hits for same route within 3 seconds
      const now = Date.now();
      if (lastTrackedPath.current === path && now - lastTrackedTime.current < 3000) {
        return;
      }

      lastTrackedPath.current = path;
      lastTrackedTime.current = now;

      const payload = {
        path,
        referrer: document.referrer || '',
        sessionId: getOrCreateSessionId(),
        device: getDeviceType(),
        browser: getBrowserName(),
        os: getOSName(),
        userId: dbUser?.odisId || null,
        userEmail: dbUser?.email || null,
        isPro: Boolean(dbUser?.isPro),
      };

      try {
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {});
      } catch {}

      // Tag Microsoft Clarity with user status for actual users
      if (typeof (window as any).clarity === 'function') {
        if (dbUser?.isPro) {
          (window as any).clarity('set', 'user_type', 'pro');
        } else if (dbUser) {
          (window as any).clarity('set', 'user_type', 'free');
        } else {
          (window as any).clarity('set', 'user_type', 'guest');
        }
      }
    };

    // Track on initial mount
    trackCurrentPage(router.asPath);

    // Track on Next.js route change
    const handleRouteChange = (url: string) => {
      trackCurrentPage(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.asPath, router.events, dbUser]);

  return null;
}
