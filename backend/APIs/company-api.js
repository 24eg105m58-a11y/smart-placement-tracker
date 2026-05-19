import exp from 'express';
import { CompanyDetailsModel } from '../models/companyDetails-model.js';

export const companyApp = exp.Router();

//company details
companyApp.post("/companyDetails", async (req, res) => {
  const companyDetails = req.body;
  console.log(companyDetails);
  const newCompanyDetailsDoc = new CompanyDetailsModel(companyDetails);
  newCompanyDetailsDoc.save();
  res.json({ message: "Company Details Added", payload: [companyDetails] })
})