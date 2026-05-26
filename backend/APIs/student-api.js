import exp from 'express'
import { AcademicDetailsModel } from "../models/academicDetails-model.js"
import { verifyToken } from '../middlewares/VerifyToken.js';
import { ApplicationModel } from '../models/application-model.js';
import { JobPostingModel } from '../models/jobPostings-model.js';

export const studentApp = exp.Router();


//post academic details
studentApp.post("/add-academicDetails", verifyToken("STUDENT"), async (req, res) => {
  const academicDetails = req.body;
  // console.log(academicDetails);
  const newAcademicsDoc = new AcademicDetailsModel(academicDetails);
  await newAcademicsDoc.save();
  res.json({ message: "Academic Details Added", payload: [academicDetails] })
})

//get academic details
// get academic details
studentApp.get(
  "/get-academicDetails",
  verifyToken("STUDENT"),
  async (req, res) => {
    try {

      const academicDetails =
        await AcademicDetailsModel.findOne();

      res.json({
        message: "Academic details fetched",
        payload: academicDetails
      });

    }

    catch (err) {

      res.status(500).json({
        message: err.message
      });

    }
  }
);


//get-jobs
studentApp.get("/get-jobs", verifyToken("STUDENT"), async (req, res) => {
  const jobs = await JobPostingModel.find();
  res.json({ message: "JOBS:", payload: [jobs] })
})

// job-application
studentApp.post(
  "/job-application",
  verifyToken("STUDENT"),
  async (req, res) => {
    try {

      const jobApplication = req.body;

      // find selected job
      const job =
        await JobPostingModel.findById(
          jobApplication.jobId
        );

      if (!job) {
        return res.json({
          message: "Job not found"
        });
      }

      // eligibility check
      if (
        jobApplication.CGPA <
        job.minimumCGPA
      ) {
        return res.json({
          message:
            "Not Enough CGPA",
          requiredCGPA:
            job.minimumCGPA
        });
      }

      // save application
      const jobApplicationDoc =
        new ApplicationModel(
          jobApplication
        );

      await jobApplicationDoc.save();

      res.json({
        message:
          "Job Applied Successfully",
        payload:
          jobApplicationDoc
      });

    } catch (err) {

      res.status(500).json({
        message:
          "Error applying job",
        error:
          err.message
      });

    }
  }
);

//get-applications
studentApp.get(
  "/get-applications",
  verifyToken("STUDENT"),
  async (req, res) => {

    const applications =
      await ApplicationModel.find();

    res.json({
      payload:
        applications
    });

  }
)

// withdraw application
studentApp.delete(
  "/withdraw-application/:applicationId",
  verifyToken("STUDENT"),
  async (req, res) => {

    try {

      const { applicationId } =
        req.params;

      const deletedApplication =
        await ApplicationModel.findByIdAndDelete(
          applicationId
        );

      if (!deletedApplication) {
        return res.json({
          message:
            "Application not found"
        });
      }

      res.json({
        message:
          "Application Withdrawn Successfully",
      });

    } catch (err) {

      res.status(500).json({
        message:
          "Error withdrawing application",
        error:
          err.message
      });

    }

  }
);


