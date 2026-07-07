import mongoose from "mongoose";
import { UserModel, connectDB } from "./server/db";
async function run() {
  await connectDB();
  const odisId = "odis_600d1bd4-bd60-46ed-8d43-d463218128b1";
  await UserModel.findOneAndUpdate({ odisId }, { $set: { birthTime: "14:50", updatedAt: new Date() } });
  await mongoose.connection.close();
}
run();
