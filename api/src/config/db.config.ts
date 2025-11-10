import mongoose from "mongoose";

class Database {
  private static instance: Database;
  private isConnected = false;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log("Using existing MongoDB connection.");
      return;
    }

    try {
      const url = String(process.env.DB_URL);
      if (!url) {
        throw new Error("Database URL not found in environment variables.");
      }

      await mongoose.connect(url);
      this.isConnected = true;
      console.log("✅ MongoDB connected successfully!");
    } catch (error) {
      console.error("❌ MongoDB connection error:", error);
      process.exit(1);
    }
  }

  public getConnection(): typeof mongoose {
    if (!this.isConnected) {
      throw new Error("MongoDB not connected. Call connect() first.");
    }
    return mongoose;
  }
}

export default Database;
