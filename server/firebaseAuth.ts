import { Request, Response, NextFunction } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "gg33-core";

// Firebase ID tokens are standard JWTs signed with RS256 using Google's public certificates
const JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);

export interface FirebaseUser {
  uid: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: FirebaseUser;
}

export async function firebaseAuthMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split("Bearer ")[1];
  if (!token) {
    return next();
  }

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
      audience: FIREBASE_PROJECT_ID,
    });

    if (payload && payload.sub) {
      req.user = {
        uid: payload.sub,
        email: payload.email as string | undefined,
        email_verified: payload.email_verified as boolean | undefined,
        name: payload.name as string | undefined,
        picture: payload.picture as string | undefined,
      };
      
      const path = req.path;
      if (path.startsWith('/api/') && !path.includes('.')) {
        console.log(`[Firebase Auth] User ${req.user.uid} (${req.user.email || 'no email'}) authenticated for ${req.method} ${path}`);
      }
    }
  } catch (error: any) {
    console.error(`[Firebase Auth] Token verification failed: ${error?.message || error}`);
  }

  next();
}

export function requireFirebaseAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
}
