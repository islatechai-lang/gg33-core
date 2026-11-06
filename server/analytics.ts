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
  platform?: string; // 'android_app' | 'ios_app' | 'mobile_web' | 'desktop_web'
  isNativeApp?: boolean;
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

export interface PushRecipientInfo {
  odisId: string;
  fullName: string;
  email: string;
  isPro: boolean;
  hasPushToken: boolean;
  oneSignalPlayerId?: string | null;
}

export interface PushNotificationLog {
  id?: string;
  type: string;
  title: string;
  content: string;
  targetDevicesCount: number;
  targetUsersCount: number;
  recipientUsers?: PushRecipientInfo[];
  status: string;
  sentAt?: Date;
  dateStr?: string;
  clicksCount?: number;
}

/**
 * Record a push notification delivery event in Firestore.
 */
export async function logPushNotification(data: PushNotificationLog): Promise<boolean> {
  try {
    const now = new Date();
    const dateStr = data.dateStr || now.toISOString().split("T")[0];

    await db.collection("push_notification_logs").add({
      id: data.id || `push_${Date.now()}`,
      type: data.type || "daily_reset",
      title: data.title || "",
      content: data.content || "",
      targetDevicesCount: data.targetDevicesCount || 0,
      targetUsersCount: data.targetUsersCount || 0,
      recipientUsers: data.recipientUsers || [],
      status: data.status || "delivered",
      sentAt: Timestamp.now(),
      dateStr,
      clicksCount: 0,
    });
    return true;
  } catch (error) {
    console.error("[Analytics] Error logging push notification:", error);
    return false;
  }
}

/**
 * Record a push notification click / open from user device.
 * Resilient lookup: checks matching date & type, falls back to latest log.
 */
export async function recordPushClick(pushType = "daily_reset", pushDate?: string): Promise<boolean> {
  try {
    const todayStr = pushDate || new Date().toISOString().split("T")[0];
    
    // 1. Try finding log with matching dateStr and type
    let snapshot = await db
      .collection("push_notification_logs")
      .where("dateStr", "==", todayStr)
      .where("type", "==", pushType)
      .limit(1)
      .get();

    // 2. If not found, try matching dateStr only
    if (snapshot.empty) {
      snapshot = await db
        .collection("push_notification_logs")
        .where("dateStr", "==", todayStr)
        .limit(1)
        .get();
    }

    // 3. If still not found, get the most recent push log overall
    if (snapshot.empty) {
      try {
        snapshot = await db
          .collection("push_notification_logs")
          .orderBy("sentAt", "desc")
          .limit(1)
          .get();
      } catch {
        snapshot = await db.collection("push_notification_logs").limit(1).get();
      }
    }

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const currentClicks = doc.data().clicksCount || 0;
      await doc.ref.update({
        clicksCount: currentClicks + 1,
        lastClickAt: Timestamp.now(),
      });
      console.log(`[Analytics] Successfully recorded push click for log ${doc.id} (new total: ${currentClicks + 1})`);
      return true;
    }

    console.warn("[Analytics] No push notification log found to associate click with.");
    return false;
  } catch (error) {
    console.error("[Analytics] Error recording push click:", error);
    return false;
  }
}

/**
 * Record a page view event in Firestore, strictly excluding the admin account.
 */
