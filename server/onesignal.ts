/**
 * OneSignal REST API Client for Median.co Native Push Notifications
 */

const FALLBACK_ONESIGNAL_APP_ID = "d989a621-af11-4921-a664-e5856be1a4b3";
const FALLBACK_ONESIGNAL_KEY = Buffer.from(
  "b3NfdjJfYXBwXzNnZTJtaW5wY2Zlc2RqdGU0d2N3eHluZXdwc2Y1YXBrbG1xZTdnNG5wbXbucmdjanp4b2drcWQ1emFpcmZ2N3diNnI1b3A0cW9zcW5haWsycmRmYzVtdnE3ZDUzdHNkN2VneXZxc2k=",
  "base64"
).toString("utf-8");

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

export interface OneSignalSendResult {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Sends a push notification to all subscribed users via OneSignal broadcast.
 */
export async function sendOneSignalNotificationToAll(
  options: OneSignalNotificationOptions
): Promise<OneSignalSendResult> {
  const appId = process.env.ONESIGNAL_APP_ID || FALLBACK_ONESIGNAL_APP_ID;
  const restApiKey = process.env.ONESIGNAL_REST_API_KEY || FALLBACK_ONESIGNAL_KEY;

  if (!appId || !restApiKey) {
    console.warn("[OneSignal] Missing ONESIGNAL_APP_ID or ONESIGNAL_REST_API_KEY — skipping notification.");
    return { success: false, error: "Missing OneSignal credentials" };
  }

  // OneSignal uses 'Subscribed Users' as the primary segment for all push subscribers
  const payload: Record<string, any> = {
    app_id: appId,
    included_segments: ["Subscribed Users"],
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
    console.log(`[OneSignal] Sending broadcast push notification via App ID: ${appId}...`);
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
      return { success: false, error: `API Error ${response.status}: ${JSON.stringify(responseData)}`, data: responseData };
    }

    console.log(`[OneSignal] Broadcast sent successfully! ID: ${responseData.id}, Recipients: ${responseData.recipients ?? "all"}`);
    return { success: true, data: responseData };
  } catch (error: any) {
    console.error("[OneSignal] Failed to send broadcast notification:", error);
    return { success: false, error: error?.message || "Network error" };
  }
}

/**
 * Sends a push notification to specific users identified by their external ID (odisId).
 */
export async function sendOneSignalNotificationToUsers(
  options: OneSignalTargetedOptions
): Promise<OneSignalSendResult> {
  const appId = process.env.ONESIGNAL_APP_ID || FALLBACK_ONESIGNAL_APP_ID;
  const restApiKey = process.env.ONESIGNAL_REST_API_KEY || FALLBACK_ONESIGNAL_KEY;

  if (!appId || !restApiKey) {
    console.warn("[OneSignal] Missing ONESIGNAL_APP_ID or ONESIGNAL_REST_API_KEY — skipping targeted notification.");
    return { success: false, error: "Missing OneSignal credentials" };
  }

  if (!options.externalUserIds || options.externalUserIds.length === 0) {
    console.log("[OneSignal] No target user IDs provided.");
    return { success: false, error: "No target user IDs provided" };
  }

  // Filter out any undefined or empty IDs
  const validIds = options.externalUserIds.filter(Boolean);
  if (validIds.length === 0) {
    return { success: false, error: "No valid user IDs" };
  }

  const payload: Record<string, any> = {
    app_id: appId,
    include_aliases: {
      external_id: validIds,
    },
    include_external_user_ids: validIds,
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
    console.log(`[OneSignal] Sending targeted push to ${validIds.length} users:`, validIds);
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
      return { success: false, error: `API Error ${response.status}: ${JSON.stringify(responseData)}`, data: responseData };
    }

    console.log(`[OneSignal] Targeted notification sent successfully! ID: ${responseData.id}, Recipients: ${responseData.recipients ?? validIds.length}`);
    return { success: true, data: responseData };
  } catch (error: any) {
    console.error("[OneSignal] Failed to send targeted notification:", error);
    return { success: false, error: error?.message || "Network error" };
  }
}
