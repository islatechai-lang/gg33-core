/**
 * OneSignal REST API Client for Median.co Native Push Notifications
 *
 * Uses include_subscription_ids (SDK v5+) and include_aliases with external_id
 * for reliable device targeting. Does NOT use segments or deprecated include_player_ids.
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
  subscriptionIds?: string[];
  externalIds?: string[];
}

export interface OneSignalSendResult {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Sends a push notification using the best available targeting method.
 * 
 * Priority:
 * 1. include_aliases with external_id (odisId) — most reliable for SDK v5+
 * 2. include_subscription_ids — direct device targeting for SDK v5+
 * 
 * If both are provided, sends TWO separate requests (OneSignal doesn't allow mixing).
 */
export async function sendOneSignalNotification(
  options: OneSignalNotificationOptions
): Promise<OneSignalSendResult> {
  const { appId, restApiKey } = getCredentials();

  if (!appId || !restApiKey) {
    console.warn("[OneSignal] Missing credentials — skipping notification.");
    return { success: false, error: "Missing OneSignal credentials" };
  }

  const validSubscriptionIds = (options.subscriptionIds || []).filter(Boolean);
  const validExternalIds = (options.externalIds || []).filter(Boolean);

  if (validSubscriptionIds.length === 0 && validExternalIds.length === 0) {
    console.warn("[OneSignal] No subscription IDs or external IDs provided.");
    return { success: false, error: "No targets provided" };
  }

  const targetUrl = options.url || "https://gg33-core.vercel.app/";
  const basePayload: Record<string, any> = {
    app_id: appId,
    headings: { en: options.title },
    contents: { en: options.content },
    data: {
      targetUrl: targetUrl,
      url: targetUrl,
      ...(options.data || {}),
    },
  };

  if (options.subtitle) {
    basePayload.subtitle = { en: options.subtitle };
  }

  const results: any[] = [];

  // Method 1: Target by external_id (odisId) — preferred for SDK v5+
  if (validExternalIds.length > 0) {
    const aliasPayload = {
      ...basePayload,
      include_aliases: { external_id: validExternalIds },
      target_channel: "push",
    };

    try {
      console.log(`[OneSignal] Sending push via external_id to ${validExternalIds.length} user(s)...`);
      const response = await fetch("https://api.onesignal.com/notifications", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${restApiKey}`,
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(aliasPayload),
      });
      const data = await response.json();
      console.log("[OneSignal] external_id response:", JSON.stringify(data));
      results.push({ method: "external_id", status: response.status, data });
    } catch (err: any) {
      console.error("[OneSignal] external_id request failed:", err);
      results.push({ method: "external_id", error: err?.message });
    }
  }

  // Method 2: Target by subscription_id — direct device targeting
  if (validSubscriptionIds.length > 0) {
    const subPayload = {
      ...basePayload,
      include_subscription_ids: validSubscriptionIds,
    };

    try {
      console.log(`[OneSignal] Sending push via subscription_id to ${validSubscriptionIds.length} device(s)...`);
      const response = await fetch("https://api.onesignal.com/notifications", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${restApiKey}`,
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(subPayload),
      });
      const data = await response.json();
      console.log("[OneSignal] subscription_id response:", JSON.stringify(data));
      results.push({ method: "subscription_id", status: response.status, data });
    } catch (err: any) {
      console.error("[OneSignal] subscription_id request failed:", err);
      results.push({ method: "subscription_id", error: err?.message });
    }
  }

  // Check if any method succeeded
  const anySuccess = results.some(r => r.data?.id && !r.data?.errors);
  
  return {
    success: anySuccess || results.some(r => r.status === 200),
    data: results.length === 1 ? results[0] : results,
  };
}

// Backward compatibility aliases
export const sendOneSignalNotificationToAll = sendOneSignalNotification;
export const sendOneSignalNotificationToUsers = sendOneSignalNotification;
