import { createSdk } from "@whop/iframe";

const appId = (typeof process !== "undefined" && process.env)
  ? (process.env.NEXT_PUBLIC_WHOP_APP_ID || process.env.VITE_WHOP_APP_ID || process.env.WHOP_APP_ID)
  : undefined;

if (!appId) {
  console.warn("WHOP_APP_ID is missing. Whop features will be disabled.");
}

export const iframeSdk = appId ? createSdk({ appId }) : null;
