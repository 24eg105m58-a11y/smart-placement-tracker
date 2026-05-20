import { Schema, model } from "mongoose";

const JobPostingSchema = new Schema(
  {
    recruiterId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    jobRole: {
      type: String,
      required: true,
      trim: true,
    },

    package: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    eligibleBranches: [
      {
        type: String,
      },
    ],

    minimumCGPA: {
      type: Number,
      required: true,
    },

    driveDate: {
      type: Date,
      required: true,
    },

    lastDateToApply: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      default: "OPEN",
    },
  },
  {
    timestamps: true,
  }
);

export const JobPostingModel = model(
  "jobpostings",
  JobPostingSchema
);