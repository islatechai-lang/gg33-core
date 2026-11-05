import { db } from "./db";
import { Timestamp } from "firebase-admin/firestore";
import crypto from "crypto";

export const ADMIN_EMAIL = "princederder44@gmail.com";
export const ADMIN_PASSWORD = "mikasa08";
export const ADMIN_TOKEN = crypto
  .createHmac("sha256", "gg33-core-admin-secret-2026")
  .update(ADMIN_PASSWORD)
  .digest("hex");

export function isAuthorizedAdmin(authHeaderOrKey?: string | null): boolean {
  if (!authHeaderOrKey) return false;
  const clean = authHeaderOrKey.replace(/^Bearer\s+/i, "").trim();
  return clean === ADMIN_PASSWORD || clean === ADMIN_TOKEN;
}

export interface PageViewEvent {
  path: string;
  referrer?: string;
  sessionId: string;
  device?: string;
  browser?: string;
  os?: string;
  userId?: string | null;
  userEmail?: string | null;
  isPro?: boolean;
}

export interface UpgradeIntentEvent {
  userId?: string | null;
  odisId?: string | null;
  fullName?: string | null;
  email?: string | null;
}

/**
 * Record a page view event in Firestore, strictly excluding the admin account.
 */
export async function recordPageView(event: PageViewEvent): Promise<boolean> {
  try {
    const email = event.userEmail?.trim().toLowerCase();
    if (email === ADMIN_EMAIL) {
      return false; // Exclude admin visits
    }
    if (event.path && event.path.startsWith("/admin")) {
      return false; // Exclude visits to admin dashboard
    }

    const now = new Date();
    const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD

    await db.collection("page_views").add({
      path: event.path || "/",
      referrer: event.referrer || "",
      sessionId: event.sessionId || "anonymous",
      device: event.device || "desktop",
      browser: event.browser || "unknown",
      os: event.os || "unknown",
      userId: event.userId || null,
      userEmail: email || null,
      isPro: Boolean(event.isPro),
      timestamp: Timestamp.now(),
      dateStr,
    });

    return true;
  } catch (error) {
    console.error("[Analytics] Error recording page view:", error);
    return false;
  }
}

/**
 * Record an upgrade button click / intent in Firestore, excluding the admin account.
 */
export async function recordUpgradeIntent(event: UpgradeIntentEvent): Promise<boolean> {
  try {
    const email = event.email?.trim().toLowerCase();
    if (email === ADMIN_EMAIL) {
      return false; // Exclude admin
    }

    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];

    await db.collection("upgrade_intents").add({
      userId: event.userId || null,
      odisId: event.odisId || null,
      fullName: event.fullName || null,
      email: email || null,
      timestamp: Timestamp.now(),
      dateStr,
    });

    return true;
  } catch (error) {
    console.error("[Analytics] Error recording upgrade intent:", error);
    return false;
  }
}

/**
 * Retrieve aggregated analytics stats for the admin dashboard.
 */
