import exp from 'express'
import { AcademicDetailsModel } from "../models/academicDetails-model.js"
import { verifyToken } from '../middlewares/VerifyToken.js';

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
studentApp.get("/get-academicDetails", verifyToken("STUDENT"), async (req, res) => {
  const academicDetails = await AcademicDetailsModel.find();
  // console.log("Academic Details:\n", academicDetails);
  res.json({ message: "Academic-details:", payload: [academicDetails] })
})