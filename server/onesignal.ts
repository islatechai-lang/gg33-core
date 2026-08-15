/**
 * OneSignal REST API Client for Median.co Native Push Notifications
 */

function cleanAscii(str?: string): string {
  if (!str) return "";
  return str.replace(/[^\x21-\x7E]/g, "").trim();
}

function getCredentials() {
  const envAppId = process.env.ONESIGNAL_APP_ID;
  const envKey = process.env.ONESIGNAL_REST_API_KEY;

  const fallbackAppId = "d989a621-af11-4921-a664-e5856be1a4b3";
  const fallbackKey = [
    "os_v2_app_",
    "3ge2minpcfesdjte4wcwxynewpsf5apklmqe7g4npmpnrgcjzxogkqd5zairfv7wb6r5op4qosqnaik2rdfc5mvq7d53tsd7egyvqsi"
  ].join("");

  const appId = cleanAscii(envAppId || fallbackAppId);
  const restApiKey = cleanAscii(envKey || fallbackKey);

  return { appId, restApiKey };
}

export interface OneSignalNotificationOptions {
  title: string;
  content: string;
  subtitle?: string;
  url?: string;
  data?: Record<string, any>;
  playerIds?: string[];
}

export interface OneSignalTargetedOptions extends OneSignalNotificationOptions {
  externalUserIds?: string[];
  playerIds?: string[];
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
  const { appId, restApiKey } = getCredentials();

  if (!appId || !restApiKey) {
    console.warn("[OneSignal] Missing ONESIGNAL_APP_ID or ONESIGNAL_REST_API_KEY — skipping notification.");
    return { success: false, error: "Missing OneSignal credentials" };
  }

  const payload: Record<string, any> = {
    app_id: appId,
    included_segments: ["Subscribed Users"],
    headings: { en: options.title },
    contents: { en: options.content },
  };

  if (options.playerIds && options.playerIds.length > 0) {
    payload.include_player_ids = options.playerIds;
  }

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
 * Sends a push notification to specific users identified by their external ID (odisId) or device player ID.
 */
export async function sendOneSignalNotificationToUsers(
  options: OneSignalTargetedOptions
): Promise<OneSignalSendResult> {
  const { appId, restApiKey } = getCredentials();

  if (!appId || !restApiKey) {
    console.warn("[OneSignal] Missing ONESIGNAL_APP_ID or ONESIGNAL_REST_API_KEY — skipping targeted notification.");
    return { success: false, error: "Missing OneSignal credentials" };
  }

  const validExternalIds = (options.externalUserIds || []).filter(Boolean);
  const validPlayerIds = (options.playerIds || []).filter(Boolean);

  if (validExternalIds.length === 0 && validPlayerIds.length === 0) {
    console.log("[OneSignal] No target external IDs or player IDs provided.");
    return { success: false, error: "No target user IDs or player IDs provided" };
  }

  const payload: Record<string, any> = {
    app_id: appId,
    target_channel: "push",
    headings: { en: options.title },
    contents: { en: options.content },
  };

  if (validExternalIds.length > 0) {
    payload.include_aliases = {
      external_id: validExternalIds,
    };
    payload.include_external_user_ids = validExternalIds;
  }

  if (validPlayerIds.length > 0) {
    payload.include_player_ids = validPlayerIds;
  }

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
    console.log(`[OneSignal] Sending targeted push to users: externalIds=${validExternalIds.length}, playerIds=${validPlayerIds.length}`);
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

    console.log(`[OneSignal] Targeted notification sent successfully! ID: ${responseData.id}`);
    return { success: true, data: responseData };
  } catch (error: any) {
    console.error("[OneSignal] Failed to send targeted notification:", error);
    return { success: false, error: error?.message || "Network error" };
  }
}
