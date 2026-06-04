import exp from "express";
import multer from "multer";
import { AcademicDetailsModel } from "../models/academicDetails-model.js";
import { verifyToken } from "../middlewares/VerifyToken.js";
import { ApplicationModel } from "../models/application-model.js";
import { JobPostingModel } from "../models/jobPostings-model.js";
import { ResumeModel } from "../models/resume-model.js";
import { CompanyDetailsModel } from "../models/companyDetails-model.js";
import UserModel from "../models/user-model.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";
import Groq from "groq-sdk";

export const studentApp = exp.Router();
const resumeUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const groqApiKey =
  process.env.GROQ_API_KEY ||
  process.env.GROK_API_KEY ||
  process.env.XAI_CONSOLE_API_KEY ||
  process.env.XAI_API_KEY;
const groqClient = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
};

const normalizeCompanyKey = (value = "") => value.trim().toUpperCase();

const formatBranchDisplay = (branches = []) => {
  if (branches.length === 0 || branches.includes("ANY")) {
    return "Any Branch";
  }

  return branches.join(", ");
};

const buildCompanyLogoMap = async () => {
  const companies = await CompanyDetailsModel.find({}, "companyName companyLogo");
  return new Map(
    companies.map((company) => [
      normalizeCompanyKey(company.companyName),
      company.companyLogo || "",
    ]),
  );
};

const formatJobStatus = (job) => {
  if (job.status === "CLOSED") {
    return "Completed";
  }

  const driveDate = new Date(job.driveDate);
  return driveDate.getTime() >= Date.now() ? "Upcoming" : "Ongoing";
};

const toStudentDrive = (job, companyLogo = "", applied = false) => ({
  id: job._id,
  driveName: job.jobRole,
  company: job.companyName,
  companyLogo,
  date: formatDate(job.driveDate),
  package: job.package,
  status: formatJobStatus(job),
  eligibleBranches: Array.isArray(job.eligibleBranches)
    ? formatBranchDisplay(job.eligibleBranches)
    : job.eligibleBranches || "",
  role: job.jobRole,
  applied,
});

const toStudentApplication = (app) => ({
  id: app._id,
  jobId: app.jobId,
  company: app.companyName,
  role: app.jobRole,
  driveName: app.jobRole,
  appliedOn: formatDate(app.createdAt),
  status: app.applicationStatus,
});

const toNotification = (app) => {
  const status = app.applicationStatus || "APPLIED";

  if (status === "SELECTED") {
    return {
      id: String(app._id),
      title: "You have been selected",
      message: `${app.companyName} selected you for ${app.jobRole}.`,
      time: formatDate(app.updatedAt || app.createdAt),
      read: false,
    };
  }

  if (status === "REJECTED") {
    return {
      id: String(app._id),
      title: "Interview result updated",
      message: `${app.companyName} did not shortlist you for ${app.jobRole}.`,
      time: formatDate(app.updatedAt || app.createdAt),
      read: true,
    };
  }

  if (status === "HOLD") {
    return {
      id: String(app._id),
      title: "Application on hold",
      message: `${app.companyName} kept your application on hold for ${app.jobRole}.`,
      time: formatDate(app.updatedAt || app.createdAt),
      read: false,
    };
  }

  if (status === "SHORTLISTED") {
    return {
      id: String(app._id),
      title: "You were shortlisted",
      message: `${app.companyName} shortlisted you for ${app.jobRole}.`,
      time: formatDate(app.updatedAt || app.createdAt),
      read: false,
    };
  }

  return {
    id: String(app._id),
    title: "Application received",
    message: `${app.companyName} received your application for ${app.jobRole}.`,
    time: formatDate(app.updatedAt || app.createdAt),
    read: false,
  };
};

const toResumePayload = (resume) => ({
  id: resume._id,
  fileName: resume.fileName || "Resume",
  resumeUrl: resume.resumeUrl,
  uploadedOn: formatDate(resume.createdAt),
  atsScore: resume.atsScore || 0,
  extractedSkills: resume.extractedSkills || [],
});

const isAnyBranchJob = (branches) =>
  branches.length === 0 || branches.includes("ANY");

