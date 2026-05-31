import { Schema, model } from "mongoose";

const academicDetailsSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },

    rollNumber: {
      type: String,
      required: [true, "Roll Number is required for student"],
      unique: true,
      uppercase: true,
      trim: true,
    },

    branch: {
      type: String,
      required: [true, "Branch is required for student"],
      uppercase: true,
      trim: true,
    },

    cgpa: {
      type: Number,
      required: [true, "CGPA is required"],
      min: 0,
      max: 10,
    },

    graduationYear: {
      type: Number,
      required: [true, "Graduation Year is required"],
    },
    noBacklogs: {
      type: Boolean,
      default: true
    },
    linkedIn: {
      type: String,
      trim: true,
    },

    github: {
      type: String,
      trim: true,
    },

    resume: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const AcademicDetailsModel = model(
  "AcademicDetails",
  academicDetailsSchema
);
