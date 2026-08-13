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

// Use module augmentation to extend Express Request
declare global {
  namespace Express {
    interface Request {
      firebaseUser?: FirebaseUser;
    }
  }
}

// Keep AuthenticatedRequest as a simple alias for backward compatibility
export type AuthenticatedRequest = Request;

export async function firebaseAuthMiddleware(
  req: Request,
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
      (req as any).user = {
        uid: payload.sub,
        email: payload.email as string | undefined,
        email_verified: payload.email_verified as boolean | undefined,
        name: payload.name as string | undefined,
        picture: payload.picture as string | undefined,
      };
      
      const path = req.path;
      if (path.startsWith('/api/') && !path.includes('.')) {
        console.log(`[Firebase Auth] User ${(req as any).user.uid} (${(req as any).user.email || 'no email'}) authenticated for ${req.method} ${path}`);
      }
    }
  } catch (error: any) {
    console.error(`[Firebase Auth] Token verification failed: ${error?.message || error}`);
  }

  next();
}

export function requireFirebaseAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!(req as any).user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
}