const toStudentJob = ({ job, academic, appliedJobIds, companyLogo = "" }) => {
  const branches = Array.isArray(job.eligibleBranches)
    ? job.eligibleBranches
    : [job.eligibleBranches].filter(Boolean);
  const eligibleByBranch =
    isAnyBranchJob(branches) ||
    (academic?.branch ? branches.includes(academic.branch) : false);
  const eligibleByCgpa = academic ? academic.cgpa >= Number(job.minimumCGPA || 0) : false;
  const eligible = Boolean(academic) && eligibleByBranch && eligibleByCgpa;
  const alreadyApplied = appliedJobIds.has(String(job._id));

  return {
    id: job._id,
    jobId: job._id,
    driveName: job.jobRole,
    company: job.companyName,
    companyLogo,
    date: formatDate(job.driveDate),
    lastDateToApply: formatDate(job.lastDateToApply),
    package: job.package,
    status: formatJobStatus(job),
    eligibleBranches: formatBranchDisplay(branches),
    role: job.jobRole,
    location: job.location || "",
    minimumCGPA: job.minimumCGPA,
    description: job.description || "",
    eligible,
    alreadyApplied,
    eligibilityNote: !academic
      ? "Complete academic details to check eligibility"
      : alreadyApplied
        ? "Already applied"
        : eligible
          ? "You are eligible"
          : !eligibleByBranch
            ? "Branch not eligible"
            : "CGPA below requirement",
  };
};

const buildStudentDashboard = async (studentId) => {
  const [academic, jobs, applications, companyLogoMap] = await Promise.all([
    AcademicDetailsModel.findOne({ studentId }),
    JobPostingModel.find().sort({ driveDate: 1 }),
    ApplicationModel.find({ studentId }).sort({ createdAt: -1 }),
    buildCompanyLogoMap(),
  ]);

  const appliedCompanies = applications.map((app) => ({
    company: app.companyName,
    role: app.jobRole,
    status: app.applicationStatus,
    appliedOn: formatDate(app.createdAt),
  }));

  const interviews = applications
    .filter((app) => ["SHORTLISTED", "SELECTED"].includes(app.applicationStatus))
    .slice(0, 4)
    .map((app) => ({
      company: app.companyName,
      round: app.currentRound || "Interview",
      date: formatDate(app.driveDate),
      time: "10:00 AM",
      status: "Scheduled",
    }));

  const notifications = [
    ...applications.map(toNotification),
    ...jobs.slice(0, 2).map((job) => ({
      id: String(job._id),
      title: "New drive posted",
      message: `${job.companyName} opened ${job.jobRole}`,
      time: formatDate(job.createdAt),
      read: false,
    })),
  ].slice(0, 4);

  const totalJobs = jobs.length || 1;
  const matchingJobs = academic
    ? jobs.filter((job) => {
        const branchMatch =
          !job.eligibleBranches?.length ||
          job.eligibleBranches.includes("ANY") ||
          job.eligibleBranches.includes(academic.branch);
        return branchMatch && academic.cgpa >= Number(job.minimumCGPA || 0);
      }).length
    : 0;

  const placementStatus =
    applications.some((app) => app.applicationStatus === "SELECTED")
      ? "Placed"
      : applications.some((app) => app.applicationStatus === "HOLD")
        ? "On Hold"
        : applications.length > 0
          ? "In Process"
          : "Not Started";

  const profileCompletion = academic
    ? Math.min(
        100,
        [
          academic.rollNumber,
          academic.branch,
          academic.cgpa,
          academic.graduationYear,
          academic.linkedIn,
          academic.github,
          academic.resume,
        ].filter(Boolean).length * 15,
      )
    : 0;

  return {
    upcomingDrives: jobs.map((job) =>
      toStudentDrive(
        job,
        companyLogoMap.get(normalizeCompanyKey(job.companyName)) || "",
        applications.some((app) => String(app.jobId) === String(job._id)),
      ),
    ),
    appliedCompanies,
    interviews,
    placementStatus,
    eligibilityPercentage: Math.round((matchingJobs / totalJobs) * 100),
    profileCompletion,
    notifications,
  };
};

