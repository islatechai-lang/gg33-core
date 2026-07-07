import { connectDB, UserModel, DailyEnergyModel, PersonalityInsightModel, type DBUser, type DBDailyEnergy, type DBPersonalityInsight } from "./db";
import crypto from "crypto";

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
}

export interface IStorage {
  // User operations
  getUserByOdisId(odisId: string): Promise<DBUser | null>;
  getUserByWhopId(whopUserId: string): Promise<DBUser | null>;
  getUserByFirebaseUid(firebaseUid: string): Promise<DBUser | null>;
  getUserByEmail(email: string): Promise<DBUser | null>;
  createUser(data: { odisId: string; fullName: string; birthDate: Date; birthTime?: string; birthLocation?: string; whopUserId?: string; firebaseUid?: string; email?: string; whopUsername?: string; whopProfilePictureUrl?: string; whopAccessLevel?: 'customer' | 'admin' | 'no_access'; isPro?: boolean }): Promise<DBUser>;
  updateUser(odisId: string, data: { fullName?: string; birthDate?: Date; birthTime?: string; birthLocation?: string }): Promise<DBUser | null>;
  updateWhopProfile(whopUserId: string, data: { whopUsername?: string; whopProfilePictureUrl?: string; whopAccessLevel?: 'customer' | 'admin' | 'no_access' }): Promise<DBUser | null>;
  upgradeUserToPro(odisId: string, receiptId: string): Promise<DBUser | null>;
  syncProStatus(whopUserId: string, isPro: boolean, membershipId?: string | null): Promise<DBUser | null>;
  getUserByPaymentReceipt(receiptId: string): Promise<DBUser | null>;

  // Daily Energy operations
  getDailyEnergy(odisId: string, date: string): Promise<DBDailyEnergy | null>;
  saveDailyEnergy(data: Omit<DBDailyEnergy, 'id' | 'createdAt'>): Promise<DBDailyEnergy>;
  getUsersMissingDailyEnergy(date: string): Promise<DBUser[]>;
  getAllUsersWithWhopId(): Promise<DBUser[]>;

  // Personality Insight operations
  getPersonalityInsight(odisId: string): Promise<DBPersonalityInsight | null>;
  savePersonalityInsight(data: Omit<DBPersonalityInsight, 'id' | 'createdAt' | 'updatedAt'>): Promise<DBPersonalityInsight>;

  // Course Progress operations (in-memory)
  getCourseProgress(courseId: string): Promise<LessonProgress[]>;
  markLessonComplete(courseId: string, lessonId: string): Promise<void>;
}

function generateOdisId(): string {
  return `odis_${crypto.randomUUID()}`;
}

export { generateOdisId };

export class MongoStorage implements IStorage {
  private initialized = false;
  // In-memory progress storage: Map<courseId, Set<completedLessonIds>>
  private progressStore: Map<string, Set<string>> = new Map();

  private async ensureConnected(): Promise<boolean> {
    if (!this.initialized) {
      this.initialized = await connectDB();
    }
    return this.initialized;
  }

