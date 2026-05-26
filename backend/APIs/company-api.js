import exp from 'express';
import { CompanyDetailsModel } from '../models/companyDetails-model.js';
import { verifyToken } from '../middlewares/VerifyToken.js';
import { JobPostingModel } from '../models/jobPostings-model.js';
import { ApplicationModel } from '../models/application-model.js';

export const companyApp = exp.Router();

//company details
companyApp.post("/companyDetails", verifyToken("RECRUITER"), async (req, res) => {
  const companyDetails = req.body;
  console.log(companyDetails);
  const newCompanyDetailsDoc = new CompanyDetailsModel(companyDetails);
  newCompanyDetailsDoc.save();
  res.json({ message: "Company Details Added", payload: [companyDetails] })
})

//get company details
companyApp.get("/get-companyDetails", verifyToken("RECRUITER"), async (req, res) => {
  const companyDetails = await CompanyDetailsModel.find();
  res.json({ message: "Comapany Details: ", payload: [companyDetails] })
})

//job postings
companyApp.post(
  "/job-postings",
  verifyToken("RECRUITER"),
  async (req, res) => {

    try {

      const jobPostings =
        req.body;

      const jobPostingsDoc =
        new JobPostingModel(
          jobPostings
        );

      await jobPostingsDoc.save();

      res.json({
        message:
          "Job Posted Successfully",
        payload:
          jobPostingsDoc
      });

    }
    catch (err) {

      if (
        err.code === 11000
      ) {

        return res
          .status(409)
          .json({
            message:
              "Job already posted"
          });

      }

      res
        .status(500)
        .json({
          message:
            err.message
        });

    }

  });

//get applications
companyApp.get("/get-applications", verifyToken("RECRUITER"), async (req, res) => {
  const jobApplication = await ApplicationModel.find();
  res.json({ message: "job applications: ", payload: [jobApplication] })
})