export async function getAdminAnalyticsStats(daysRange = 30) {
  try {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const yesterdayDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const yesterdayStr = yesterdayDate.toISOString().split("T")[0];
    const cutoffDate = new Date(Date.now() - daysRange * 24 * 60 * 60 * 1000);

    // 1. Fetch Users
    const usersSnapshot = await db.collection("users").get();
    let totalUsers = 0;
    let proUsers = 0;
    let freeUsers = 0;
    let usersJoinedToday = 0;
    let usersJoinedThisWeek = 0;
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const usersList: any[] = [];

    usersSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const email = data.email?.trim().toLowerCase();
      // Exclude admin from all user stats
      if (email === ADMIN_EMAIL) {
        return;
      }

      totalUsers++;
      const isPro = Boolean(data.isPro);
      if (isPro) proUsers++;
      else freeUsers++;

      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt || Date.now());
      if (createdAt >= new Date(todayStr)) {
        usersJoinedToday++;
      }
      if (createdAt >= weekAgo) {
        usersJoinedThisWeek++;
      }

      usersList.push({
        id: doc.id,
        odisId: data.odisId || doc.id,
        fullName: data.fullName || "Anonymous User",
        email: data.email || null,
        isPro: isPro,
        whopUsername: data.whopUsername || null,
        birthDate: data.birthDate?.toDate ? data.birthDate.toDate().toISOString() : data.birthDate || null,
        createdAt: createdAt.toISOString(),
      });
    });

    const conversionRate = totalUsers > 0 ? ((proUsers / totalUsers) * 100).toFixed(1) : "0.0";

    // 2. Fetch Page Views
    let pageViewsQuery = db.collection("page_views").orderBy("timestamp", "desc");
    
    // Attempt to limit to recent range or fallback
    let pageViewsSnapshot;
    try {
      pageViewsSnapshot = await pageViewsQuery.limit(1000).get();
    } catch {
      // Fallback if index not yet generated
      pageViewsSnapshot = await db.collection("page_views").limit(1000).get();
    }

    let totalViews = 0;
    let viewsToday = 0;
    let viewsYesterday = 0;
    const uniqueSessions = new Set<string>();
    const uniqueSessionsToday = new Set<string>();

    const pathCounts: Record<string, number> = {};
    const dailyViewsMap: Record<string, number> = {};
    const deviceCounts: Record<string, number> = { mobile: 0, desktop: 0, tablet: 0 };
    const browserCounts: Record<string, number> = {};
    const recentVisits: any[] = [];

    // Pre-populate last N days in dailyViewsMap with 0
    for (let i = daysRange - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const ds = d.toISOString().split("T")[0];
      dailyViewsMap[ds] = 0;
    }

    pageViewsSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const email = data.userEmail?.trim().toLowerCase();
      if (email === ADMIN_EMAIL) return;

      totalViews++;
      const dateStr = data.dateStr || (data.timestamp?.toDate ? data.timestamp.toDate().toISOString().split("T")[0] : todayStr);
      const sessionId = data.sessionId || doc.id;

      uniqueSessions.add(sessionId);

      if (dateStr === todayStr) {
        viewsToday++;
        uniqueSessionsToday.add(sessionId);
      } else if (dateStr === yesterdayStr) {
        viewsYesterday++;
      }

      if (dailyViewsMap[dateStr] !== undefined) {
        dailyViewsMap[dateStr]++;
      } else if (new Date(dateStr) >= cutoffDate) {
        dailyViewsMap[dateStr] = (dailyViewsMap[dateStr] || 0) + 1;
      }

      // Paths
      const cleanPath = (data.path || "/").split("?")[0];
      pathCounts[cleanPath] = (pathCounts[cleanPath] || 0) + 1;

      // Devices
      const dev = (data.device || "desktop").toLowerCase();
      if (dev.includes("mob")) deviceCounts.mobile = (deviceCounts.mobile || 0) + 1;
      else if (dev.includes("tab")) deviceCounts.tablet = (deviceCounts.tablet || 0) + 1;
      else deviceCounts.desktop = (deviceCounts.desktop || 0) + 1;

      // Browsers
      const browser = data.browser || "Chrome";
      browserCounts[browser] = (browserCounts[browser] || 0) + 1;

      // Keep recent 25 visits
      if (recentVisits.length < 25) {
        const visitTime = data.timestamp?.toDate ? data.timestamp.toDate() : new Date();
        recentVisits.push({
          id: doc.id,
          path: cleanPath,
          device: data.device || "desktop",
          browser: data.browser || "unknown",
          os: data.os || "unknown",
          isPro: Boolean(data.isPro),
          userEmail: data.userEmail || null,
          timestamp: visitTime.toISOString(),
        });
      }
    });

    // Format top paths
    const topPages = Object.entries(pathCounts)
      .map(([path, count]) => ({
        path,
        count,
        percentage: totalViews > 0 ? ((count / totalViews) * 100).toFixed(1) : "0",
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Format daily views chart data
    const dailyTrend = Object.entries(dailyViewsMap)
      .map(([date, views]) => {
        const [, m, d] = date.split("-");
        return {
          date,
          label: `${m}/${d}`,
          views,
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date));

    // 3. Fetch Upgrade Intents / Clicks
    let upgradeClicksSnapshot;
    try {
      upgradeClicksSnapshot = await db.collection("upgrade_intents").limit(500).get();
    } catch {
      upgradeClicksSnapshot = { docs: [] };
    }

    let totalUpgradeClicks = 0;
    let upgradeClicksToday = 0;

    upgradeClicksSnapshot.docs.forEach((doc: any) => {
      const data = doc.data();
      const email = data.email?.trim().toLowerCase();
      if (email === ADMIN_EMAIL) return;

      totalUpgradeClicks++;
      const dateStr = data.dateStr;
      if (dateStr === todayStr) {
        upgradeClicksToday++;
      }
    });

    return {
      success: true,
      excludedAdminEmail: ADMIN_EMAIL,
      kpis: {
        totalUsers,
        proUsers,
        freeUsers,
        conversionRate,
        usersJoinedToday,
        usersJoinedThisWeek,
        totalViews,
        viewsToday,
        viewsYesterday,
        viewsGrowthVsYesterday:
          viewsYesterday > 0
            ? (((viewsToday - viewsYesterday) / viewsYesterday) * 100).toFixed(1)
            : viewsToday > 0
            ? "+100"
            : "0",
        uniqueVisitors: uniqueSessions.size,
        uniqueVisitorsToday: uniqueSessionsToday.size,
        totalUpgradeClicks,
        upgradeClicksToday,
      },
      topPages,
      dailyTrend,
      deviceBreakdown: deviceCounts,
      browserBreakdown: browserCounts,
      recentVisits,
      recentUsers: usersList
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 50),
    };
  } catch (error: any) {
    console.error("[Analytics] Error generating admin stats:", error);
    throw error;
  }
}
