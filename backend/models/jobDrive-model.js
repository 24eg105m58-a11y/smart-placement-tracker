// models/jobDrive-model.js

import mongoose from "mongoose";

const jobDriveSchema = new mongoose.Schema(
  {
    driveName: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    driveDate: {
      type: Date,
      required: true,
    },

    eligibleBranches: {
      type: [String],
      required: true,
      default: [],
    },

    status: {
      type: String,
      enum: [
        "Upcoming",
        "Registration Open",
        "Ongoing",
        "Completed",
        "Cancelled",
      ],
      default: "Upcoming",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const JobDrive = mongoose.model("JobDrive", jobDriveSchema);

export default JobDrive;