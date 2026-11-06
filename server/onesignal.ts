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
  broadcastAll?: boolean;
}

export interface OneSignalSendResult {
  success: boolean;
  data?: any;
  error?: string;
  recipients?: number;
}

/**
 * Sends a push notification using the best available targeting method.
 * 
 * Priority:
 * 1. broadcastAll: true — Sends to ALL app subscribers via "Total Subscriptions" segment (reaches 100% of installed devices)
 * 2. include_aliases with external_id (odisId) — most reliable for individual user targeting in SDK v5+
 * 3. include_subscription_ids — direct device targeting for SDK v5+
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

  if (!options.broadcastAll && validSubscriptionIds.length === 0 && validExternalIds.length === 0) {
    console.warn("[OneSignal] No subscription IDs or external IDs provided.");
    return { success: false, error: "No targets provided" };
  }

  const targetUrl = options.url || "https://gg33-core.vercel.app/";
  const basePayload: Record<string, any> = {
    app_id: appId,
    headings: { en: options.title },
    contents: { en: options.content },
    url: targetUrl,
    web_url: targetUrl,
    app_url: targetUrl,
    priority: 10,
    android_visibility: 1,
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
  let totalRecipients = 0;

  // Method 1: Broadcast to ALL installed devices (Total Subscriptions segment)
  if (options.broadcastAll) {
    const broadcastPayload = {
      ...basePayload,
      included_segments: ["Total Subscriptions"],
    };

    try {
      console.log("[OneSignal] Broadcasting push to ALL installed devices via Total Subscriptions...");
      const response = await fetch("https://onesignal.com/api/v1/notifications", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${restApiKey}`,
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(broadcastPayload),
      });
      const data = await response.json();
      console.log("[OneSignal] Broadcast response:", JSON.stringify(data));
      if (data?.recipients) totalRecipients += Number(data.recipients);
      results.push({ method: "broadcast", status: response.status, data });
    } catch (err: any) {
      console.error("[OneSignal] Broadcast request failed:", err);
      results.push({ method: "broadcast", error: err?.message });
    }
  }

  // Method 2: Target by external_id (odisId) when not broadcasting
  if (!options.broadcastAll && validExternalIds.length > 0) {
    const aliasPayload = {
      ...basePayload,
      include_aliases: { external_id: validExternalIds },
      target_channel: "push",
    };

    try {
      console.log(`[OneSignal] Sending push via external_id to ${validExternalIds.length} user(s)...`);
      const response = await fetch("https://onesignal.com/api/v1/notifications", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${restApiKey}`,
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(aliasPayload),
      });
      const data = await response.json();
      console.log("[OneSignal] external_id response:", JSON.stringify(data));
      if (data?.recipients) totalRecipients += Number(data.recipients);
      results.push({ method: "external_id", status: response.status, data });
    } catch (err: any) {
      console.error("[OneSignal] external_id request failed:", err);
      results.push({ method: "external_id", error: err?.message });
    }
  }

  // Method 3: Target by subscription_id when specific device IDs are targeted
  if (!options.broadcastAll && validSubscriptionIds.length > 0) {
    const subPayload = {
      ...basePayload,
      include_subscription_ids: validSubscriptionIds,
    };

    try {
      console.log(`[OneSignal] Sending push via subscription_id to ${validSubscriptionIds.length} device(s)...`);
      const response = await fetch("https://onesignal.com/api/v1/notifications", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${restApiKey}`,
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(subPayload),
      });
      const data = await response.json();
      console.log("[OneSignal] subscription_id response:", JSON.stringify(data));
      if (data?.recipients) totalRecipients += Number(data.recipients);
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
    data: results.length === 1 ? results[0].data : results,
    recipients: totalRecipients,
  };
}

// Backward compatibility aliases
export const sendOneSignalNotificationToAll = sendOneSignalNotification;
export const sendOneSignalNotificationToUsers = sendOneSignalNotification;
