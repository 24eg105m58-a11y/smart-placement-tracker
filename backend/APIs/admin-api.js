import exp from "express";
import { verifyToken } from "../middlewares/VerifyToken.js";
import UserModel from "../models/user-model.js";
import { AcademicDetailsModel } from "../models/academicDetails-model.js";
import { CompanyDetailsModel } from "../models/companyDetails-model.js";
import { JobPostingModel } from "../models/jobPostings-model.js";
import { ApplicationModel } from "../models/application-model.js";

export const adminApp = exp.Router();

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
};

const getMonthSeries = () => {
  const now = new Date();
  const months = [];

  for (let i = 8; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: MONTHS[date.getMonth()],
    });
  }

  return months;
};

const buildDashboard = async () => {
  const [students, companies, jobs, applications, selectedApplications] =
    await Promise.all([
      UserModel.countDocuments({ role: "STUDENT", isUserActive: true }),
      CompanyDetailsModel.countDocuments(),
      JobPostingModel.countDocuments(),
      ApplicationModel.countDocuments(),
      ApplicationModel.countDocuments({ applicationStatus: "SELECTED" }),
    ]);

  const monthSeries = getMonthSeries();
  const allApplications = await ApplicationModel.find().sort({ createdAt: 1 });
  const allJobs = await JobPostingModel.find().sort({ createdAt: -1 });

  const placementOverview = monthSeries.map(({ key, label }) => {
    const [year, month] = key.split("-").map(Number);

    const monthlyApplications = allApplications.filter((app) => {
      const created = new Date(app.createdAt);
      return created.getFullYear() === year && created.getMonth() === month;
    });

    return {
      month: label,
      placed: monthlyApplications.filter((app) => app.applicationStatus === "SELECTED").length,
      applied: monthlyApplications.length,
    };
  });

  const placementStatus = [
    {
      name: "Placed",
      value: selectedApplications,
      color: "#22c55e",
    },
    {
      name: "In Process",
      value: Math.max(applications - selectedApplications, 0),
      color: "#f59e0b",
    },
    {
      name: "Not Placed",
      value: Math.max(students - selectedApplications, 0),
      color: "#ef4444",
    },
  ];

  const recentDrives = allJobs.slice(0, 5).map((job) => ({
    id: job._id,
    company: job.companyName,
    driveName: job.jobRole,
    date: formatDate(job.driveDate),
    status: job.status === "OPEN" ? "Upcoming" : "Completed",
  }));

  return {
    dashboardStats: {
      students,
      companies,
      jobDrives: jobs,
      placements: selectedApplications,
    },
    placementOverview,
    placementStatus,
    recentDrives,
  };
};

