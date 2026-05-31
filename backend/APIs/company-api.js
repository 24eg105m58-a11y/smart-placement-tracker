import exp from "express";
import { CompanyDetailsModel } from "../models/companyDetails-model.js";
import { verifyToken } from "../middlewares/VerifyToken.js";
import { JobPostingModel } from "../models/jobPostings-model.js";
import { ApplicationModel } from "../models/application-model.js";
import { upload } from "../config/multer.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";

export const companyApp = exp.Router();

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
};

const toDateValue = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getModificationDeadline = (job) => {
  const dates = [toDateValue(job.lastDateToApply), toDateValue(job.driveDate)].filter(Boolean);
  if (dates.length === 0) {
    return null;
  }

  return new Date(Math.min(...dates.map((date) => date.getTime())));
};

const isJobLocked = (job) => {
  const deadline = getModificationDeadline(job);
  return deadline ? Date.now() > deadline.getTime() : false;
};

const toDriveRow = (job, applicantCount = 0) => ({
  id: job._id,
  jobId: job._id,
  driveName: job.jobRole,
  company: job.companyName,
  date: formatDate(job.driveDate),
  lastDateToApply: formatDate(job.lastDateToApply),
  eligibleBranches: Array.isArray(job.eligibleBranches)
    ? job.eligibleBranches.join(", ")
    : job.eligibleBranches || "",
  status: job.status === "OPEN" ? "Upcoming" : "Completed",
  package: job.package,
  role: job.jobRole,
  description: job.description || "",
  location: job.location || "",
  minimumCGPA: job.minimumCGPA,
  applicantCount,
  locked: isJobLocked(job),
});

const toCompanyRow = (company) => ({
  id: company._id,
  name: company.companyName,
  industry: company.companyType,
  contactPerson: company.hrName,
  email: company.companyEmail,
  phone: company.hrPhone,
  logo: company.companyLogo || "",
});

const toApplicantRow = (app) => ({
  id: app._id,
  studentId: app.studentId?._id || app.studentId,
  name:
    app.studentName ||
    `${app.studentId?.firstname || ""} ${app.studentId?.lastname || ""}`.trim() ||
    "Student",
  drive: app.jobRole,
  cgpa: app.CGPA,
  branch: app.eligibleBranches,
  status: app.applicationStatus,
  appliedOn: formatDate(app.createdAt),
  email: app.studentId?.email || "",
  rollNumber: app.studentRollNumber || "",
});

const toInterviewRow = (app) => ({
  id: app._id,
  applicationId: app._id,
  candidate: app.studentName || `${app.studentId?.firstname || ""} ${app.studentId?.lastname || ""}`.trim() || "Student",
  email: app.studentId?.email || "",
  drive: app.jobRole,
  round: app.currentRound || "Interview",
  date: formatDate(app.interviewDate || app.driveDate),
  time: app.interviewTime || "10:00 AM",
  mode: app.interviewMode || "Offline",
  status:
    app.interviewDate || ["SHORTLISTED", "SELECTED"].includes(app.applicationStatus)
      ? "Scheduled"
      : "Pending",
});

const buildRecruiterDashboard = async (recruiterId) => {
  const company = await CompanyDetailsModel.findOne({ recruiterId });
  const companyName = company?.companyName || "";

  const [jobs, applications] = await Promise.all([
    JobPostingModel.find({ recruiterId }).sort({ createdAt: -1 }),
    companyName
      ? ApplicationModel.find({ companyName }).sort({ createdAt: -1 })
      : [],
  ]);

  return {
    activeJobs: jobs.filter((job) => job.status === "OPEN").length,
    totalApplicants: applications.length,
    scheduledInterviews: applications.filter((app) =>
      ["SHORTLISTED", "SELECTED"].includes(app.applicationStatus),
    ).length,
    recentApplicants: applications.slice(0, 5).map((app) => ({
      name: app.studentName || "Student",
      drive: app.jobRole,
      cgpa: app.CGPA,
      branch: app.eligibleBranches,
      status: app.applicationStatus,
    })),
    jobs: await Promise.all(
      jobs.map(async (job) => ({
        ...toDriveRow(
          job,
          await ApplicationModel.countDocuments({ jobId: job._id }),
        ),
      })),
    ),
    company,
  };
};

