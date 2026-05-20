import exp from 'express'
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { userApp } from './APIs/user-api.js';
import { studentApp } from './APIs/student-api.js';
import { companyApp } from './APIs/company-api.js';
import cookieParser from "cookie-parser";


config()
const app = exp();
app.use(exp.json())

//
app.use(cookieParser());

//route mounting
app.use("/user-api", userApp)
app.use("/student-api", studentApp)
app.use("/company-api", companyApp)

// console.log(process.env.PORT)
// console.log(process.env.DB_URL)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to Database...")
    app.listen(process.env.PORT, () => console.log(`server is listening on ${process.env.PORT}...`))
  }
  catch (err) {
    console.log("Database Connection is Falied...")
    console.log("Error is : ", err);
  }
}
connectDB()


const errorMiddleware = (err, req, res, next) => {

  // ==============================
  // VALIDATION ERROR
  // ==============================
  if (err.name === "ValidationError") {

    const errors = {};

    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });

    return res.status(400).json({
      success: false,
      type: "ValidationError",
      errors,
    });
  }

  // ==============================
  // DUPLICATE KEY ERROR
  // ==============================
  if (err.code === 11000) {

    const errors = {};

    Object.keys(err.keyValue).forEach((key) => {
      errors[key] = `${key} already exists`;
    });

    return res.status(409).json({
      success: false,
      type: "DuplicateKeyError",
      errors,
    });
  }

  // ==============================
  // INVALID OBJECT ID
  // ==============================
  if (err.name === "CastError") {

    return res.status(400).json({
      success: false,
      type: "CastError",
      errors: {
        [err.path]: `Invalid ${err.path}`,
      },
    });
  }

  // ==============================
  // DEFAULT ERROR
  // ==============================
  return res.status(500).json({
    success: false,
    type: "ServerError",
    message: err.message || "Internal Server Error",
  });
};

export default errorMiddleware;