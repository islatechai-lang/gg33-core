import { storage } from "./storage";
import { sendOneSignalNotification } from "./onesignal";
import { format } from "date-fns";

let lastResetNotificationDate: string | null = null;
let lastReminderDate: string | null = null;

/**
 * Sends a "Your Daily Energy has reset!" push notification to ALL devices
 * with stored Player IDs right after midnight UTC.
 */
export async function sendDailyEnergyResetNotifications(force = false) {
  const today = format(new Date(), "yyyy-MM-dd");

  // Only send once per day unless forced
  if (!force && today === lastResetNotificationDate) {
    console.log(`[Notifications] Reset notification already sent for ${today}. Skipping.`);
    return { success: true, skipped: true, reason: "Already sent today" };
  }

  console.log(`[Notifications] Sending daily energy RESET push notifications for ${today} (force=${force})...`);

  try {
    // Get ALL stored Player IDs from Firestore
    const allPlayerIds = await storage.getAllOneSignalPlayerIds();
    console.log(`[Notifications] Found ${allPlayerIds.length} stored device Player IDs.`);

    if (allPlayerIds.length === 0) {
      console.warn("[Notifications] No Player IDs found in database — no devices to notify.");
      return { success: false, error: "No Player IDs stored in database", totalDevices: 0 };
    }

    const result = await sendOneSignalNotification({
      title: "🌅 Your Daily Energy Has Reset!",
      content: "A brand new cosmic reading is waiting for you. Tap to reveal your energy for today.",
      subtitle: format(new Date(), "EEEE, MMMM do"),
      url: "https://gg33-core.vercel.app/",
      playerIds: allPlayerIds,
    });

    if (result.success) {
      console.log(`[Notifications] Reset push sent successfully to ${allPlayerIds.length} device(s).`);
      lastResetNotificationDate = today;
    } else {
      console.warn(`[Notifications] OneSignal returned error:`, result.error);
    }
    return { ...result, totalDevices: allPlayerIds.length };
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
    console.log(`[Notifications] Reminder notification already sent for ${today}. Skipping.`);
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

    // Get Player IDs of users who haven't revealed energy yet today
    const missingPlayerIds = missingUsers
      .map((u) => u.oneSignalPlayerId)
      .filter((id): id is string => Boolean(id));

    if (missingPlayerIds.length === 0) {
      console.log("[Notifications] Missing users have no stored Player IDs — cannot send reminders.");
      return { success: true, skipped: true, reason: "No valid Player IDs for missing users" };
    }

    const result = await sendOneSignalNotification({
      playerIds: missingPlayerIds,
      title: "✨ Your Daily Energy is Still Waiting!",
      content: "You haven't revealed your energy reading yet today. Don't miss out on your cosmic guidance!",
      subtitle: "Tap to reveal your reading",
      url: "https://gg33-core.vercel.app/",
    });

    if (result.success) {
      console.log(`[Notifications] Reminders sent successfully to ${missingPlayerIds.length} device(s).`);
      lastReminderDate = today;
    }
    return { ...result, targetDeviceCount: missingPlayerIds.length };
  } catch (error: any) {
    console.error("[Notifications] Error in daily energy reminder service:", error);
    return { success: false, error: error?.message || "Unknown error" };
  }
}

/**
 * Starts the notification background service.
 *
 * - At midnight UTC (when the daily energy resets): sends a "Your energy has reset!"
 *   notification to ALL devices with stored Player IDs.
 * - At 10 AM UTC: sends a reminder to Pro users who still haven't revealed their reading.
 *
 * The service checks every 15 minutes to ensure timely delivery without excessive polling.
 */
export function startNotificationService() {
  console.log("[Notifications] Daily energy notification service started.");

  const CHECK_INTERVAL = 15 * 60 * 1000; // Check every 15 minutes

  const tick = async () => {
    const now = new Date();
    const utcHour = now.getUTCHours();
    const today = format(now, "yyyy-MM-dd");

    // === Reset notification: fires right after midnight UTC (hour 0) ===
    if (today !== lastResetNotificationDate && utcHour >= 0) {
      await sendDailyEnergyResetNotifications();
    }

    // === Reminder notification: fires at 10 AM UTC for those who haven't revealed ===
    if (today !== lastReminderDate && utcHour >= 10) {
      await sendDailyEnergyReminders();
    }
  };

  // Run initial check after a short delay to let the DB connect
  setTimeout(tick, 10_000);

  setInterval(tick, CHECK_INTERVAL);
}