// company details - create or update for logged-in recruiter
companyApp.post(
  "/companyDetails",
  verifyToken("RECRUITER"),
  upload.single("companyLogo"),
  async (req, res, next) => {
    let cloudinaryResult;
    try {
      const recruiterId = req.user.id;
      const companyDetails = { ...req.body, recruiterId };

      if (req.file) {
        cloudinaryResult = await uploadToCloudinary(req.file.buffer);
        companyDetails.companyLogo = cloudinaryResult.secure_url;
      }

      const existing = await CompanyDetailsModel.findOne({ recruiterId });

      if (existing) {
        Object.assign(existing, companyDetails);
        await existing.save();
        return res.status(200).json({
          success: true,
          message: "Company details updated successfully",
          payload: existing,
        });
      }

      const newCompanyDetailsDoc = new CompanyDetailsModel(companyDetails);
      await newCompanyDetailsDoc.save();

      return res.status(201).json({
        success: true,
        message: "Company details added successfully",
        payload: newCompanyDetailsDoc,
      });
    } catch (err) {
      if (cloudinaryResult?.public_id) {
        await cloudinary.uploader.destroy(cloudinaryResult.public_id);
      }
      next(err);
    }
  },
);

companyApp.put(
  "/companyDetails",
  verifyToken("RECRUITER"),
  upload.single("companyLogo"),
  async (req, res, next) => {
    let cloudinaryResult;
    try {
      const recruiterId = req.user.id;
      const existing = await CompanyDetailsModel.findOne({ recruiterId });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Company details not found",
        });
      }

      const updatedDetails = { ...req.body };

      if (req.file) {
        cloudinaryResult = await uploadToCloudinary(req.file.buffer);
        updatedDetails.companyLogo = cloudinaryResult.secure_url;
      }

      Object.assign(existing, updatedDetails);
      await existing.save();

      return res.status(200).json({
        success: true,
        message: "Company details updated successfully",
        payload: existing,
      });
    } catch (err) {
      if (cloudinaryResult?.public_id) {
        await cloudinary.uploader.destroy(cloudinaryResult.public_id);
      }
      next(err);
    }
  },
);

// get company details for logged-in recruiter
companyApp.get(
  "/get-companyDetails",
  verifyToken("RECRUITER"),
  async (req, res, next) => {
    try {
      const companyDetails = await CompanyDetailsModel.findOne({
        recruiterId: req.user.id,
      });

      return res.status(200).json({
        success: true,
        message: companyDetails ? "Company details fetched" : "No company details found",
        payload: companyDetails,
      });
    } catch (err) {
      next(err);
    }
  },
);

companyApp.get(
  "/dashboard",
  verifyToken("RECRUITER"),
  async (req, res, next) => {
    try {
      const dashboard = await buildRecruiterDashboard(req.user.id);

      return res.status(200).json({
        success: true,
        payload: dashboard,
      });
    } catch (err) {
      next(err);
    }
  },
);

// job postings
companyApp.post(
  "/job-postings",
  verifyToken("RECRUITER"),
  async (req, res) => {
    try {
      const company = await CompanyDetailsModel.findOne({
        recruiterId: req.user.id,
      });

      const eligibleBranches = Array.isArray(req.body.branches)
        ? req.body.branches
        : String(req.body.branches || "")
            .split(",")
            .map((branch) => branch.trim())
            .filter(Boolean);

      const jobPostings = {
        job_id: `JOB-${Date.now()}`,
        recruiterId: req.user.id,
        companyName:
          req.body.companyName || company?.companyName || req.user.companyName || "",
        jobRole: req.body.role || req.body.jobRole,
        description: req.body.description || "",
        package: req.body.package,
        location: req.body.location || company?.companyLocation || "On campus",
        eligibleBranches,
        minimumCGPA: Number(req.body.minCgpa ?? req.body.minimumCGPA),
        driveDate: req.body.interviewDate || req.body.driveDate,
        lastDateToApply: req.body.lastDate || req.body.lastDateToApply,
        status: "OPEN",
      };

      const jobPostingsDoc = new JobPostingModel(jobPostings);
      await jobPostingsDoc.save();

      res.json({
        message: "Job Posted Successfully",
        payload: jobPostingsDoc,
      });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({
          message: "Job already posted",
        });
      }

      res.status(500).json({
        message: err.message,
      });
    }
  },
);

companyApp.get("/jobs", verifyToken("RECRUITER"), async (req, res, next) => {
  try {
    const jobs = await JobPostingModel.find({
      recruiterId: req.user.id,
    }).sort({ createdAt: -1 });

    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => ({
        ...toDriveRow(
          job,
          await ApplicationModel.countDocuments({ jobId: job._id }),
        ),
      })),
    );

    res.json({
      success: true,
      payload: jobsWithCounts,
    });
  } catch (err) {
    next(err);
  }
});

