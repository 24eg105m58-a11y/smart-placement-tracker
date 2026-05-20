import exp from 'express';
import { CompanyDetailsModel } from '../models/companyDetails-model.js';
import { verifyToken } from '../middlewares/VerifyToken.js';

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