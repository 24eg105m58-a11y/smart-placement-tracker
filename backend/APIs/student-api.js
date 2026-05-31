import exp from "express";
import multer from "multer";
import { AcademicDetailsModel } from "../models/academicDetails-model.js";
import { verifyToken } from "../middlewares/VerifyToken.js";
import { ApplicationModel } from "../models/application-model.js";
import { JobPostingModel } from "../models/jobPostings-model.js";
import { ResumeModel } from "../models/resume-model.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";

export const studentApp = exp.Router();
const resumeUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
};

const formatJobStatus = (job) => {
  if (job.status === "CLOSED") {
    return "Completed";
  }

  const driveDate = new Date(job.driveDate);
  return driveDate.getTime() >= Date.now() ? "Upcoming" : "Ongoing";
};

const toStudentDrive = (job) => ({
  id: job._id,
  driveName: job.jobRole,
  company: job.companyName,
  date: formatDate(job.driveDate),
  package: job.package,
  status: formatJobStatus(job),
  eligibleBranches: Array.isArray(job.eligibleBranches)
    ? job.eligibleBranches.join(", ")
    : job.eligibleBranches || "",
  role: job.jobRole,
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

const toResumePayload = (resume) => ({
  id: resume._id,
  fileName: resume.fileName || "Resume",
  resumeUrl: resume.resumeUrl,
  uploadedOn: formatDate(resume.createdAt),
  atsScore: resume.atsScore || 0,
  extractedSkills: resume.extractedSkills || [],
});

const toStudentJob = ({ job, academic, appliedJobIds }) => {
  const branches = Array.isArray(job.eligibleBranches)
    ? job.eligibleBranches
    : [job.eligibleBranches].filter(Boolean);
  const eligibleByBranch =
    branches.length === 0 || (academic?.branch ? branches.includes(academic.branch) : false);
  const eligibleByCgpa = academic ? academic.cgpa >= Number(job.minimumCGPA || 0) : false;
  const eligible = Boolean(academic) && eligibleByBranch && eligibleByCgpa;
  const alreadyApplied = appliedJobIds.has(String(job._id));

  return {
    id: job._id,
    jobId: job._id,
    driveName: job.jobRole,
    company: job.companyName,
    date: formatDate(job.driveDate),
    lastDateToApply: formatDate(job.lastDateToApply),
    package: job.package,
    status: formatJobStatus(job),
    eligibleBranches: branches.join(", "),
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
  const [academic, jobs, applications] = await Promise.all([
    AcademicDetailsModel.findOne({ studentId }),
    JobPostingModel.find().sort({ driveDate: 1 }),
    ApplicationModel.find({ studentId }).sort({ createdAt: -1 }),
  ]);

  const upcomingDrives = jobs.map(toStudentDrive);
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
    ...applications.slice(0, 2).map((app) => ({
      id: String(app._id),
      title: `Application ${app.applicationStatus.toLowerCase()}`,
      message: `${app.companyName} - ${app.jobRole}`,
      time: formatDate(app.updatedAt || app.createdAt),
      read: app.applicationStatus === "REJECTED",
    })),
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
          job.eligibleBranches.includes(academic.branch);
        return branchMatch && academic.cgpa >= Number(job.minimumCGPA || 0);
      }).length
    : 0;

  const placementStatus =
    applications.some((app) => app.applicationStatus === "SELECTED")
      ? "Placed"
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
    upcomingDrives,
    appliedCompanies,
    interviews,
    placementStatus,
    eligibilityPercentage: Math.round((matchingJobs / totalJobs) * 100),
    profileCompletion,
    notifications,
  };
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
  const [jobs, academic, applications] = await Promise.all([
    JobPostingModel.find({ status: "OPEN" }).sort({
      driveDate: 1,
    }),
    AcademicDetailsModel.findOne({ studentId: req.user.id }),
    ApplicationModel.find({ studentId: req.user.id }),
  ]);

  res.json({
    message: "JOBS:",
    payload: jobs.map((job) =>
      toStudentJob({
        job,
        academic,
        appliedJobIds: new Set(applications.map((app) => String(app.jobId))),
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
