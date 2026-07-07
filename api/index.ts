import { app, setupApp } from "../server/index";

let setupPromise: Promise<any> | null = null;

export default async function handler(req: any, res: any) {
  if (!setupPromise) {
    setupPromise = setupApp();
  }
  await setupPromise;
  return app(req, res);
}
