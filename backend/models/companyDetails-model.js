import { Schema, model } from "mongoose";

const CompanyDetailsSchema = new Schema(
  {
    companyName: {
      type: String,
      required: [true, "Company name is required."],
      trim: true,
      uppercase: true,
    },

    companyEmail: {
      type: String,
      required: [true, "Official company email address is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },

    companyWebsite: {
      type: String,
      required: [true, "Official company website URL is required."],
      trim: true,
    },

    companyLocation: {
      type: String,
      required: [true, "Company location is required."],
      trim: true,
    },

    companyType: {
      type: String,
      required: [true, "Please specify the company type."],

      enum: {
        values: [
          "Product Based",
          "Service Based",
          "Startup",
          "MNC",
          "Government",
        ],

        message: "Please select a valid company type.",
      },
    },

    companyDescription: {
      type: String,
      required: [true, "Company description is required."],
      trim: true,
      minlength: [20, "Company description must contain at least 20 characters."],
    },

    hrName: {
      type: String,
      required: [true, "HR representative name is required."],
      trim: true,
    },

    hrPhone: {
      type: String,
      required: [true, "HR contact number is required."],
      trim: true,
    },

    hrLinkedIn: {
      type: String,
      trim: true,
      default: "",
    },

    companyLogo: {
      type: String,
      default: "",
    },

    recruiterId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Recruiter reference is required."],
      unique: true,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

export const CompanyDetailsModel = model(
  "CompanyDetails",
  CompanyDetailsSchema
);