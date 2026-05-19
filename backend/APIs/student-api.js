import exp from 'express'
import { AcademicDetailsModel } from "../models/academicDetails-model.js"

export const studentApp = exp.Router();


//
studentApp.post("/academicDetails", async (req, res) => {
  const academicDetails = req.body;
  // console.log(academicDetails);
  const newAcademicsDoc = new AcademicDetailsModel(academicDetails);
  await newAcademicsDoc.save();
  res.json({ message: "Academic Details Added", payload: [academicDetails] })
})

//get 