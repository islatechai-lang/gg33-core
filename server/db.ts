import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn("MONGODB_URI not set - database features will be disabled");
}

let isConnected = false;

export async function connectDB(): Promise<boolean> {
  if (!MONGODB_URI) {
    return false;
  }

  if (isConnected) {
    return true;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("Connected to MongoDB");
    return true;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    return false;
  }
}

// User Profile Schema - stores all user profile data
const userSchema = new mongoose.Schema({
  odisId: { type: String, required: true, unique: true, index: true },
  whopUserId: { type: String, sparse: true, index: true },
  firebaseUid: { type: String, sparse: true, index: true },
  email: { type: String, sparse: true, index: true },
  whopUsername: { type: String },
  whopProfilePictureUrl: { type: String },
  whopAccessLevel: { type: String, enum: ['customer', 'admin', 'no_access'] },
  fullName: { type: String, required: true },
  birthDate: { type: Date, required: true },
  birthTime: { type: String, default: "" },
  birthLocation: { type: String, default: "" },
  isPro: { type: Boolean, default: false },
  proPaymentReceiptId: { type: String, sparse: true, index: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.pre("save", function () {
  this.updatedAt = new Date();
});

export const UserModel = mongoose.model("User", userSchema);

// Daily Energy Reading Schema - stores AI-generated daily readings
const dailyEnergySchema = new mongoose.Schema({
  odisId: { type: String, required: true, index: true },
  date: { type: String, required: true },
  personalDayNumber: { type: Number, required: true },
  universalDayNumber: { type: Number, required: true },
  energyScore: { type: Number, required: true },
  theme: { type: String, required: true },
  description: { type: String, required: true },
  dos: [{ type: String }],
  donts: [{ type: String }],
  focusArea: { type: String, required: true },
  affirmation: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

dailyEnergySchema.index({ odisId: 1, date: 1 }, { unique: true });

export const DailyEnergyModel = mongoose.model("DailyEnergy", dailyEnergySchema);

// Personality Insights Schema - stores AI-generated personality analysis
const personalityInsightSchema = new mongoose.Schema({
  odisId: { type: String, required: true, index: true },
  overview: { type: String, required: true },
  strengths: [{ type: String }],
  challenges: [{ type: String }],
  lifeLesson: { type: String, required: true },
  careerPaths: [{ type: String }],
  relationshipStyle: { type: String, required: true },
  spiritualGifts: [{ type: String }],
  profileSnapshot: {
    fullName: String,
    birthDate: String,
    lifePathNumber: Number,
    expressionNumber: Number,
    soulUrgeNumber: Number,
    westernZodiac: String,
    chineseZodiac: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const PersonalityInsightModel = mongoose.model("PersonalityInsight", personalityInsightSchema);

// TypeScript interfaces
export interface DBUser {
  id: string;
  odisId: string;
  whopUserId?: string | null;
  firebaseUid?: string | null;
  email?: string | null;
  whopUsername?: string | null;
  whopProfilePictureUrl?: string | null;
  whopAccessLevel?: 'customer' | 'admin' | 'no_access' | null;
  fullName: string;
  birthDate: Date;
  birthTime?: string | null;
  birthLocation?: string | null;
  isPro: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DBDailyEnergy {
  id: string;
  odisId: string;
  date: string;
  personalDayNumber: number;
  universalDayNumber: number;
  energyScore: number;
  theme: string;
  description: string;
  dos: string[];
  donts: string[];
  focusArea: string;
  affirmation: string;
  createdAt: Date;
}

export interface DBPersonalityInsight {
  id: string;
  odisId: string;
  overview: string;
  strengths: string[];
  challenges: string[];
  lifeLesson: string;
  careerPaths: string[];
  relationshipStyle: string;
  spiritualGifts: string[];
  profileSnapshot: {
    fullName?: string | null;
    birthDate?: string | null;
    lifePathNumber?: number | null;
    expressionNumber?: number | null;
    soulUrgeNumber?: number | null;
    westernZodiac?: string | null;
    chineseZodiac?: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
}
