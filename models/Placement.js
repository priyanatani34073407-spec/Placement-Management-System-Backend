import mongoose from "mongoose";

const placementSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student is required"],
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
    },

    package: {
      type: String,
      required: [true, "Package is required"],
      trim: true,
      maxlength: [
        50,
        "Package cannot exceed 50 characters",
      ],
    },

    status: {
      type: String,
      enum: {
        values: [
          "Applied",
          "Shortlisted",
          "Selected",
          "Rejected",
        ],
        message: "Invalid placement status",
      },
      default: "Applied",
    },

    appliedDate: {
      type: Date,
      default: Date.now,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [
        1000,
        "Notes cannot exceed 1000 characters",
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same student from being
// registered for the same company twice.
placementSchema.index(
  {
    student: 1,
    company: 1,
  },
  {
    unique: true,
  }
);

// Useful indexes for filtering reports.
placementSchema.index({
  status: 1,
});

placementSchema.index({
  appliedDate: -1,
});

// Remove __v from API responses.
placementSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Placement = mongoose.model(
  "Placement",
  placementSchema
);

export default Placement;
