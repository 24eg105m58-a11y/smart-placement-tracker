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
    },

    companyName: {
      type: String,
      required: true,
    },

    jobRole: {
      type: String,
      required: true,
    },

    package: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    // eligibility details
    minimumCGPA: {
      type: Number,
      required: true,
    },

    eligibleBranches: [
      {
        type: String,
      },
    ],

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