import { Schema, model } from "mongoose";

const resumeSchema = new Schema({

  studentId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  resumeUrl: {
    type: String,
    required: true,
  },

  cloudinaryPublicId: {
    type: String,
    default: "",
  },

  fileName: {
    type: String,
    default: "Resume",
  },

  atsScore: {
    type: Number,
    default: 0,
  },

  extractedSkills: [String],

}, {
  timestamps: true,
});

export const ResumeModel = model("Resume", resumeSchema);
export default ResumeModel;
