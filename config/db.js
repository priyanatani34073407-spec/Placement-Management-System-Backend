import mongoose from "mongoose";
import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ Database connection failed");
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
