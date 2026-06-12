// models/application-model.js

import { Schema, model } from "mongoose";

const ApplicationSchema = new Schema(
  {
    // student details
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "user",
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

    studentName: {
      type: String,
      default: "",
    },

    package: {
      type: String,
      default: "",
    },


    // eligibility details
    CGPA: {
      type: Number,
      required: true,
    },

    eligibleBranches: {
      type: String,
      required: [true, "Branch is required"],
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
        "HOLD",
        "REJECTED",
        "SELECTED",
      ],
      default: "APPLIED",
    },

    currentRound: {
      type: String,
      default: "Application Submitted",
    },

    interviewDate: {
      type: Date,
      default: null,
    },

    interviewTime: {
      type: String,
      default: "",
    },

    interviewMode: {
      type: String,
      default: "",
    },
    recommendedByAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

ApplicationSchema.index({ studentId: 1, jobId: 1 }, { unique: true });

export const ApplicationModel = model(
  "applications",
  ApplicationSchema
);