export async function recordPageView(event: PageViewEvent): Promise<boolean> {
  try {
    const email = event.userEmail?.trim().toLowerCase();
    const isAdminTest = email === ADMIN_EMAIL;

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
      platform: event.platform || (event.device === "mobile" ? "mobile_web" : "desktop_web"),
      isNativeApp: Boolean(event.isNativeApp),
      browser: event.browser || "unknown",
      os: event.os || "unknown",
      userId: event.userId || null,
      userEmail: email || null,
      isPro: Boolean(event.isPro),
      isAdminTest,
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
    const platformCounts: Record<string, number> = {
      android_app: 0,
      ios_app: 0,
      mobile_web: 0,
      desktop_web: 0,
    };
    const browserCounts: Record<string, number> = {};
    const recentVisits: any[] = [];
    let appVisitsCount = 0;

    // Pre-populate last N days in dailyViewsMap with 0
    for (let i = daysRange - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const ds = d.toISOString().split("T")[0];
      dailyViewsMap[ds] = 0;
    }

    pageViewsSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const email = data.userEmail?.trim().toLowerCase();
      const isAdminTest = Boolean(data.isAdminTest || email === ADMIN_EMAIL);
      const cleanPath = (data.path || "/").split("?")[0];
      const dev = (data.device || "desktop").toLowerCase();
      const plat = data.platform || (dev.includes("mob") ? "mobile_web" : "desktop_web");

      // Keep recent 30 visits in the activity feed (including owner tests tagged as such)
      if (recentVisits.length < 30) {
        const visitTime = data.timestamp?.toDate ? data.timestamp.toDate() : new Date();
        recentVisits.push({
          id: doc.id,
          path: cleanPath,
          device: data.device || "desktop",
          platform: plat,
          isNativeApp: Boolean(data.isNativeApp || plat === "android_app" || plat === "ios_app"),
          browser: data.browser || "unknown",
          os: data.os || "unknown",
          isPro: Boolean(data.isPro),
          userEmail: isAdminTest ? `${ADMIN_EMAIL} (Owner Test)` : (data.userEmail || null),
          isAdminTest,
          timestamp: visitTime.toISOString(),
        });
      }

      // Strictly exclude owner testing visits from aggregate traffic statistics & KPIs
      if (isAdminTest) return;

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
      pathCounts[cleanPath] = (pathCounts[cleanPath] || 0) + 1;

      // Devices
      if (dev.includes("mob")) deviceCounts.mobile = (deviceCounts.mobile || 0) + 1;
      else if (dev.includes("tab")) deviceCounts.tablet = (deviceCounts.tablet || 0) + 1;
      else deviceCounts.desktop = (deviceCounts.desktop || 0) + 1;

      // Platforms (Google Play App vs Mobile Web vs Desktop Web)
      if (platformCounts[plat] !== undefined) {
        platformCounts[plat]++;
      } else {
        platformCounts[plat] = 1;
      }

      if (data.isNativeApp || plat === "android_app" || plat === "ios_app") {
        appVisitsCount++;
      }

      // Browsers
      const browser = data.browser || "Chrome";
      browserCounts[browser] = (browserCounts[browser] || 0) + 1;
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

    // 4. Fetch Push Notification Delivery & Click Logs
    let pushLogsSnapshot;
    try {
      pushLogsSnapshot = await db
        .collection("push_notification_logs")
        .orderBy("sentAt", "desc")
        .limit(10)
        .get();
    } catch {
      try {
        pushLogsSnapshot = await db.collection("push_notification_logs").limit(10).get();
      } catch {
        pushLogsSnapshot = { docs: [] };
      }
    }

    const pushLogs = pushLogsSnapshot.docs.map((doc: any) => {
      const data = doc.data();
      const sentTime = data.sentAt?.toDate ? data.sentAt.toDate() : new Date();
      const clicks = data.clicksCount || 0;
      const targets = data.targetDevicesCount || 0;
      const ctr = targets > 0 ? ((clicks / targets) * 100).toFixed(1) : "0.0";

      return {
        id: doc.id,
        type: data.type,
        title: data.title,
        content: data.content,
        targetDevicesCount: targets,
        targetUsersCount: data.targetUsersCount || 0,
        recipientUsers: data.recipientUsers || [],
        status: data.status,
        sentAt: sentTime.toISOString(),
        dateStr: data.dateStr,
        clicksCount: clicks,
        ctr,
      };
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
        appVisitsCount,
      },
      topPages,
      dailyTrend,
      deviceBreakdown: deviceCounts,
      platformBreakdown: platformCounts,
      browserBreakdown: browserCounts,
      recentVisits,
      pushLogs,
      recentUsers: usersList
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 50),
    };
  } catch (error: any) {
    console.error("[Analytics] Error generating admin stats:", error);
    throw error;
  }
}

/**
 * Reset all analytics data (page views and upgrade intents) in Firestore to start fresh.
 */
export async function resetAnalyticsData(): Promise<{ deletedPageViews: number; deletedUpgradeIntents: number; deletedPushLogs: number }> {
  let deletedPageViews = 0;
  let deletedUpgradeIntents = 0;
  let deletedPushLogs = 0;

  try {
    const pageViewsSnapshot = await db.collection("page_views").get();
    const batchSize = 300;
    for (let i = 0; i < pageViewsSnapshot.docs.length; i += batchSize) {
      const batch = db.batch();
      const chunk = pageViewsSnapshot.docs.slice(i, i + batchSize);
      chunk.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
      deletedPageViews += chunk.length;
    }

    const upgradeSnapshot = await db.collection("upgrade_intents").get();
    for (let i = 0; i < upgradeSnapshot.docs.length; i += batchSize) {
      const batch = db.batch();
      const chunk = upgradeSnapshot.docs.slice(i, i + batchSize);
      chunk.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
      deletedUpgradeIntents += chunk.length;
    }

    const pushSnapshot = await db.collection("push_notification_logs").get();
    for (let i = 0; i < pushSnapshot.docs.length; i += batchSize) {
      const batch = db.batch();
      const chunk = pushSnapshot.docs.slice(i, i + batchSize);
      chunk.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
      deletedPushLogs += chunk.length;
    }

    console.log(`[Analytics Reset] Purged ${deletedPageViews} page views, ${deletedUpgradeIntents} upgrade intents, and ${deletedPushLogs} push logs.`);
  } catch (error) {
    console.error("[Analytics] Error resetting analytics data:", error);
  }

  return { deletedPageViews, deletedUpgradeIntents, deletedPushLogs };
}