companyApp.patch("/jobs/:jobId", verifyToken("RECRUITER"), async (req, res, next) => {
  try {
    const job = await JobPostingModel.findOne({
      _id: req.params.jobId,
      recruiterId: req.user.id,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (isJobLocked(job)) {
      return res.status(403).json({
        success: false,
        message: "This job can no longer be edited or postponed",
      });
    }

    const updated = {
      jobRole: req.body.role || req.body.jobRole || job.jobRole,
      description: req.body.description ?? job.description,
      package: req.body.package ?? job.package,
      location: req.body.location ?? job.location,
      eligibleBranches: Array.isArray(req.body.branches)
        ? req.body.branches
        : String(req.body.branches || "")
            .split(",")
            .map((branch) => branch.trim())
            .filter(Boolean),
      minimumCGPA:
        req.body.minCgpa ?? req.body.minimumCGPA ?? job.minimumCGPA,
      driveDate: req.body.interviewDate || req.body.driveDate || job.driveDate,
      lastDateToApply: req.body.lastDate || req.body.lastDateToApply || job.lastDateToApply,
      status: req.body.status || job.status,
    };

    Object.assign(job, updated);
    await job.save();

    res.json({
      success: true,
      message: "Job updated successfully",
      payload: job,
    });
  } catch (err) {
    next(err);
  }
});

companyApp.delete("/jobs/:jobId", verifyToken("RECRUITER"), async (req, res, next) => {
  try {
    const job = await JobPostingModel.findOne({
      _id: req.params.jobId,
      recruiterId: req.user.id,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (isJobLocked(job)) {
      return res.status(403).json({
        success: false,
        message: "This job can no longer be deleted",
      });
    }

    await ApplicationModel.deleteMany({ jobId: job._id });
    await JobPostingModel.findByIdAndDelete(job._id);

    res.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (err) {
    next(err);
  }
});

companyApp.get("/jobs/:jobId/applicants", verifyToken("RECRUITER"), async (req, res, next) => {
  try {
    const job = await JobPostingModel.findOne({
      _id: req.params.jobId,
      recruiterId: req.user.id,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const applications = await ApplicationModel.find({
      jobId: job._id,
    })
      .populate("studentId", "firstname lastname email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      payload: applications.map(toApplicantRow),
    });
  } catch (err) {
    next(err);
  }
});

companyApp.get("/interviews", verifyToken("RECRUITER"), async (req, res, next) => {
  try {
    const company = await CompanyDetailsModel.findOne({
      recruiterId: req.user.id,
    });

    if (!company) {
      return res.json({
        success: true,
        payload: [],
      });
    }

    const applications = await ApplicationModel.find({
      companyName: company.companyName,
      $or: [
        { applicationStatus: { $in: ["SHORTLISTED", "SELECTED"] } },
        { interviewDate: { $ne: null } },
      ],
    })
      .populate("studentId", "firstname lastname email")
      .sort({ interviewDate: 1, createdAt: -1 });

    res.json({
      success: true,
      payload: applications.map(toInterviewRow),
    });
  } catch (err) {
    next(err);
  }
});

companyApp.patch(
  "/interviews/:applicationId",
  verifyToken("RECRUITER"),
  async (req, res, next) => {
    try {
      const company = await CompanyDetailsModel.findOne({
        recruiterId: req.user.id,
      });

      if (!company) {
        return res.status(404).json({
          success: false,
          message: "Company details not found",
        });
      }

      const application = await ApplicationModel.findOne({
        _id: req.params.applicationId,
        companyName: company.companyName,
      });

      if (!application) {
        return res.status(404).json({
          success: false,
          message: "Application not found",
        });
      }

      if (req.body.applicationStatus) {
        application.applicationStatus = req.body.applicationStatus;
      } else if (!application.applicationStatus || application.applicationStatus === "APPLIED") {
        application.applicationStatus = "SHORTLISTED";
      }

      if (req.body.currentRound !== undefined) {
        application.currentRound = req.body.currentRound;
      }

      if (req.body.interviewDate !== undefined) {
        application.interviewDate = req.body.interviewDate || null;
      }

      if (req.body.interviewTime !== undefined) {
        application.interviewTime = req.body.interviewTime || "";
      }

      if (req.body.interviewMode !== undefined) {
        application.interviewMode = req.body.interviewMode || "";
      }

      await application.save();

      res.json({
        success: true,
        message: "Interview updated successfully",
        payload: toInterviewRow(
          await application.populate("studentId", "firstname lastname email"),
        ),
      });
    } catch (err) {
      next(err);
    }
  },
);

// get applications
companyApp.get(
  "/get-applications",
  verifyToken("RECRUITER"),
  async (req, res) => {
    const company = await CompanyDetailsModel.findOne({
      recruiterId: req.user.id,
    });

    if (!company) {
      return res.json({
        message: "No company details found",
        payload: [],
      });
    }

    const jobApplication = await ApplicationModel.find({
      companyName: company.companyName,
    }).sort({ createdAt: -1 });

    res.json({
      message: "job applications: ",
      payload: jobApplication.map(toApplicantRow),
    });
  },
);
