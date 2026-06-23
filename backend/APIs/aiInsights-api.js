import express from "express";
import Groq from "groq-sdk";

import UserModel from "../models/user-model.js";
import { AcademicDetailsModel } from "../models/academicDetails-model.js";
import { ResumeModel } from "../models/resume-model.js";
import { ApplicationModel } from "../models/application-model.js";
import { JobPostingModel } from "../models/jobPostings-model.js";

import { getRecommendedJobs } from "../services/aiRecommendationService.js";

const aiInsightsApp = express.Router();

const groqApiKey =
  process.env.GROQ_API_KEY ||
  process.env.GROK_API_KEY ||
  process.env.XAI_CONSOLE_API_KEY ||
  process.env.XAI_API_KEY;

const groqModel = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
const groqClient = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
};

const buildAiSummary = async ({ student, academicDetails, resume, recommendations }) => {
  const ruleBasedTips = [
    academicDetails?.branch
      ? `Branch: ${academicDetails.branch}`
      : "Branch not updated yet.",
    typeof academicDetails?.cgpa === "number"
      ? `CGPA: ${academicDetails.cgpa}`
      : "CGPA not available.",
    resume ? "Resume uploaded." : "Resume still needs to be uploaded.",
    recommendations.length
      ? `Top recommendation: ${recommendations[0].companyName || recommendations[0].company} - ${recommendations[0].jobRole || recommendations[0].driveName}`
      : "No eligible drives found yet.",
  ];

  if (!groqClient) {
    return {
      summary:
        "I can suggest the best drives based on your academic profile, eligibility, and deadlines. Keep your CGPA, resume, and branch details updated to unlock more opportunities.",
      tips: ruleBasedTips,
    };
  }

  try {
    const response = await groqClient.responses.create({
      model: groqModel,
      input:
        "You are a helpful campus placement coach. Give short, practical placement guidance in simple language.\n\n" +
        JSON.stringify(
          {
            student,
            academicDetails,
            resume,
            recommendations: recommendations.slice(0, 3).map((job) => ({
              company: job.companyName || job.company,
              role: job.jobRole || job.driveName,
              package: job.package,
              lastDateToApply: formatDate(job.lastDateToApply || job.lastDate),
            })),
          },
          null,
          2,
        ) +
        "\n\nWrite a short summary and 3 bullet tips about which drives the student should focus on next.",
    });

    const outputText = response.output_text?.trim();

    if (outputText) {
      return {
        summary: outputText,
        tips: ruleBasedTips,
      };
    }

    const completion = await groqClient.chat.completions.create({
      model: groqModel,
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful campus placement coach. Give short, practical placement guidance in simple language.",
        },
        {
          role: "user",
          content: JSON.stringify(
            {
              student,
              academicDetails,
              resume,
              recommendations: recommendations.slice(0, 3).map((job) => ({
                company: job.companyName || job.company,
                role: job.jobRole || job.driveName,
                package: job.package,
                lastDateToApply: formatDate(job.lastDateToApply || job.lastDate),
              })),
            },
            null,
            2,
          ),
        },
        {
          role: "user",
          content:
            "Write a short summary and 3 bullet tips about which drives the student should focus on next.",
        },
      ],
    });

    return {
      summary:
        completion.choices?.[0]?.message?.content?.trim() || ruleBasedTips[0],
      tips: ruleBasedTips,
    };
  } catch (err) {
    console.log("AI insight generation failed, using fallback:", err?.message || err);
    return {
      summary:
        "I could not reach the AI service right now, so I am showing a rule-based placement summary instead. Update your academic details, resume, and branch info to improve your drive matches.",
      tips: ruleBasedTips,
    };
  }
};

aiInsightsApp.get("/:studentId", async (req, res) => {
  try {
    const student = await UserModel.findById(req.params.studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const [academicDetails, resume, applications, jobs] = await Promise.all([
      AcademicDetailsModel.findOne({ studentId: student._id }),
      ResumeModel.findOne({ studentId: student._id }).sort({ createdAt: -1 }),
      ApplicationModel.find({ studentId: student._id }).sort({ createdAt: -1 }),
      JobPostingModel.find().sort({ driveDate: 1 }),
    ]);

    const recommendations = await getRecommendedJobs({
      academicDetails,
      resume,
    });

    const ai = await buildAiSummary({
      student,
      academicDetails,
      resume,
      recommendations,
    });

    const totalJobs = jobs.length || 1;
    const matchingJobs = academicDetails
      ? jobs.filter((job) => {
          const branches = Array.isArray(job.eligibleBranches)
            ? job.eligibleBranches
            : [job.eligibleBranches].filter(Boolean);

          return (
            branches.length === 0 ||
            branches.includes("ANY") ||
            branches.includes(academicDetails.branch)
          ) && academicDetails.cgpa >= Number(job.minimumCGPA || 0);
        }).length
      : 0;

    const placed = applications.some(
      (app) => app.applicationStatus === "SELECTED",
    );

    return res.status(200).json({
      success: true,
      payload: {
        student: {
          id: student._id,
          name: `${student.firstname || ""} ${student.lastname || ""}`.trim(),
          email: student.email,
          branch: academicDetails?.branch || null,
          cgpa: academicDetails?.cgpa ?? null,
          graduationYear: academicDetails?.graduationYear ?? null,
          noBacklogs: academicDetails?.noBacklogs ?? null,
          resumeUploaded: Boolean(academicDetails?.resume || resume),
          linkedIn: academicDetails?.linkedIn || "",
          github: academicDetails?.github || "",
        },
        stats: {
          eligibilityPercentage: Math.round((matchingJobs / totalJobs) * 100),
          applicationsCount: applications.length,
          placed,
        },
        recommendations: recommendations.slice(0, 5).map((job) => ({
          id: job._id,
          company: job.companyName || job.company,
          companyName: job.companyName || job.company,
          driveName: job.jobRole || job.driveName,
          jobRole: job.jobRole || job.driveName,
          package: job.package,
          lastDateToApply: formatDate(job.lastDateToApply || job.lastDate),
          eligible: job.eligible ?? true,
          alreadyApplied: Boolean(job.alreadyApplied),
          reason: job.reason || "Strong match",
        })),
        insightSummary: ai.summary,
        tips: ai.tips,
        atsScore: resume?.atsScore || 0,
        extractedSkills: resume?.extractedSkills || [],
        cgpa: academicDetails?.cgpa || null,
        branch: academicDetails?.branch || null,
        recommendedJobs: recommendations.slice(0, 5),
      },
    });
  } catch (err) {
    console.error("AI Insights Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default aiInsightsApp;
