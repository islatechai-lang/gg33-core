import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

const ADMIN_EMAIL = 'princederder44@gmail.com';

export function getAppAndDeviceInfo(): {
  device: 'mobile' | 'desktop' | 'tablet';
  platform: 'android_app' | 'ios_app' | 'mobile_web' | 'desktop_web';
  isNativeApp: boolean;
} {
  if (typeof window === 'undefined') {
    return { device: 'desktop', platform: 'desktop_web', isNativeApp: false };
  }

  const ua = navigator.userAgent || '';
  const uaLower = ua.toLowerCase();
  const win = window as any;

  // 1. Median.co App & GoNative detection (Google Play Store wrapper)
  const isMedianApp =
    typeof win.median !== 'undefined' ||
    typeof win.gonative !== 'undefined' ||
    uaLower.includes('median') ||
    uaLower.includes('gonative');

  // 2. Android WebView detection
  const isAndroid = uaLower.includes('android');
  const isIOS = /iphone|ipad|ipod/.test(uaLower);
  const isAndroidWebView = isAndroid && (uaLower.includes('; wv') || uaLower.includes('version/4.0'));
  const isIOSWebView = isIOS && !uaLower.includes('safari') && uaLower.includes('applewebkit');

  // If running inside the wrapped mobile app (e.g. Google Play installed app)
  if (isMedianApp || isAndroidWebView || isIOSWebView) {
    if (isAndroid || isAndroidWebView) {
      return { device: 'mobile', platform: 'android_app', isNativeApp: true };
    }
    if (isIOS || isIOSWebView) {
      return { device: 'mobile', platform: 'ios_app', isNativeApp: true };
    }
    return { device: 'mobile', platform: 'android_app', isNativeApp: true };
  }

  // 3. Tablet detection
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(uaLower)) {
    return { device: 'tablet', platform: 'mobile_web', isNativeApp: false };
  }

  // 4. Mobile Browser detection
  if (
    /mobile|android|iphone|ipod|iemobile|blackberry|opera mini/i.test(uaLower) ||
    window.innerWidth < 768
  ) {
    return { device: 'mobile', platform: 'mobile_web', isNativeApp: false };
  }

  // 5. Desktop browser
  return { device: 'desktop', platform: 'desktop_web', isNativeApp: false };
}

function getBrowserName(): string {
  if (typeof window === 'undefined') return 'Unknown';
  const ua = navigator.userAgent;
  const win = window as any;
  if (typeof win.median !== 'undefined' || ua.toLowerCase().includes('median')) {
    return 'Google Play App (Median)';
  }
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

function isDeviceExcluded(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (localStorage.getItem('gg33_admin_exclude') === 'true') return true;
    if (document.cookie.includes('gg33_admin_exclude=true')) return true;
    if (sessionStorage.getItem('gg33_admin_token')) return true;
  } catch {}
  return false;
}

export function PageTracker() {
  const router = useRouter();
  const { dbUser } = useAuth();
  const lastTrackedPath = useRef<string | null>(null);
  const lastTrackedTime = useRef<number>(0);

  useEffect(() => {
    // If the logged-in user is the owner, immediately lock cookies & storage
    if (dbUser?.email && dbUser.email.trim().toLowerCase() === ADMIN_EMAIL) {
      try {
        localStorage.setItem('gg33_admin_exclude', 'true');
        document.cookie = 'gg33_admin_exclude=true; path=/; max-age=31536000; SameSite=Lax';
      } catch {}

      // Identify to Microsoft Clarity as admin/owner
      if (typeof window !== 'undefined' && typeof (window as any).clarity === 'function') {
        (window as any).clarity('set', 'is_admin', 'true');
        (window as any).clarity('identify', 'admin_owner');
      }
      return;
    }

    const trackCurrentPage = (path: string) => {
      if (typeof window === 'undefined') return;

      // Check admin exclusions
      const isExcluded =
        isDeviceExcluded() ||
        dbUser?.email?.trim().toLowerCase() === ADMIN_EMAIL ||
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

      const { device, platform, isNativeApp } = getAppAndDeviceInfo();

      const payload = {
        path,
        referrer: document.referrer || '',
        sessionId: getOrCreateSessionId(),
        device,
        platform,
        isNativeApp,
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
        (window as any).clarity('set', 'platform', platform);
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
