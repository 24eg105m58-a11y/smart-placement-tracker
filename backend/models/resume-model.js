import { Schema, model } from "mongoose";

const resumeSchema = new Schema({

  studentId: {
    type: Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },

  resumeUrl: {
    type: String,
    required: true,
  },

  atsScore: {
    type: Number,
    default: 0,
  },

  extractedSkills: [String],

}, {
  timestamps: true,
});

export default model("Resume", resumeSchema);