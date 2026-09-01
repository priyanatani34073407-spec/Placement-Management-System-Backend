import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      minlength: [2, "Company name must contain at least 2 characters"],
      maxlength: [150, "Company name cannot exceed 150 characters"],
    },

    location: {
      type: String,
      required: [true, "Company location is required"],
      trim: true,
      maxlength: [150, "Location cannot exceed 150 characters"],
    },

    hrName: {
      type: String,
      required: [true, "HR name is required"],
      trim: true,
      minlength: [2, "HR name must contain at least 2 characters"],
      maxlength: [100, "HR name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Company email is required"],
      lowercase: true,
      trim: true,
      maxlength: [150, "Email cannot exceed 150 characters"],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid company email address",
      ],
    },

    phone: {
      type: String,
      required: [true, "Company phone number is required"],
      trim: true,
      match: [
        /^\d{10}$/,
        "Phone number must contain exactly 10 digits",
      ],
    },

    package: {
      type: String,
      required: [true, "Package is required"],
      trim: true,
      maxlength: [50, "Package cannot exceed 50 characters"],
    },

    jobRole: {
      type: String,
      required: [true, "Job role is required"],
      trim: true,
      maxlength: [150, "Job role cannot exceed 150 characters"],
    },

    eligibility: {
      type: String,
      required: [true, "Eligibility criteria is required"],
      trim: true,
      maxlength: [500, "Eligibility cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Automatically remove __v from API responses.
companySchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

// Helpful indexes.
companySchema.index({
  companyName: 1,
});

companySchema.index({
  location: 1,
});

companySchema.index({
  jobRole: 1,
});

const Company = mongoose.model(
  "Company",
  companySchema
);

export default Company;
