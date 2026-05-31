import { Schema, model } from "mongoose";

const JobPostingSchema = new Schema(
  {
    job_id: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    recruiterId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true
    },

    companyName: {
      type: String,
      required: true
    },

    jobRole: {
      type: String,
      required: true
    },

    description: {
      type: String,
      default: "",
      trim: true
    },

    package: {
      type: String,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    eligibleBranches: [String],

    minimumCGPA: {
      type: Number,
      required: true
    },

    driveDate: {
      type: Date,
      required: true
    },

    lastDateToApply: {
      type: Date,
      required: true
    },

    status: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      default: "OPEN"
    }

  },
  {
    timestamps: true
  }
);

export const JobPostingModel =
  model(
    "jobpostings",
    JobPostingSchema
  );
