import { storage } from "./storage";
import { createWhopNotification } from "./whop";
import { format } from "date-fns";

let lastResetNotificationDate: string | null = null;
let lastReminderDate: string | null = null;

/**
 * Sends a "Your Daily Energy has reset!" notification to ALL users
 * right after midnight UTC when the new day begins.
 */
export async function sendDailyEnergyResetNotifications() {
  const today = format(new Date(), "yyyy-MM-dd");

  // Only send once per day
  if (today === lastResetNotificationDate) {
    return;
  }

  console.log(`[Notifications] Sending daily energy RESET notifications for ${today}...`);

  try {
    const allUsers = await storage.getAllUsersWithWhopId();

    if (allUsers.length === 0) {
      console.log("[Notifications] No users found to notify about energy reset.");
      lastResetNotificationDate = today;
      return;
    }

    console.log(`[Notifications] Notifying ${allUsers.length} users about daily energy reset.`);

    let successCount = 0;
    for (const user of allUsers) {
      if (!user.whopUserId) continue;

      const firstName = user.fullName?.split(" ")[0] || "there";

      const success = await createWhopNotification({
        userId: user.whopUserId,
        title: "🌅 Your Daily Energy Has Reset!",
        content: `Good morning ${firstName}! A brand new cosmic reading is waiting for you. Tap to reveal your energy for today.`,
        subtitle: format(new Date(), "EEEE, MMMM do"),
      });

      if (success) successCount++;

      // Small delay between notifications to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    console.log(
      `[Notifications] Reset notifications sent: ${successCount}/${allUsers.length} successful.`
    );
    lastResetNotificationDate = today;
  } catch (error) {
    console.error("[Notifications] Error sending reset notifications:", error);
  }
}

/**
 * Sends a reminder notification to users who haven't revealed their
 * daily energy by later in the day (10 AM UTC).
 */
export async function sendDailyEnergyReminders() {
  const today = format(new Date(), "yyyy-MM-dd");

  if (today === lastReminderDate) {
    return;
  }

  console.log(`[Notifications] Starting daily energy reminder check for ${today}...`);

  try {
    const missingUsers = await storage.getUsersMissingDailyEnergy(today);

    if (missingUsers.length === 0) {
      console.log("[Notifications] No users found requiring a reminder today.");
      lastReminderDate = today;
      return;
    }

    console.log(`[Notifications] Found ${missingUsers.length} users to remind.`);

    let successCount = 0;
    for (const user of missingUsers) {
      if (!user.whopUserId) continue;

      const firstName = user.fullName?.split(" ")[0] || "there";

      const success = await createWhopNotification({
        userId: user.whopUserId,
        title: "✨ Your Daily Energy is Still Waiting!",
        content: `Hey ${firstName}, you haven't revealed your energy reading yet today. Don't miss out on your cosmic guidance!`,
        subtitle: "Tap to reveal your reading",
      });

      if (success) successCount++;

      // Small delay between notifications to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    console.log(
      `[Notifications] Reminders sent: ${successCount}/${missingUsers.length} successful.`
    );
    lastReminderDate = today;
  } catch (error) {
    console.error("[Notifications] Error in daily energy reminder service:", error);
  }
}

/**
 * Starts the notification background service.
 *
 * - At midnight UTC (when the daily energy resets): sends a "Your energy has reset!"
 *   notification to ALL users.
 * - At 10 AM UTC: sends a reminder to users who still haven't revealed their reading.
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
