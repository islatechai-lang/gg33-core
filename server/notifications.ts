import { storage } from "./storage";
import { sendOneSignalNotificationToAll, sendOneSignalNotificationToUsers } from "./onesignal";
import { format } from "date-fns";

let lastResetNotificationDate: string | null = null;
let lastReminderDate: string | null = null;

/**
 * Sends a "Your Daily Energy has reset!" native push notification to ALL users
 * right after midnight UTC when the new day begins.
 */
export async function sendDailyEnergyResetNotifications(force = false) {
  const today = format(new Date(), "yyyy-MM-dd");

  // Only send once per day unless forced
  if (!force && today === lastResetNotificationDate) {
    console.log(`[Notifications] Reset notification already sent for ${today}. Skipping.`);
    return { success: true, skipped: true, reason: "Already sent today" };
  }

  console.log(`[Notifications] Sending daily energy RESET OneSignal push notifications for ${today} (force=${force})...`);

  try {
    const result = await sendOneSignalNotificationToAll({
      title: "🌅 Your Daily Energy Has Reset!",
      content: "A brand new cosmic reading is waiting for you. Tap to reveal your energy for today.",
      subtitle: format(new Date(), "EEEE, MMMM do"),
      url: "https://gg33-core.vercel.app/",
    });

    if (result.success) {
      console.log(`[Notifications] Reset push notification successfully broadcast to all app users.`);
      lastResetNotificationDate = today;
    } else {
      console.warn(`[Notifications] OneSignal broadcast returned error:`, result.error);
    }
    return result;
  } catch (error: any) {
    console.error("[Notifications] Error sending OneSignal reset notifications:", error);
    return { success: false, error: error?.message || "Unknown error" };
  }
}

/**
 * Sends a reminder push notification to users who haven't revealed their
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

    // Extract odisIds and playerIds of all users who haven't revealed energy yet today
    const missingOdisIds = missingUsers
      .map((u) => u.odisId)
      .filter((id): id is string => Boolean(id));

    const missingPlayerIds = missingUsers
      .map((u) => u.oneSignalPlayerId)
      .filter((id): id is string => Boolean(id));

    if (missingOdisIds.length > 0 || missingPlayerIds.length > 0) {
      const result = await sendOneSignalNotificationToUsers({
        externalUserIds: missingOdisIds,
        playerIds: missingPlayerIds,
        title: "✨ Your Daily Energy is Still Waiting!",
        content: "You haven't revealed your energy reading yet today. Don't miss out on your cosmic guidance!",
        subtitle: "Tap to reveal your reading",
        url: "https://gg33-core.vercel.app/",
      });

      if (result.success) {
        console.log(`[Notifications] Reminders sent successfully to ${missingOdisIds.length} users.`);
        lastReminderDate = today;
      }
      return { ...result, targetUserCount: missingOdisIds.length, targetPlayerIdCount: missingPlayerIds.length };
    }

    return { success: true, skipped: true, reason: "No valid targets found" };
  } catch (error: any) {
    console.error("[Notifications] Error in daily energy reminder service:", error);
    return { success: false, error: error?.message || "Unknown error" };
  }
}

/**
 * Starts the notification background service.
 *
 * - At midnight UTC (when the daily energy resets): sends a "Your energy has reset!"
 *   notification to ALL users via OneSignal.
 * - At 10 AM UTC: sends a reminder to users who still haven't revealed their reading.
 *
 * The service checks every 15 minutes to ensure timely delivery without excessive polling.
 */
export function startNotificationService() {
  console.log("[Notifications] Daily energy OneSignal notification service started.");

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
