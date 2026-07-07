import mongoose from "mongoose";
import { UserModel, connectDB } from "../server/db";

/**
 * Script to update a user's birth time in the GG33 MongoDB database.
 * 
 * Usage:
 * 1. Ensure MONGODB_URI is set in your environment/secrets.
 * 2. Run with: npx tsx update_user_script.ts
 */

async function run() {
  // Connect to the database using existing configuration
  const connected = await connectDB();
  if (!connected) {
    console.error("Failed to connect to database. Ensure MONGODB_URI is set.");
    process.exit(1);
  }

  try {
    // Specify the user and the new time
    const odisId = "odis_600d1bd4-bd60-46ed-8d43-d463218128b1";
    const newBirthTime = "14:50";

    console.log(`Updating birthTime for user ${odisId} to ${newBirthTime}...`);

    const result = await UserModel.findOneAndUpdate(
      { odisId },
      { 
        $set: { 
          birthTime: newBirthTime, 
          updatedAt: new Date() 
        } 
      },
      { new: true } // Return the updated document
    );

    if (result) {
      console.log("Successfully updated user profile:");
      console.log({
        fullName: result.fullName,
        birthTime: result.birthTime,
        updatedAt: result.updatedAt
      });
    } else {
      console.log(`User with odisId ${odisId} not found.`);
    }
  } catch (error) {
    console.error("Error updating user:", error);
  } finally {
    // Always close the connection
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
}

run();