const toStudentRow = (student, academic, applications) => ({
  id: student._id,
  rollNo: academic?.rollNumber || student.rollNumber || "",
  name: `${student.firstname || ""} ${student.lastname || ""}`.trim(),
  profileImageUrl: student.profileImageUrl || "",
  branch: academic?.branch || "",
  batch: academic?.graduationYear ? String(academic.graduationYear) : "",
  cgpa: academic?.cgpa ?? "",
  status: applications.some((app) => app.applicationStatus === "SELECTED")
    ? "Placed"
    : applications.length > 0
      ? "In Process"
      : "Not Placed",
  email: student.email,
  phone: academic?.phone || "",
  dob: academic?.dob || "",
  address: academic?.address || "",
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

const toJobDriveRow = (job) => ({
  id: job._id,
  driveName: job.jobRole,
  company: job.companyName,
  date: formatDate(job.driveDate),
  eligibleBranches: Array.isArray(job.eligibleBranches)
    ? job.eligibleBranches.join(", ")
    : job.eligibleBranches || "",
  status: job.status === "OPEN" ? "Upcoming" : "Completed",
  package: job.package,
  role: job.jobRole,
});

const toApplicationRow = (application) => ({
  id: application._id,
  studentName: application.studentName || "Student",
  driveName: application.jobRole,
  appliedOn: formatDate(application.createdAt),
  status: application.applicationStatus,
});

const toPlacementRow = (application) => ({
  id: application._id,
  studentName: application.studentName || "Student",
  company: application.companyName,
  package: application.package || "",
  placedOn: formatDate(application.updatedAt || application.createdAt),
});

const buildReports = async () => {
  const [selectedApplications, allApplications] = await Promise.all([
    ApplicationModel.find({ applicationStatus: "SELECTED" }).sort({ updatedAt: -1 }),
    ApplicationModel.find().sort({ createdAt: -1 }),
  ]);

  const totalOffers = selectedApplications.length;
  const allPackages = selectedApplications
    .map((app) => Number(String(app.package || "").replace(/[^0-9.]/g, "")))
    .filter((val) => !Number.isNaN(val) && val > 0);

  const highestPackage = allPackages.length > 0 ? Math.max(...allPackages) : 0;
  const averagePackage =
    allPackages.length > 0
      ? Number((allPackages.reduce((sum, value) => sum + value, 0) / allPackages.length).toFixed(2))
      : 0;

  const offersOverTime = getMonthSeries().map(({ key, label }) => {
    const [year, month] = key.split("-").map(Number);
    return {
      month: label,
      offers: selectedApplications.filter((app) => {
        const updated = new Date(app.updatedAt || app.createdAt);
        return updated.getFullYear() === year && updated.getMonth() === month;
      }).length,
    };
  });

  const offersByBranchMap = new Map();
  allApplications.forEach((application) => {
    const branch = application.eligibleBranches || "Others";
    const current = offersByBranchMap.get(branch) || 0;
    offersByBranchMap.set(branch, current + (application.applicationStatus === "SELECTED" ? 1 : 0));
  });

  const offersByBranch = Array.from(offersByBranchMap.entries()).map(([name, value], index) => ({
    name,
    value,
    color: ["#2563eb", "#7c3aed", "#0891b2", "#ea580c", "#64748b"][index % 5],
  }));

  return {
    reportStats: {
      placementRate: allApplications.length
        ? Math.round((totalOffers / allApplications.length) * 100)
        : 0,
      totalOffers,
      highestPackage,
      averagePackage,
    },
    offersOverTime,
    offersByBranch: offersByBranch.length
      ? offersByBranch
      : [{ name: "Others", value: 0, color: "#64748b" }],
  };
};

adminApp.get("/dashboard", verifyToken("ADMIN"), async (req, res, next) => {
  try {
    const dashboard = await buildDashboard();
    res.json({
      success: true,
      payload: dashboard,
    });
  } catch (err) {
    next(err);
  }
});

adminApp.get("/students", verifyToken("ADMIN"), async (req, res, next) => {
  try {
    const [students, academicDetails, applications] = await Promise.all([
      UserModel.find({ role: "STUDENT", isUserActive: true }).sort({ createdAt: -1 }),
      AcademicDetailsModel.find(),
      ApplicationModel.find(),
    ]);

    const rows = students.map((student) => {
      const academic = academicDetails.find(
        (detail) => String(detail.studentId) === String(student._id),
      );
      const studentApplications = applications.filter(
        (app) => String(app.studentId) === String(student._id),
      );
      return toStudentRow(student, academic, studentApplications);
    });

    res.json({
      success: true,
      payload: rows,
    });
  } catch (err) {
    next(err);
  }
});

adminApp.get("/companies", verifyToken("ADMIN"), async (req, res, next) => {
  try {
    const companies = await CompanyDetailsModel.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      payload: companies.map(toCompanyRow),
    });
  } catch (err) {
    next(err);
  }
});

adminApp.get("/job-drives", verifyToken("ADMIN"), async (req, res, next) => {
  try {
    const drives = await JobPostingModel.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      payload: drives.map(toJobDriveRow),
    });
  } catch (err) {
    next(err);
  }
});

adminApp.get("/applications", verifyToken("ADMIN"), async (req, res, next) => {
  try {
    const applications = await ApplicationModel.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      payload: applications.map(toApplicationRow),
    });
  } catch (err) {
    next(err);
  }
});

adminApp.get("/placements", verifyToken("ADMIN"), async (req, res, next) => {
  try {
    const placements = await ApplicationModel.find({
      applicationStatus: "SELECTED",
    }).sort({ updatedAt: -1 });
    res.json({
      success: true,
      payload: placements.map(toPlacementRow),
    });
  } catch (err) {
    next(err);
  }
});

adminApp.get("/users", verifyToken("ADMIN"), async (req, res, next) => {
  try {
    const users = await UserModel.find({ isUserActive: true }).sort({
      createdAt: -1,
    });
    res.json({
      success: true,
      payload: users.map((user) => ({
        id: user._id,
        name: `${user.firstname || ""} ${user.lastname || ""}`.trim(),
        role: user.role,
        email: user.email,
        status: user.isUserActive ? "Active" : "Inactive",
      })),
    });
  } catch (err) {
    next(err);
  }
});

adminApp.get("/settings", verifyToken("ADMIN"), async (req, res) => {
  res.json({
    success: true,
    payload: {
      institutionName: process.env.INSTITUTION_NAME || "Smart Placement College",
      contactEmail: process.env.INSTITUTION_EMAIL || "tpo@college.edu",
      contactPhone: process.env.INSTITUTION_PHONE || "+91 40 12345678",
      address:
        process.env.INSTITUTION_ADDRESS ||
        "123 University Road, Hyderabad, Telangana 500001",
    },
  });
});

adminApp.get("/reports", verifyToken("ADMIN"), async (req, res, next) => {
  try {
    const reports = await buildReports();
    res.json({
      success: true,
      payload: reports,
    });
  } catch (err) {
    next(err);
  }
});
