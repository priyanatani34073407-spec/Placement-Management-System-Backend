import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
      minlength: [2, "Student name must contain at least 2 characters"],
      maxlength: [100, "Student name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Student email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [150, "Email cannot exceed 150 characters"],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [
        /^\d{10}$/,
        "Phone number must contain exactly 10 digits",
      ],
    },

    branch: {
      type: String,
      required: [true, "Branch is required"],
      enum: {
        values: ["CSE", "CSM", "CSE-AI", "CIVIL", "DS"],
        message: "Invalid branch",
      },
      trim: true,
    },

    cgpa: {
      type: Number,
      required: [true, "CGPA is required"],
      min: [0, "CGPA cannot be less than 0"],
      max: [10, "CGPA cannot be greater than 10"],
    },
  },
  {
    timestamps: true,
  }
);

// Automatically remove __v from JSON responses.
studentSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

// Helpful indexes for search and sorting.
studentSchema.index({
  studentName: 1,
});

studentSchema.index({
  branch: 1,
});

studentSchema.index({
  cgpa: -1,
});

const Student = mongoose.model(
  "Student",
  studentSchema
);

export default Student;
