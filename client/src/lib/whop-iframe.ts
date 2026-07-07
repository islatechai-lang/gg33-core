import { createSdk } from "@whop/iframe";

const appId = import.meta.env.VITE_WHOP_APP_ID;

if (!appId) {
  console.warn("VITE_WHOP_APP_ID is missing. Whop features will be disabled.");
}

export const iframeSdk = appId ? createSdk({ appId }) : null;
