import { connectDB, db, type DBUser, type DBDailyEnergy, type DBPersonalityInsight } from "./db";
import { Timestamp } from "firebase-admin/firestore";
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

function toDate(val: any): Date {
  if (!val) return new Date();
  if (val instanceof Timestamp) {
    return val.toDate();
  }
  if (val && typeof val.toDate === "function") {
    return val.toDate();
  }
  if (val instanceof Date) {
    return val;
  }
  if (typeof val === "string" || typeof val === "number") {
    return new Date(val);
  }
  return new Date();
}

function mapUserDoc(docId: string, data: any): DBUser {
  const isProOverridden = (data.odisId === 'odis_e4ef0aac-e27c-498d-a6be-ea5a248fd1b6' ||
    data.odisId === 'odis_600d1bd4-bd60-46ed-8d43-d463218128b1' ||
    data.odisId === 'odis_2827b3cb-26b7-4ac6-9100-2ffcf0dcdb63' ||
    data.odisId === 'odis_af728c65-76e4-4c20-8fc3-84b0d10bf851' ||
    data.odisId === 'odis_33d1fd75-fd80-432b-bcad-0d4bb2b47671' ||
    data.whopUserId === 'user_gPT4lCtHrnQZj' ||
    data.whopUserId === 'user_Ax0gbiirHXs1G' ||
    data.whopUserId === 'user_2MuiDqjP6bDzN' ||
    data.whopUserId === 'user_fXle2wr73Jt2t' ||
    data.whopUserId === 'user_LQYeqBENW8rFs');

  return {
    id: docId,
    odisId: data.odisId || docId,
    whopUserId: data.whopUserId || null,
    firebaseUid: data.firebaseUid || null,
    email: data.email || null,
    whopUsername: data.whopUsername || null,
    whopProfilePictureUrl: data.whopProfilePictureUrl || null,
    whopAccessLevel: data.whopAccessLevel || null,
    fullName: data.fullName || "",
    birthDate: toDate(data.birthDate),
    birthTime: data.birthTime || null,
    birthLocation: data.birthLocation || null,
    isPro: isProOverridden ? true : (data.isPro ?? false),
    proPaymentReceiptId: data.proPaymentReceiptId || null,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

export class FirestoreStorage implements IStorage {
  private initialized = false;
  private progressStore: Map<string, Set<string>> = new Map();

  private async ensureConnected(): Promise<boolean> {
    if (!this.initialized) {
      this.initialized = await connectDB();
    }
    return this.initialized;
  }

  // User operations
  async getUserByOdisId(odisId: string): Promise<DBUser | null> {
    await this.ensureConnected();
    try {
      const docRef = db.collection("users").doc(odisId);
      const snapshot = await docRef.get();
      if (!snapshot.exists) return null;
      return mapUserDoc(snapshot.id, snapshot.data());
    } catch (error) {
      console.error("Error getting user by odisId:", error);
      return null;
    }
  }

  async getUserByWhopId(whopUserId: string): Promise<DBUser | null> {
    await this.ensureConnected();
    try {
      const snapshot = await db.collection("users").where("whopUserId", "==", whopUserId).limit(1).get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return mapUserDoc(doc.id, doc.data());
    } catch (error) {
      console.error("Error getting user by Whop ID:", error);
      return null;
    }
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<DBUser | null> {
    await this.ensureConnected();
    try {
      const snapshot = await db.collection("users").where("firebaseUid", "==", firebaseUid).limit(1).get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return mapUserDoc(doc.id, doc.data());
    } catch (error) {
      console.error("Error getting user by Firebase UID:", error);
      return null;
    }
  }

  async getUserByEmail(email: string): Promise<DBUser | null> {
    await this.ensureConnected();
    try {
      const snapshot = await db.collection("users").where("email", "==", email).limit(1).get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return mapUserDoc(doc.id, doc.data());
    } catch (error) {
      console.error("Error getting user by email:", error);
      return null;
    }
  }

  async createUser(data: { odisId: string; fullName: string; birthDate: Date; birthTime?: string; birthLocation?: string; whopUserId?: string; firebaseUid?: string; email?: string; whopUsername?: string; whopProfilePictureUrl?: string; whopAccessLevel?: 'customer' | 'admin' | 'no_access'; isPro?: boolean }): Promise<DBUser> {
    await this.ensureConnected();
    try {
      const docRef = db.collection("users").doc(data.odisId);
      const userPayload = {
        odisId: data.odisId,
        whopUserId: data.whopUserId || null,
        firebaseUid: data.firebaseUid || null,
        email: data.email || null,
        whopUsername: data.whopUsername || null,
        whopProfilePictureUrl: data.whopProfilePictureUrl || null,
        whopAccessLevel: data.whopAccessLevel || null,
        fullName: data.fullName,
        birthDate: data.birthDate,
        birthTime: data.birthTime || null,
        birthLocation: data.birthLocation || null,
        isPro: data.isPro ?? false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await docRef.set(userPayload);
      return mapUserDoc(data.odisId, userPayload);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUser(odisId: string, data: { fullName?: string; birthDate?: Date; birthTime?: string; birthLocation?: string }): Promise<DBUser | null> {
    await this.ensureConnected();
    try {
      const docRef = db.collection("users").doc(odisId);
      const snapshot = await docRef.get();
      if (!snapshot.exists) return null;

      const updateFields: any = { ...data, updatedAt: new Date() };
      await docRef.update(updateFields);

      const updatedSnapshot = await docRef.get();
      return mapUserDoc(updatedSnapshot.id, updatedSnapshot.data());
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  async updateWhopProfile(whopUserId: string, data: { whopUsername?: string; whopProfilePictureUrl?: string; whopAccessLevel?: 'customer' | 'admin' | 'no_access' }): Promise<DBUser | null> {
    await this.ensureConnected();
    try {
      const snapshot = await db.collection("users").where("whopUserId", "==", whopUserId).limit(1).get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      const docRef = db.collection("users").doc(doc.id);

      const updateData: Record<string, unknown> = { updatedAt: new Date() };
      if (data.whopUsername !== undefined) updateData.whopUsername = data.whopUsername;
      if (data.whopProfilePictureUrl !== undefined) updateData.whopProfilePictureUrl = data.whopProfilePictureUrl;
      if (data.whopAccessLevel !== undefined) updateData.whopAccessLevel = data.whopAccessLevel;

      await docRef.update(updateData);
      const updatedSnapshot = await docRef.get();
      return mapUserDoc(updatedSnapshot.id, updatedSnapshot.data());
    } catch (error) {
      console.error("Error updating Whop profile:", error);
      throw error;
    }
  }

  async upgradeUserToPro(odisId: string, receiptId: string): Promise<DBUser | null> {
    await this.ensureConnected();
    try {
      const docRef = db.collection("users").doc(odisId);
      const snapshot = await docRef.get();
      if (!snapshot.exists) return null;

      await docRef.update({
        isPro: true,
        proPaymentReceiptId: receiptId,
        updatedAt: new Date()
      });

      const updatedSnapshot = await docRef.get();
      return mapUserDoc(updatedSnapshot.id, updatedSnapshot.data());
    } catch (error) {
      console.error("Error upgrading user to Pro:", error);
      throw error;
    }
  }

  async syncProStatus(whopUserId: string, isPro: boolean, membershipId?: string | null): Promise<DBUser | null> {
    await this.ensureConnected();
    try {
      const snapshot = await db.collection("users").where("whopUserId", "==", whopUserId).limit(1).get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      const docRef = db.collection("users").doc(doc.id);

      const updateData: any = {
        isPro,
        updatedAt: new Date()
      };
      if (membershipId !== undefined) {
        updateData.proPaymentReceiptId = membershipId;
      }

      await docRef.update(updateData);
      console.log(`[Storage] Synced Pro status for user ${whopUserId}: isPro=${isPro}, membershipId=${membershipId || 'none'}`);

      const updatedSnapshot = await docRef.get();
      return mapUserDoc(updatedSnapshot.id, updatedSnapshot.data());
    } catch (error) {
      console.error("Error syncing Pro status:", error);
      throw error;
    }
  }

  async getUserByPaymentReceipt(receiptId: string): Promise<DBUser | null> {
    await this.ensureConnected();
    try {
      const snapshot = await db.collection("users").where("proPaymentReceiptId", "==", receiptId).limit(1).get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return mapUserDoc(doc.id, doc.data());
    } catch (error) {
      console.error("Error getting user by payment receipt:", error);
      return null;
    }
  }

  // Daily Energy operations
  async getDailyEnergy(odisId: string, date: string): Promise<DBDailyEnergy | null> {
    await this.ensureConnected();
    try {
      const docId = `${odisId}_${date}`;
      const docRef = db.collection("dailyEnergy").doc(docId);
      const snapshot = await docRef.get();
      if (!snapshot.exists) return null;

      const data = snapshot.data()!;
      return {
        id: snapshot.id,
        odisId: data.odisId,
        date: data.date,
        personalDayNumber: data.personalDayNumber,
        universalDayNumber: data.universalDayNumber,
        energyScore: data.energyScore,
        theme: data.theme,
        description: data.description,
        dos: data.dos || [],
        donts: data.donts || [],
        focusArea: data.focusArea,
        affirmation: data.affirmation,
        createdAt: toDate(data.createdAt),
      };
    } catch (error) {
      console.error("Error getting daily energy:", error);
      return null;
    }
  }

  async saveDailyEnergy(data: Omit<DBDailyEnergy, 'id' | 'createdAt'>): Promise<DBDailyEnergy> {
    await this.ensureConnected();
    try {
      const docId = `${data.odisId}_${data.date}`;
      const docRef = db.collection("dailyEnergy").doc(docId);

      const payload = {
        ...data,
        createdAt: new Date(),
      };
      await docRef.set(payload);

      return {
        id: docId,
        ...payload,
      };
    } catch (error) {
      console.error("Error saving daily energy:", error);
      throw error;
    }
  }

  async getUsersMissingDailyEnergy(date: string): Promise<DBUser[]> {
    await this.ensureConnected();
    try {
      // Get all users
      const usersSnapshot = await db.collection("users").get();
      const allWhopUsers = usersSnapshot.docs
        .map(doc => mapUserDoc(doc.id, doc.data()))
        .filter(user => !!user.whopUserId);

      // Get all daily energy entries for this date
      const energySnapshot = await db.collection("dailyEnergy").where("date", "==", date).get();
      const usersWithEnergy = new Set(energySnapshot.docs.map(doc => doc.data().odisId));

      // Filter to users who don't have a reading yet
      const missingUsers = allWhopUsers.filter(user => !usersWithEnergy.has(user.odisId));

      // Deduplicate by whopUserId
      const seenWhopIds = new Set<string>();
      return missingUsers.filter(user => {
        if (!user.whopUserId || seenWhopIds.has(user.whopUserId)) return false;
        seenWhopIds.add(user.whopUserId);
        return true;
      });
    } catch (error) {
      console.error("Error getting users missing daily energy:", error);
      return [];
    }
  }

  async getAllUsersWithWhopId(): Promise<DBUser[]> {
    await this.ensureConnected();
    try {
      const usersSnapshot = await db.collection("users").get();
      const users = usersSnapshot.docs.map(doc => mapUserDoc(doc.id, doc.data()));

      // Filter and deduplicate by whopUserId
      const seenWhopIds = new Set<string>();
      return users.filter(user => {
        if (!user.whopUserId || seenWhopIds.has(user.whopUserId)) return false;
        seenWhopIds.add(user.whopUserId);
        return true;
      });
    } catch (error) {
      console.error("Error getting all users with Whop ID:", error);
      return [];
    }
  }

  // Personality Insight operations
  async getPersonalityInsight(odisId: string): Promise<DBPersonalityInsight | null> {
    await this.ensureConnected();
    try {
      const docRef = db.collection("personalityInsights").doc(odisId);
      const snapshot = await docRef.get();
      if (!snapshot.exists) return null;

      const data = snapshot.data()!;
      return {
        id: snapshot.id,
        odisId: data.odisId || odisId,
        overview: data.overview || "",
        strengths: data.strengths || [],
        challenges: data.challenges || [],
        lifeLesson: data.lifeLesson || "",
        careerPaths: data.careerPaths || [],
        relationshipStyle: data.relationshipStyle || "",
        spiritualGifts: data.spiritualGifts || [],
        profileSnapshot: data.profileSnapshot || {},
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt),
      };
    } catch (error) {
      console.error("Error getting personality insight:", error);
      return null;
    }
  }

  async savePersonalityInsight(data: Omit<DBPersonalityInsight, 'id' | 'createdAt' | 'updatedAt'>): Promise<DBPersonalityInsight> {
    await this.ensureConnected();
    try {
      const docRef = db.collection("personalityInsights").doc(data.odisId);
      const payload = {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await docRef.set(payload);

      return {
        id: data.odisId,
        ...payload,
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

export const storage = new FirestoreStorage();
