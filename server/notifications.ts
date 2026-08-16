import { storage } from "./storage";
import { sendOneSignalNotification } from "./onesignal";
import { format } from "date-fns";

let lastResetNotificationDate: string | null = null;
let lastReminderDate: string | null = null;

/**
 * Sends a "Your Daily Energy has reset!" push notification to ALL devices
 * using both external_id (odisId) and subscription_id targeting.
 */
export async function sendDailyEnergyResetNotifications(force = false) {
  const today = format(new Date(), "yyyy-MM-dd");

  if (!force && today === lastResetNotificationDate) {
    console.log(`[Notifications] Reset notification already sent for ${today}. Skipping.`);
    return { success: true, skipped: true, reason: "Already sent today" };
  }

  console.log(`[Notifications] Sending daily energy RESET push notifications for ${today} (force=${force})...`);

  try {
    // Get all stored subscription IDs AND odisIds from Firestore
    const allPlayerIds = await storage.getAllOneSignalPlayerIds();
    const allOdisIds = await storage.getAllOdisIds();
    
    console.log(`[Notifications] Found ${allPlayerIds.length} subscription IDs and ${allOdisIds.length} external IDs.`);

    if (allPlayerIds.length === 0 && allOdisIds.length === 0) {
      console.warn("[Notifications] No targets found in database.");
      return { success: false, error: "No targets in database", totalDevices: 0 };
    }

    const result = await sendOneSignalNotification({
      title: "🌅 Your Daily Energy Has Reset!",
      content: "A brand new cosmic reading is waiting for you. Tap to reveal your energy for today.",
      subtitle: format(new Date(), "EEEE, MMMM do"),
      url: "https://gg33-core.vercel.app/",
      subscriptionIds: allPlayerIds,
      externalIds: allOdisIds,
    });

    if (result.success) {
      console.log(`[Notifications] Reset push sent successfully.`);
      lastResetNotificationDate = today;
    } else {
      console.warn(`[Notifications] OneSignal returned error:`, result.error);
    }
    return { ...result, totalSubscriptionIds: allPlayerIds.length, totalExternalIds: allOdisIds.length };
  } catch (error: any) {
    console.error("[Notifications] Error sending reset notifications:", error);
    return { success: false, error: error?.message || "Unknown error" };
  }
}

/**
 * Sends a reminder push notification to Pro users who haven't revealed their
 * daily energy by later in the day (10 AM UTC).
 */
export async function sendDailyEnergyReminders(force = false) {
  const today = format(new Date(), "yyyy-MM-dd");

  if (!force && today === lastReminderDate) {
    console.log(`[Notifications] Reminder already sent for ${today}. Skipping.`);
    return { success: true, skipped: true, reason: "Already sent today" };
  }

  console.log(`[Notifications] Starting daily energy reminder check for ${today} (force=${force})...`);

  try {
    const missingUsers = await storage.getUsersMissingDailyEnergy(today);

    if (missingUsers.length === 0) {
      console.log("[Notifications] No users found requiring a reminder today.");
      lastReminderDate = today;
      return { success: true, skipped: true, reason: "No users missing daily energy today" };
    }

    console.log(`[Notifications] Found ${missingUsers.length} users to remind.`);

    const missingSubscriptionIds = missingUsers
      .map((u) => u.oneSignalPlayerId)
      .filter((id): id is string => Boolean(id));

    const missingExternalIds = missingUsers
      .map((u) => u.odisId)
      .filter((id): id is string => Boolean(id));

    if (missingSubscriptionIds.length === 0 && missingExternalIds.length === 0) {
      console.log("[Notifications] Missing users have no stored IDs — cannot send reminders.");
      return { success: true, skipped: true, reason: "No valid IDs for missing users" };
    }

    const result = await sendOneSignalNotification({
      subscriptionIds: missingSubscriptionIds,
      externalIds: missingExternalIds,
      title: "✨ Your Daily Energy is Still Waiting!",
      content: "You haven't revealed your energy reading yet today. Don't miss out on your cosmic guidance!",
      subtitle: "Tap to reveal your reading",
      url: "https://gg33-core.vercel.app/",
    });

    if (result.success) {
      console.log(`[Notifications] Reminders sent successfully.`);
      lastReminderDate = today;
    }
    return { ...result, targetSubscriptionIds: missingSubscriptionIds.length, targetExternalIds: missingExternalIds.length };
  } catch (error: any) {
    console.error("[Notifications] Error in daily energy reminder service:", error);
    return { success: false, error: error?.message || "Unknown error" };
  }
}

/**
 * Starts the notification background service.
 */
export function startNotificationService() {
  console.log("[Notifications] Daily energy notification service started.");

  const CHECK_INTERVAL = 15 * 60 * 1000;

  const tick = async () => {
    const now = new Date();
    const utcHour = now.getUTCHours();
    const today = format(now, "yyyy-MM-dd");

    if (today !== lastResetNotificationDate && utcHour >= 0) {
      await sendDailyEnergyResetNotifications();
    }

    if (today !== lastReminderDate && utcHour >= 10) {
      await sendDailyEnergyReminders();
    }
  };

  setTimeout(tick, 10_000);
  setInterval(tick, CHECK_INTERVAL);
}
