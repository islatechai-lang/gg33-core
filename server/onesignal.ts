/**
 * OneSignal REST API Client for Median.co Native Push Notifications
 */

const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;
const ONESIGNAL_REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY;

export interface OneSignalNotificationOptions {
  title: string;
  content: string;
  subtitle?: string;
  url?: string;
  data?: Record<string, any>;
}

export interface OneSignalTargetedOptions extends OneSignalNotificationOptions {
  externalUserIds: string[];
}

/**
 * Sends a push notification to all subscribed users via OneSignal broadcast.
 */
export async function sendOneSignalNotificationToAll(
  options: OneSignalNotificationOptions
): Promise<boolean> {
  const appId = ONESIGNAL_APP_ID || process.env.ONESIGNAL_APP_ID;
  const restApiKey = ONESIGNAL_REST_API_KEY || process.env.ONESIGNAL_REST_API_KEY;

  if (!appId || !restApiKey) {
    console.warn("[OneSignal] Missing ONESIGNAL_APP_ID or ONESIGNAL_REST_API_KEY — skipping notification.");
    return false;
  }

  const payload: Record<string, any> = {
    app_id: appId,
    included_segments: ["Total Subscriptions"],
    headings: { en: options.title },
    contents: { en: options.content },
  };

  if (options.subtitle) {
    payload.subtitle = { en: options.subtitle };
  }

  if (options.url) {
    payload.url = options.url;
  }

  if (options.data) {
    payload.data = options.data;
  }

  try {
    const response = await fetch("https://api.onesignal.com/notifications", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${restApiKey}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error(`[OneSignal] Broadcast API error ${response.status}:`, responseData);
      return false;
    }

    console.log(`[OneSignal] Broadcast sent successfully! Notification ID: ${responseData.id}, Recipients: ${responseData.recipients ?? "all"}`);
    return true;
  } catch (error) {
    console.error("[OneSignal] Failed to send broadcast notification:", error);
    return false;
  }
}

/**
 * Sends a push notification to specific users identified by their external ID (odisId).
 */
export async function sendOneSignalNotificationToUsers(
  options: OneSignalTargetedOptions
): Promise<boolean> {
  const appId = ONESIGNAL_APP_ID || process.env.ONESIGNAL_APP_ID;
  const restApiKey = ONESIGNAL_REST_API_KEY || process.env.ONESIGNAL_REST_API_KEY;

  if (!appId || !restApiKey) {
    console.warn("[OneSignal] Missing ONESIGNAL_APP_ID or ONESIGNAL_REST_API_KEY — skipping targeted notification.");
    return false;
  }

  if (!options.externalUserIds || options.externalUserIds.length === 0) {
    console.log("[OneSignal] No target user IDs provided.");
    return false;
  }

  // Filter out any undefined or empty IDs
  const validIds = options.externalUserIds.filter(Boolean);
  if (validIds.length === 0) return false;

  const payload: Record<string, any> = {
    app_id: appId,
    include_aliases: {
      external_id: validIds,
    },
    target_channel: "push",
    headings: { en: options.title },
    contents: { en: options.content },
  };

  if (options.subtitle) {
    payload.subtitle = { en: options.subtitle };
  }

  if (options.url) {
    payload.url = options.url;
  }

  if (options.data) {
    payload.data = options.data;
  }

  try {
    const response = await fetch("https://api.onesignal.com/notifications", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${restApiKey}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error(`[OneSignal] Targeted API error ${response.status}:`, responseData);
      return false;
    }

    console.log(`[OneSignal] Targeted notification sent successfully to ${validIds.length} user(s). Notification ID: ${responseData.id}`);
    return true;
  } catch (error) {
    console.error("[OneSignal] Failed to send targeted notification:", error);
    return false;
  }
}
