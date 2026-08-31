import mongoose from "mongoose";

// ===============================
// MongoDB Connection
// ===============================

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI environment variable is not configured"
      );
    }

    // Avoid opening another connection
    // if MongoDB is already connected.
    if (
      mongoose.connection.readyState === 1
    ) {
      console.log(
        "MongoDB is already connected"
      );

      return;
    }

    console.log(
      "Connecting to MongoDB..."
    );

    await mongoose.connect(
      process.env.MONGO_URI,
      {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      }
    );

    console.log(
      `MongoDB Connected Successfully: ${mongoose.connection.host}`
    );
  } catch (error) {
    console.error(
      "MongoDB Connection Failed:"
    );
    console.error(
      error.message
    );

    // Do not keep the server running
    // when the database is unavailable.
    process.exit(1);
  }
};

// ===============================
// MongoDB Events
// ===============================

mongoose.connection.on(
  "connected",
  () => {
    console.log(
      "MongoDB connection established"
    );
  }
);

mongoose.connection.on(
  "error",
  (error) => {
    console.error(
      "MongoDB runtime error:",
      error.message
    );
  }
);

mongoose.connection.on(
  "disconnected",
  () => {
    console.warn(
      "MongoDB disconnected"
    );
  }
);

export default connectDB;
