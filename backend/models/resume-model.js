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

  resumeText: {
    type: String,
    default: "",
  },

  sourceFileType: {
    type: String,
    default: "pdf",
  },

  profileData: {
    branch: { type: String, default: "" },
    cgpa: { type: Number, default: null },
    graduationYear: { type: Number, default: null },
    linkedIn: { type: String, default: "" },
    github: { type: String, default: "" },
    rollNumber: { type: String, default: "" },
    email: { type: String, default: "" },
  },

}, {
  timestamps: true,
});

export const ResumeModel = model("Resume", resumeSchema);
export default ResumeModel;
