/**
 * OneSignal REST API Client for Median.co Native Push Notifications
 *
 * Important: We target devices DIRECTLY by Player ID rather than using
 * OneSignal segments, because the Median.co integration does not always
 * register devices into the "Subscribed Users" segment.
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
}

export interface OneSignalSendResult {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Sends a push notification to specific devices by Player ID.
 * This is the primary method — we always target by Player ID since
 * OneSignal segments don't reliably contain Median.co devices.
 */
export async function sendOneSignalNotification(
  options: OneSignalNotificationOptions
): Promise<OneSignalSendResult> {
  const { appId, restApiKey } = getCredentials();

  if (!appId || !restApiKey) {
    console.warn("[OneSignal] Missing ONESIGNAL_APP_ID or ONESIGNAL_REST_API_KEY — skipping notification.");
    return { success: false, error: "Missing OneSignal credentials" };
  }

  const validPlayerIds = (options.playerIds || []).filter(Boolean);

  if (validPlayerIds.length === 0) {
    console.warn("[OneSignal] No Player IDs provided — cannot send notification.");
    return { success: false, error: "No Player IDs provided" };
  }

  const targetUrl = options.url || "https://gg33-core.vercel.app/";

  const payload: Record<string, any> = {
    app_id: appId,
    include_player_ids: validPlayerIds,
    headings: { en: options.title },
    contents: { en: options.content },
    data: {
      targetUrl: targetUrl,
      url: targetUrl,
      ...(options.data || {}),
    },
  };

  if (options.subtitle) {
    payload.subtitle = { en: options.subtitle };
  }

  try {
    console.log(`[OneSignal] Sending push notification to ${validPlayerIds.length} device(s)...`);
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
      console.error(`[OneSignal] API error ${response.status}:`, responseData);
      return { success: false, error: `API Error ${response.status}: ${JSON.stringify(responseData)}`, data: responseData };
    }

    console.log(`[OneSignal] Push sent successfully! ID: ${responseData.id}, Recipients: ${responseData.recipients ?? validPlayerIds.length}`);
    return { success: true, data: responseData };
  } catch (error: any) {
    console.error("[OneSignal] Failed to send notification:", error);
    return { success: false, error: error?.message || "Network error" };
  }
}

// Keep these as aliases for backward compatibility
export const sendOneSignalNotificationToAll = sendOneSignalNotification;
export const sendOneSignalNotificationToUsers = sendOneSignalNotification;
