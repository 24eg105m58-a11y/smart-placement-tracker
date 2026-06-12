import express from "express";

import User from "../models/user-model.js";
import { AcademicDetailsModel } from "../models/academicDetails-model.js";
import Resume from "../models/resume-model.js";

import { getRecommendedJobs }
  from "../services/aiRecommendationService.js";

const aiInsightsApp = express.Router();

aiInsightsApp.get(
  "/:studentId",
  async (req, res) => {
    try {

      const student = await User.findById(
        req.params.studentId
      );

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }

      const academicDetails =
        await AcademicDetails.findOne({
          user: student._id,
        });

      const resume =
        await Resume.findOne({
          student: student._id,
        });

      const recommendations =
        await getRecommendedJobs({
          student,
          academicDetails,
          resume,
        });

      return res.status(200).json({
        success: true,

        student: {
          id: student._id,
          name: `${student.firstname || ""} ${student.lastname || ""}`,
          email: student.email,
        },

        atsScore:
          resume?.atsScore || 0,

        extractedSkills:
          resume?.extractedSkills || [],

        cgpa:
          academicDetails?.cgpa || null,

        branch:
          academicDetails?.branch || null,

        recommendedJobs:
          recommendations.slice(0, 5),
      });

    } catch (err) {

      console.error(
        "AI Insights Error:",
        err
      );

      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

export default aiInsightsApp;