  // User operations
  async getUserByOdisId(odisId: string): Promise<DBUser | null> {
    const connected = await this.ensureConnected();
    if (!connected) {
      return null;
    }

    try {
      const user = await UserModel.findOne({ odisId });
      if (!user) return null;

      return {
        id: user._id.toString(),
        odisId: user.odisId,
        whopUserId: user.whopUserId,
        firebaseUid: user.firebaseUid,
        email: user.email,
        whopUsername: user.whopUsername,
        whopProfilePictureUrl: user.whopProfilePictureUrl,
        whopAccessLevel: user.whopAccessLevel,
        fullName: user.fullName,
        birthDate: user.birthDate,
        birthTime: user.birthTime,
        birthLocation: user.birthLocation,
        isPro: (user.odisId === 'odis_e4ef0aac-e27c-498d-a6be-ea5a248fd1b6' ||
          user.odisId === 'odis_600d1bd4-bd60-46ed-8d43-d463218128b1' ||
          user.odisId === 'odis_2827b3cb-26b7-4ac6-9100-2ffcf0dcdb63' ||
          user.odisId === 'odis_af728c65-76e4-4c20-8fc3-84b0d10bf851' ||
          user.odisId === 'odis_33d1fd75-fd80-432b-bcad-0d4bb2b47671' ||
          user.whopUserId === 'user_gPT4lCtHrnQZj' ||
          user.whopUserId === 'user_Ax0gbiirHXs1G' ||
          user.whopUserId === 'user_2MuiDqjP6bDzN' ||
          user.whopUserId === 'user_fXle2wr73Jt2t' ||
          user.whopUserId === 'user_LQYeqBENW8rFs') ? true : (user.isPro ?? false),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error("Error getting user by odisId:", error);
      return null;
    }
  }

  async getUserByWhopId(whopUserId: string): Promise<DBUser | null> {
    const connected = await this.ensureConnected();
    if (!connected) {
      return null;
    }

    try {
      const user = await UserModel.findOne({ whopUserId });
      if (!user) return null;

      return {
        id: user._id.toString(),
        odisId: user.odisId,
        whopUserId: user.whopUserId,
        firebaseUid: user.firebaseUid,
        email: user.email,
        whopUsername: user.whopUsername,
        whopProfilePictureUrl: user.whopProfilePictureUrl,
        whopAccessLevel: user.whopAccessLevel,
        fullName: user.fullName,
        birthDate: user.birthDate,
        birthTime: user.birthTime,
        birthLocation: user.birthLocation,
        isPro: (user.odisId === 'odis_e4ef0aac-e27c-498d-a6be-ea5a248fd1b6' ||
          user.odisId === 'odis_600d1bd4-bd60-46ed-8d43-d463218128b1' ||
          user.odisId === 'odis_2827b3cb-26b7-4ac6-9100-2ffcf0dcdb63' ||
          user.odisId === 'odis_af728c65-76e4-4c20-8fc3-84b0d10bf851' ||
          user.odisId === 'odis_33d1fd75-fd80-432b-bcad-0d4bb2b47671' ||
          user.whopUserId === 'user_gPT4lCtHrnQZj' ||
          user.whopUserId === 'user_Ax0gbiirHXs1G' ||
          user.whopUserId === 'user_2MuiDqjP6bDzN' ||
          user.whopUserId === 'user_fXle2wr73Jt2t' ||
          user.whopUserId === 'user_LQYeqBENW8rFs') ? true : (user.isPro ?? false),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error("Error getting user by Whop ID:", error);
      return null;
    }
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<DBUser | null> {
    const connected = await this.ensureConnected();
    if (!connected) {
      return null;
    }

    try {
      const user = await UserModel.findOne({ firebaseUid });
      if (!user) return null;

      return {
        id: user._id.toString(),
        odisId: user.odisId,
        whopUserId: user.whopUserId,
        firebaseUid: user.firebaseUid,
        email: user.email,
        whopUsername: user.whopUsername,
        whopProfilePictureUrl: user.whopProfilePictureUrl,
        whopAccessLevel: user.whopAccessLevel,
        fullName: user.fullName,
        birthDate: user.birthDate,
        birthTime: user.birthTime,
        birthLocation: user.birthLocation,
        isPro: (user.odisId === 'odis_e4ef0aac-e27c-498d-a6be-ea5a248fd1b6' ||
          user.odisId === 'odis_600d1bd4-bd60-46ed-8d43-d463218128b1' ||
          user.odisId === 'odis_2827b3cb-26b7-4ac6-9100-2ffcf0dcdb63' ||
          user.odisId === 'odis_af728c65-76e4-4c20-8fc3-84b0d10bf851' ||
          user.odisId === 'odis_33d1fd75-fd80-432b-bcad-0d4bb2b47671' ||
          user.whopUserId === 'user_gPT4lCtHrnQZj' ||
          user.whopUserId === 'user_Ax0gbiirHXs1G' ||
          user.whopUserId === 'user_2MuiDqjP6bDzN' ||
          user.whopUserId === 'user_fXle2wr73Jt2t' ||
          user.whopUserId === 'user_LQYeqBENW8rFs') ? true : (user.isPro ?? false),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error("Error getting user by Firebase UID:", error);
      return null;
    }
  }

  async getUserByEmail(email: string): Promise<DBUser | null> {
    const connected = await this.ensureConnected();
    if (!connected) {
      return null;
    }

    try {
      const user = await UserModel.findOne({ email });
      if (!user) return null;

      return {
        id: user._id.toString(),
        odisId: user.odisId,
        whopUserId: user.whopUserId,
        firebaseUid: user.firebaseUid,
        email: user.email,
        whopUsername: user.whopUsername,
        whopProfilePictureUrl: user.whopProfilePictureUrl,
        whopAccessLevel: user.whopAccessLevel,
        fullName: user.fullName,
        birthDate: user.birthDate,
        birthTime: user.birthTime,
        birthLocation: user.birthLocation,
        isPro: (user.odisId === 'odis_e4ef0aac-e27c-498d-a6be-ea5a248fd1b6' ||
          user.odisId === 'odis_600d1bd4-bd60-46ed-8d43-d463218128b1' ||
          user.odisId === 'odis_2827b3cb-26b7-4ac6-9100-2ffcf0dcdb63' ||
          user.odisId === 'odis_af728c65-76e4-4c20-8fc3-84b0d10bf851' ||
          user.odisId === 'odis_33d1fd75-fd80-432b-bcad-0d4bb2b47671' ||
          user.whopUserId === 'user_gPT4lCtHrnQZj' ||
          user.whopUserId === 'user_Ax0gbiirHXs1G' ||
          user.whopUserId === 'user_2MuiDqjP6bDzN' ||
          user.whopUserId === 'user_fXle2wr73Jt2t' ||
          user.whopUserId === 'user_LQYeqBENW8rFs') ? true : (user.isPro ?? false),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error("Error getting user by email:", error);
      return null;
    }
  }

  async createUser(data: { odisId: string; fullName: string; birthDate: Date; birthTime?: string; birthLocation?: string; whopUserId?: string; firebaseUid?: string; email?: string; whopUsername?: string; whopProfilePictureUrl?: string; whopAccessLevel?: 'customer' | 'admin' | 'no_access'; isPro?: boolean }): Promise<DBUser> {
    const connected = await this.ensureConnected();
    if (!connected) {
      throw new Error("Database not connected");
    }

    try {
      const user = await UserModel.create({
        odisId: data.odisId,
        whopUserId: data.whopUserId,
        firebaseUid: data.firebaseUid,
        email: data.email,
        whopUsername: data.whopUsername,
        whopProfilePictureUrl: data.whopProfilePictureUrl,
        whopAccessLevel: data.whopAccessLevel,
        fullName: data.fullName,
        birthDate: data.birthDate,
        birthTime: data.birthTime,
        birthLocation: data.birthLocation,
        isPro: data.isPro ?? false,
      });

      return {
        id: user._id.toString(),
        odisId: user.odisId,
        whopUserId: user.whopUserId,
        firebaseUid: user.firebaseUid,
        email: user.email,
        whopUsername: user.whopUsername,
        whopProfilePictureUrl: user.whopProfilePictureUrl,
        whopAccessLevel: user.whopAccessLevel,
        fullName: user.fullName,
        birthDate: user.birthDate,
        birthTime: user.birthTime,
        birthLocation: user.birthLocation,
        isPro: user.isPro ?? false,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUser(odisId: string, data: { fullName?: string; birthDate?: Date; birthTime?: string; birthLocation?: string }): Promise<DBUser | null> {
    const connected = await this.ensureConnected();
    if (!connected) {
      throw new Error("Database not connected");
    }

    try {
      const updateFields: any = { ...data, updatedAt: new Date() };
      // Ensure birthTime is explicitly handled if provided
      if (data.birthTime !== undefined) {
        updateFields.birthTime = data.birthTime;
      }

      const user = await UserModel.findOneAndUpdate(
        { odisId },
        { $set: updateFields },
        { new: true }
      );

      if (!user) return null;

      return {
        id: user._id.toString(),
        odisId: user.odisId,
        whopUserId: user.whopUserId,
        whopUsername: user.whopUsername,
        whopProfilePictureUrl: user.whopProfilePictureUrl,
        whopAccessLevel: user.whopAccessLevel,
        fullName: user.fullName,
        birthDate: user.birthDate,
        birthTime: user.birthTime,
        birthLocation: user.birthLocation,
        isPro: user.isPro ?? false,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  async updateWhopProfile(whopUserId: string, data: { whopUsername?: string; whopProfilePictureUrl?: string; whopAccessLevel?: 'customer' | 'admin' | 'no_access' }): Promise<DBUser | null> {
    const connected = await this.ensureConnected();
    if (!connected) {
      throw new Error("Database not connected");
    }

    try {
      // Filter out undefined values to prevent overwriting existing data
      const updateData: Record<string, unknown> = { updatedAt: new Date() };
      if (data.whopUsername !== undefined) updateData.whopUsername = data.whopUsername;
      if (data.whopProfilePictureUrl !== undefined) updateData.whopProfilePictureUrl = data.whopProfilePictureUrl;
      if (data.whopAccessLevel !== undefined) updateData.whopAccessLevel = data.whopAccessLevel;

      const user = await UserModel.findOneAndUpdate(
        { whopUserId },
        { $set: updateData },
        { new: true }
      );

      if (!user) return null;

      return {
        id: user._id.toString(),
        odisId: user.odisId,
        whopUserId: user.whopUserId,
        whopUsername: user.whopUsername,
        whopProfilePictureUrl: user.whopProfilePictureUrl,
        whopAccessLevel: user.whopAccessLevel,
        fullName: user.fullName,
        birthDate: user.birthDate,
        birthTime: user.birthTime,
        birthLocation: user.birthLocation,
        isPro: user.isPro ?? false,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error("Error updating Whop profile:", error);
      throw error;
    }
  }

  async upgradeUserToPro(odisId: string, receiptId: string): Promise<DBUser | null> {
    const connected = await this.ensureConnected();
    if (!connected) {
      throw new Error("Database not connected");
    }

    try {
      const user = await UserModel.findOneAndUpdate(
        { odisId },
        { $set: { isPro: true, proPaymentReceiptId: receiptId, updatedAt: new Date() } },
        { new: true }
      );

      if (!user) return null;

      return {
        id: user._id.toString(),
        odisId: user.odisId,
        whopUserId: user.whopUserId,
        firebaseUid: user.firebaseUid,
        email: user.email,
        whopUsername: user.whopUsername,
        whopProfilePictureUrl: user.whopProfilePictureUrl,
        whopAccessLevel: user.whopAccessLevel,
        fullName: user.fullName,
        birthDate: user.birthDate,
        birthTime: user.birthTime,
        birthLocation: user.birthLocation,
        isPro: user.isPro ?? false,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error("Error upgrading user to Pro:", error);
      throw error;
    }
  }

  async syncProStatus(whopUserId: string, isPro: boolean, membershipId?: string | null): Promise<DBUser | null> {
    const connected = await this.ensureConnected();
    if (!connected) {
      throw new Error("Database not connected");
    }

    try {
      const updateData: any = {
        isPro,
        updatedAt: new Date()
      };

      if (membershipId !== undefined) {
        updateData.proPaymentReceiptId = membershipId;
      }

      const user = await UserModel.findOneAndUpdate(
        { whopUserId },
        { $set: updateData },
        { new: true }
      );

      if (!user) return null;

      console.log(`[Storage] Synced Pro status for user ${whopUserId}: isPro=${isPro}, membershipId=${membershipId || 'none'}`);

      return {
        id: user._id.toString(),
        odisId: user.odisId,
        whopUserId: user.whopUserId,
        whopUsername: user.whopUsername,
        whopProfilePictureUrl: user.whopProfilePictureUrl,
        whopAccessLevel: user.whopAccessLevel,
        fullName: user.fullName,
        birthDate: user.birthDate,
        birthTime: user.birthTime,
        birthLocation: user.birthLocation,
        isPro: user.isPro ?? false,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error("Error syncing Pro status:", error);
      throw error;
    }
  }

  async getUserByPaymentReceipt(receiptId: string): Promise<DBUser | null> {
    const connected = await this.ensureConnected();
    if (!connected) {
      return null;
    }

    try {
      const user = await UserModel.findOne({ proPaymentReceiptId: receiptId });
      if (!user) return null;

      return {
        id: user._id.toString(),
        odisId: user.odisId,
        whopUserId: user.whopUserId,
        whopUsername: user.whopUsername,
        whopProfilePictureUrl: user.whopProfilePictureUrl,
        whopAccessLevel: user.whopAccessLevel,
        fullName: user.fullName,
        birthDate: user.birthDate,
        birthTime: user.birthTime,
        birthLocation: user.birthLocation,
        isPro: user.isPro ?? false,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error("Error getting user by payment receipt:", error);
      return null;
    }
  }

  // Daily Energy operations
  async getDailyEnergy(odisId: string, date: string): Promise<DBDailyEnergy | null> {
    const connected = await this.ensureConnected();
    if (!connected) {
      return null;
    }

    try {
      const energy = await DailyEnergyModel.findOne({ odisId, date });
      if (!energy) return null;

      return {
        id: energy._id.toString(),
        odisId: energy.odisId,
        date: energy.date,
        personalDayNumber: energy.personalDayNumber,
        universalDayNumber: energy.universalDayNumber,
        energyScore: energy.energyScore,
        theme: energy.theme,
        description: energy.description,
        dos: energy.dos,
        donts: energy.donts,
        focusArea: energy.focusArea,
        affirmation: energy.affirmation,
        createdAt: energy.createdAt,
      };
    } catch (error) {
      console.error("Error getting daily energy:", error);
      return null;
    }
  }

  async saveDailyEnergy(data: Omit<DBDailyEnergy, 'id' | 'createdAt'>): Promise<DBDailyEnergy> {
    const connected = await this.ensureConnected();
    if (!connected) {
      throw new Error("Database not connected");
    }

    try {
      const energy = await DailyEnergyModel.findOneAndUpdate(
        { odisId: data.odisId, date: data.date },
        { $set: data },
        { upsert: true, new: true }
      );

      return {
        id: energy._id.toString(),
        odisId: energy.odisId,
        date: energy.date,
        personalDayNumber: energy.personalDayNumber,
        universalDayNumber: energy.universalDayNumber,
        energyScore: energy.energyScore,
        theme: energy.theme,
        description: energy.description,
        dos: energy.dos,
        donts: energy.donts,
        focusArea: energy.focusArea,
        affirmation: energy.affirmation,
        createdAt: energy.createdAt,
      };
    } catch (error) {
      console.error("Error saving daily energy:", error);
      throw error;
    }
  }

  async getUsersMissingDailyEnergy(date: string): Promise<DBUser[]> {
    const connected = await this.ensureConnected();
    if (!connected) {
      return [];
    }

    try {
      // Get all users that have a whopUserId (so we can send them notifications)
      const allWhopUsers = await UserModel.find({ whopUserId: { $exists: true, $ne: null } });

      // Get all daily energy entries for this date
      const existingEnergies = await DailyEnergyModel.find({ date });
      const usersWithEnergy = new Set(existingEnergies.map(e => e.odisId));

      // Filter to users who don't have a reading yet
      const missingUsers = allWhopUsers.filter(user => !usersWithEnergy.has(user.odisId));

      // Deduplicate by whopUserId to prevent multiple notifications per user
      const seenWhopIds = new Set<string>();
      const uniqueUsers = missingUsers.filter(user => {
        if (!user.whopUserId || seenWhopIds.has(user.whopUserId)) return false;
        seenWhopIds.add(user.whopUserId);
        return true;
      });

      return uniqueUsers.map(user => ({
        id: user._id.toString(),
        odisId: user.odisId,
        whopUserId: user.whopUserId,
        whopUsername: user.whopUsername,
        whopProfilePictureUrl: user.whopProfilePictureUrl,
        whopAccessLevel: user.whopAccessLevel,
        fullName: user.fullName,
        birthDate: user.birthDate,
        birthTime: user.birthTime,
        birthLocation: user.birthLocation,
        isPro: user.isPro ?? false,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));
    } catch (error) {
      console.error("Error getting users missing daily energy:", error);
      return [];
    }
  }

  async getAllUsersWithWhopId(): Promise<DBUser[]> {
    const connected = await this.ensureConnected();
    if (!connected) {
      return [];
    }

    try {
      const users = await UserModel.find({ whopUserId: { $exists: true, $ne: null } });

      // Deduplicate by whopUserId to prevent multiple notifications per user
      const seenWhopIds = new Set<string>();
      const uniqueUsers = users.filter(user => {
        if (!user.whopUserId || seenWhopIds.has(user.whopUserId)) return false;
        seenWhopIds.add(user.whopUserId);
        return true;
      });

      return uniqueUsers.map(user => ({
        id: user._id.toString(),
        odisId: user.odisId,
        whopUserId: user.whopUserId,
        whopUsername: user.whopUsername,
        whopProfilePictureUrl: user.whopProfilePictureUrl,
        whopAccessLevel: user.whopAccessLevel,
        fullName: user.fullName,
        birthDate: user.birthDate,
        birthTime: user.birthTime,
        birthLocation: user.birthLocation,
        isPro: user.isPro ?? false,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));
    } catch (error) {
      console.error("Error getting all users with Whop ID:", error);
      return [];
    }
  }

  // Personality Insight operations
  async getPersonalityInsight(odisId: string): Promise<DBPersonalityInsight | null> {
    const connected = await this.ensureConnected();
    if (!connected) {
      return null;
    }

    try {
      const insight = await PersonalityInsightModel.findOne({ odisId }).sort({ createdAt: -1 });
      if (!insight) return null;

      return {
        id: insight._id.toString(),
        odisId: insight.odisId,
        overview: insight.overview,
        strengths: insight.strengths,
        challenges: insight.challenges,
        lifeLesson: insight.lifeLesson,
        careerPaths: insight.careerPaths,
        relationshipStyle: insight.relationshipStyle,
        spiritualGifts: insight.spiritualGifts,
        profileSnapshot: insight.profileSnapshot || {},
        createdAt: insight.createdAt,
        updatedAt: insight.updatedAt,
      };
    } catch (error) {
      console.error("Error getting personality insight:", error);
      return null;
    }
  }

  async savePersonalityInsight(data: Omit<DBPersonalityInsight, 'id' | 'createdAt' | 'updatedAt'>): Promise<DBPersonalityInsight> {
    const connected = await this.ensureConnected();
    if (!connected) {
      throw new Error("Database not connected");
    }

    try {
      const insight = await PersonalityInsightModel.findOneAndUpdate(
        { odisId: data.odisId },
        { $set: { ...data, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
        { upsert: true, new: true }
      );

      return {
        id: insight._id.toString(),
        odisId: insight.odisId,
        overview: insight.overview,
        strengths: insight.strengths,
        challenges: insight.challenges,
        lifeLesson: insight.lifeLesson,
        careerPaths: insight.careerPaths,
        relationshipStyle: insight.relationshipStyle,
        spiritualGifts: insight.spiritualGifts,
        profileSnapshot: insight.profileSnapshot || {},
        createdAt: insight.createdAt,
        updatedAt: insight.updatedAt,
      };
    } catch (error) {
      console.error("Error saving personality insight:", error);
      throw error;
    }
  }

  // Course Progress operations (in-memory)
  async getCourseProgress(courseId: string): Promise<LessonProgress[]> {
    const completedLessons = this.progressStore.get(courseId);
    if (!completedLessons) {
      return [];
    }
    return Array.from(completedLessons).map(lessonId => ({
      lessonId,
      completed: true,
    }));
  }

  async markLessonComplete(courseId: string, lessonId: string): Promise<void> {
    if (!this.progressStore.has(courseId)) {
      this.progressStore.set(courseId, new Set());
    }
    this.progressStore.get(courseId)!.add(lessonId);
  }
}

export const storage = new MongoStorage();
