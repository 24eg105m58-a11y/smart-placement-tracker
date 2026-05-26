// models/application-model.js

import { Schema, model } from "mongoose";

const ApplicationSchema = new Schema(
  {
    // student details
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    // job details
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "jobpostings",
      required: true,
      unique: [true, "Already Applied"]
    },

    companyName: {
      type: String,
      required: true,
    },

    jobRole: {
      type: String,
      required: true,
    },


    // eligibility details
    CGPA: {
      type: Number,
      required: true,
    },

    eligibleBranches: {
      type: String,
      reuired: [true, "Branch is required"]
    },
    driveDate: {
      type: Date,
      required: true,
    },

    // application tracking
    applicationStatus: {
      type: String,
      enum: [
        "APPLIED",
        "SHORTLISTED",
        "REJECTED",
        "SELECTED",
      ],
      default: "APPLIED",
    },

    currentRound: {
      type: String,
      default: "Application Submitted",
    },
  },
  {
    timestamps: true,
  }
);

export const ApplicationModel = model(
  "applications",
  ApplicationSchema
);