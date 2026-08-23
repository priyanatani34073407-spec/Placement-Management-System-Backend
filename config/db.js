import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Check whether MongoDB connection string exists
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI environment variable is not configured"
      );
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Failed:");
    console.error(error.message);

    // Stop the application if database connection fails
    process.exit(1);
  }
};

export default connectDB;