const buildStudentAiContext = async (studentId) => {
  const [academic, jobs, applications, companyLogoMap, user] = await Promise.all([
    AcademicDetailsModel.findOne({ studentId }),
    JobPostingModel.find().sort({ driveDate: 1 }),
    ApplicationModel.find({ studentId }).sort({ createdAt: -1 }),
    buildCompanyLogoMap(),
    UserModel.findById(studentId).select("firstname lastname"),
  ]);

  const appliedJobIds = new Set(applications.map((app) => String(app.jobId)));

  const recommendations = jobs
    .map((job) => {
      const branches = Array.isArray(job.eligibleBranches)
        ? job.eligibleBranches
        : [job.eligibleBranches].filter(Boolean);
      const eligibleByBranch =
        isAnyBranchJob(branches) ||
        (academic?.branch ? branches.includes(academic.branch) : false);
      const eligibleByCgpa = academic ? academic.cgpa >= Number(job.minimumCGPA || 0) : false;
      const eligible = Boolean(academic) && eligibleByBranch && eligibleByCgpa;
      const alreadyApplied = appliedJobIds.has(String(job._id));
      const referenceDate = new Date(job.lastDateToApply || job.driveDate);
      const daysLeft = Number.isNaN(referenceDate.getTime())
        ? Number.POSITIVE_INFINITY
        : Math.ceil((referenceDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));

      let score = 0;
      if (eligible) score += 50;
      if (alreadyApplied) score -= 100;
      if (eligibleByBranch) score += 15;
      if (eligibleByCgpa) score += 15;
      if (daysLeft >= 0 && daysLeft <= 2) score += 10;

      return {
        id: job._id,
        driveName: job.jobRole,
        company: job.companyName,
        companyLogo: companyLogoMap.get(normalizeCompanyKey(job.companyName)) || "",
        package: job.package,
        date: formatDate(job.driveDate),
        lastDateToApply: formatDate(job.lastDateToApply),
        eligible,
        alreadyApplied,
        score,
        reason: !academic
          ? "Complete academic details first"
          : alreadyApplied
            ? "Already applied"
            : !eligibleByBranch
              ? "Branch mismatch"
              : !eligibleByCgpa
                ? "CGPA below requirement"
                : daysLeft <= 2
                  ? "Deadline is close"
                  : "Good fit",
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return {
    student: {
      name: user ? `${user.firstname || ""} ${user.lastname || ""}`.trim() : "",
      branch: academic?.branch || "",
      cgpa: academic?.cgpa ?? null,
      graduationYear: academic?.graduationYear ?? null,
      noBacklogs: academic?.noBacklogs ?? null,
      resumeUploaded: Boolean(academic?.resume),
      linkedIn: academic?.linkedIn || "",
      github: academic?.github || "",
    },
    stats: {
      eligibilityPercentage: jobs.length
        ? Math.round(
            (jobs.filter((job) => {
              const branches = Array.isArray(job.eligibleBranches)
                ? job.eligibleBranches
                : [job.eligibleBranches].filter(Boolean);
              return (
                Boolean(academic) &&
                (isAnyBranchJob(branches) ||
                  (academic.branch ? branches.includes(academic.branch) : false)) &&
                academic.cgpa >= Number(job.minimumCGPA || 0)
              );
            }).length / jobs.length) * 100,
          )
        : 0,
      applicationsCount: applications.length,
      placed: applications.some((app) => app.applicationStatus === "SELECTED"),
    },
    recommendations,
    jobs,
    applications,
  };
};

const generateAiInsightText = async (context) => {
  const ruleBased = [
    context.student.branch ? `Branch: ${context.student.branch}` : "Branch not updated yet.",
    typeof context.student.cgpa === "number" ? `CGPA: ${context.student.cgpa}` : "CGPA not available.",
    context.student.resumeUploaded ? "Resume uploaded." : "Resume still needs to be uploaded.",
    context.recommendations.length
      ? `Top recommendation: ${context.recommendations[0].company} - ${context.recommendations[0].driveName}`
      : "No eligible drives found yet.",
  ];

  if (!groqClient) {
    return {
      summary:
        "I can suggest the best drives based on your academic profile, eligibility, and deadlines. Keep your CGPA, resume, and branch details updated to unlock more opportunities.",
      tips: ruleBased,
    };
  }

  try {
    const response = await groqClient.chat.completions.create({
      model: "llama-3.1-8b-instant",
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
              student: context.student,
              stats: context.stats,
              recommendations: context.recommendations.slice(0, 3),
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
      summary: response.choices?.[0]?.message?.content?.trim() || ruleBased[0],
      tips: ruleBased,
    };
  } catch (err) {
    console.log("AI insight generation failed, using fallback:", err?.message || err);
    return {
      summary:
        "I could not reach the AI service right now, so I’m showing a rule-based placement summary instead. Update your academic details, resume, and branch info to improve your drive matches.",
      tips: ruleBased,
    };
  }
};

// post academic details
studentApp.post(
  "/add-academicDetails",
  verifyToken("STUDENT"),
  async (req, res) => {
    try {
      const studentId = req.user.id;
      const payload = {
        ...req.body,
        studentId,
        cgpa: Number(req.body.cgpa),
        graduationYear: Number(req.body.graduationYear),
        noBacklogs:
          req.body.noBacklogs === true ||
          req.body.noBacklogs === "true" ||
          req.body.noBacklogs === 1 ||
          req.body.noBacklogs === "1",
      };

      const academicDetails = await AcademicDetailsModel.findOneAndUpdate(
        { studentId },
        payload,
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        },
      );

      res.json({
        message: "Academic Details Added",
        payload: academicDetails,
      });
    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
    }
  },
);

// get academic details
studentApp.get(
  "/get-academicDetails",
  verifyToken("STUDENT"),
  async (req, res) => {
    try {
      const academicDetails = await AcademicDetailsModel.findOne({
        studentId: req.user.id,
      });

      res.json({
        message: "Academic details fetched",
        payload: academicDetails,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
);

studentApp.get(
  "/resume",
  verifyToken("STUDENT"),
  async (req, res) => {
    try {
      const resume = await ResumeModel.findOne({ studentId: req.user.id }).sort({
        createdAt: -1,
      });

      res.json({
        success: true,
        payload: resume ? toResumePayload(resume) : null,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
);

studentApp.put(
  "/update-academicDetails",
  verifyToken("STUDENT"),
  async (req, res) => {
    try {
      const studentId = req.user.id;
      const payload = {
        ...req.body,
        studentId,
        cgpa:
          req.body.cgpa === undefined
            ? undefined
            : Number(req.body.cgpa),
        graduationYear:
          req.body.graduationYear === undefined
            ? undefined
            : Number(req.body.graduationYear),
      };

      const academicDetails = await AcademicDetailsModel.findOneAndUpdate(
        { studentId },
        payload,
        {
          new: true,
          upsert: true,
          runValidators: true,
        },
      );

      res.json({
        message: "Academic details updated",
        payload: academicDetails,
      });
    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
    }
  },
);

studentApp.post(
  "/resume",
  verifyToken("STUDENT"),
  resumeUpload.single("resume"),
  async (req, res) => {
    let uploadResult;
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a resume file",
        });
      }

      const existingResume = await ResumeModel.findOne({ studentId: req.user.id });

      uploadResult = await uploadToCloudinary(req.file.buffer, {
        folder: "student_resumes",
        resourceType: "raw",
      });

      const resumeDoc = await ResumeModel.findOneAndUpdate(
        { studentId: req.user.id },
        {
          studentId: req.user.id,
          resumeUrl: uploadResult.secure_url,
          cloudinaryPublicId: uploadResult.public_id,
          fileName: req.file.originalname,
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
        },
      );

      await AcademicDetailsModel.findOneAndUpdate(
        { studentId: req.user.id },
        { resume: uploadResult.secure_url },
        { new: true },
      );

      if (existingResume?.cloudinaryPublicId && existingResume.cloudinaryPublicId !== uploadResult.public_id) {
        await cloudinary.uploader.destroy(existingResume.cloudinaryPublicId, {
          resource_type: "raw",
        });
      }

      res.json({
        success: true,
        message: "Resume uploaded successfully",
        payload: toResumePayload(resumeDoc),
      });
    } catch (err) {
      if (uploadResult?.public_id) {
        await cloudinary.uploader.destroy(uploadResult.public_id, {
          resource_type: "raw",
        });
      }

      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
);

studentApp.delete(
  "/resume/:resumeId",
  verifyToken("STUDENT"),
  async (req, res) => {
    try {
      const resume = await ResumeModel.findOne({
        _id: req.params.resumeId,
        studentId: req.user.id,
      });

      if (!resume) {
        return res.status(404).json({
          success: false,
          message: "Resume not found",
        });
      }

      if (resume.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(resume.cloudinaryPublicId, {
          resource_type: "raw",
        });
      }

      await ResumeModel.findByIdAndDelete(resume._id);
      await AcademicDetailsModel.findOneAndUpdate(
        { studentId: req.user.id },
        { resume: "" },
      );

      res.json({
        success: true,
        message: "Resume removed successfully",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
);

// get-jobs
studentApp.get("/get-jobs", verifyToken("STUDENT"), async (req, res) => {
  const [jobs, academic, applications, companyLogoMap] = await Promise.all([
    JobPostingModel.find({ status: "OPEN" }).sort({
      driveDate: 1,
    }),
    AcademicDetailsModel.findOne({ studentId: req.user.id }),
    ApplicationModel.find({ studentId: req.user.id }),
    buildCompanyLogoMap(),
  ]);

  res.json({
    message: "JOBS:",
    payload: jobs.map((job) =>
      toStudentJob({
        job,
        academic,
        appliedJobIds: new Set(applications.map((app) => String(app.jobId))),
        companyLogo: companyLogoMap.get(normalizeCompanyKey(job.companyName)) || "",
      }),
    ),
  });
});

// job-application
studentApp.post(
  "/job-application",
  verifyToken("STUDENT"),
  async (req, res) => {
    try {
      const { jobId } = req.body;
      const studentId = req.user.id;

      const [job, academic] = await Promise.all([
        JobPostingModel.findById(jobId),
        AcademicDetailsModel.findOne({ studentId }),
      ]);

      if (!job) {
        return res.status(404).json({
          message: "Job not found",
        });
      }

      if (!academic) {
        return res.status(400).json({
          message: "Please complete your academic details first",
        });
      }

      if (academic.cgpa < job.minimumCGPA) {
        return res.status(400).json({
          message: "Not Enough CGPA",
          requiredCGPA: job.minimumCGPA,
        });
      }

      const branchAllowed =
        !job.eligibleBranches?.length ||
        job.eligibleBranches.includes("ANY") ||
        job.eligibleBranches.includes(academic.branch);

      if (!branchAllowed) {
        return res.status(400).json({
          message: "Branch is not eligible for this drive",
        });
      }

      const alreadyApplied = await ApplicationModel.findOne({
        studentId,
        jobId: job._id,
      });

      if (alreadyApplied) {
        return res.status(409).json({
          message: "Already Applied",
        });
      }

      const jobApplicationDoc = new ApplicationModel({
        studentId,
        jobId: job._id,
        companyName: job.companyName,
        jobRole: job.jobRole,
        studentName: `${req.user.firstname || ""} ${req.user.lastname || ""}`.trim(),
        package: job.package,
        CGPA: academic.cgpa,
        eligibleBranches: academic.branch,
        driveDate: job.driveDate,
        applicationStatus: "APPLIED",
        currentRound: "Application Submitted",
      });

      await jobApplicationDoc.save();

      res.json({
        message: "Job Applied Successfully",
        payload: jobApplicationDoc,
      });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({
          message: "Already Applied",
        });
      }

      res.status(500).json({
        message: "Error applying job",
        error: err.message,
      });
    }
  },
);

//get-applications
studentApp.get(
  "/get-applications",
  verifyToken("STUDENT"),
  async (req, res) => {
    const applications = await ApplicationModel.find({
      studentId: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.json({
      payload: applications.map(toStudentApplication),
    });
  },
);

studentApp.get(
  "/dashboard",
  verifyToken("STUDENT"),
  async (req, res) => {
    try {
      const dashboard = await buildStudentDashboard(req.user.id);

      res.json({
        success: true,
        payload: dashboard,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
);

studentApp.get(
  "/notifications",
  verifyToken("STUDENT"),
  async (req, res) => {
    try {
      const dashboard = await buildStudentDashboard(req.user.id);

      res.json({
        success: true,
        payload: dashboard.notifications,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
);

studentApp.get(
  "/interviews",
  verifyToken("STUDENT"),
  async (req, res) => {
    try {
      const dashboard = await buildStudentDashboard(req.user.id);

      res.json({
        success: true,
        payload: dashboard.interviews,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
);

studentApp.get(
  "/ai-insights",
  verifyToken("STUDENT"),
  async (req, res) => {
    try {
      const context = await buildStudentAiContext(req.user.id);
      const ai = await generateAiInsightText(context);

      res.json({
        success: true,
        payload: {
          ...context,
          insightSummary: ai.summary,
          tips: ai.tips,
        },
      });
    } catch (err) {
      console.log("AI insights route failed:", err?.message || err);
      try {
        const context = await buildStudentAiContext(req.user.id);
        res.json({
          success: true,
          payload: {
            ...context,
            insightSummary:
              "I could not load live AI results right now, but your placement data is available. Keep improving your profile to raise your matches.",
            tips: [
              context.student.branch ? `Branch: ${context.student.branch}` : "Branch not updated yet.",
              typeof context.student.cgpa === "number" ? `CGPA: ${context.student.cgpa}` : "CGPA not available.",
              context.student.resumeUploaded ? "Resume uploaded." : "Resume still needs to be uploaded.",
            ],
          },
        });
      } catch (fallbackErr) {
        res.status(500).json({
          success: false,
          message: fallbackErr.message,
        });
      }
    }
  },
);

studentApp.post(
  "/ai-chat",
  verifyToken("STUDENT"),
  async (req, res) => {
    try {
      const { message = "", history = [] } = req.body || {};
      const context = await buildStudentAiContext(req.user.id);

      if (!groqClient) {
        const lower = String(message).toLowerCase();
        const topRecommendation = context.recommendations[0];
        const reply = lower.includes("apply")
          ? `Focus on ${topRecommendation?.company || "the next eligible drive"} first. ${topRecommendation?.reason || "It looks like a good fit."}`
          : lower.includes("resume")
            ? "Keep your resume updated and make sure it reflects projects, achievements, and keywords from the drive description."
            : `Your strongest next step is ${topRecommendation ? `${topRecommendation.company} - ${topRecommendation.driveName}` : "updating your academic profile"}.`;

        return res.json({
          success: true,
          payload: {
            reply,
          },
        });
      }

      const completion = await groqClient.chat.completions.create({
        model: "llama-3.1-8b-instant",
        temperature: 0.5,
        messages: [
          {
            role: "system",
            content:
              "You are a campus placement assistant for students. Answer concisely, practically, and kindly. Use the student's eligibility, CGPA, branch, resume status, and drive list to guide them.",
          },
          ...history.slice(-8).map((entry) => ({
            role: entry.role === "assistant" ? "assistant" : "user",
            content: String(entry.content || ""),
          })),
          {
            role: "user",
            content: JSON.stringify(
              {
                message,
                student: context.student,
                stats: context.stats,
                topRecommendations: context.recommendations.slice(0, 3),
              },
              null,
              2,
            ),
          },
        ],
      });

      res.json({
        success: true,
        payload: {
          reply:
            completion.choices?.[0]?.message?.content?.trim() ||
            "I could not generate a response right now.",
        },
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
);

// withdraw application
studentApp.delete(
  "/withdraw-application/:applicationId",
  verifyToken("STUDENT"),
  async (req, res) => {
    try {
      const { applicationId } = req.params;

      const deletedApplication = await ApplicationModel.findOneAndDelete({
        _id: applicationId,
        studentId: req.user.id,
      });

      if (!deletedApplication) {
        return res.status(404).json({
          message: "Application not found",
        });
      }

      res.json({
        success: true,
        message: "Application Withdrawn Successfully",
      });
    } catch (err) {
      res.status(500).json({
        message: "Error withdrawing application",
        error: err.message,
      });
    }
  },
);
