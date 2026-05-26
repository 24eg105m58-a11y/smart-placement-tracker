import exp from 'express'
import { config } from 'dotenv'
import mongoose from 'mongoose'
import { userApp } from './APIs/user-api.js'
import { studentApp } from './APIs/student-api.js'
import { companyApp } from './APIs/company-api.js'
import cookieParser from "cookie-parser"
import cors from "cors"

config()

const app = exp()

app.use(exp.json())

app.use(cors({
  origin: [
    "http://localhost:5173"
  ],
  credentials: true
}))

app.use(cookieParser())

//route mounting
app.use("/user-api", userApp)
app.use("/student-api", studentApp)
app.use("/company-api", companyApp)

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)

    console.log("Connected to Database...")

    app.listen(
      process.env.PORT,
      () =>
        console.log(
          `server is listening on ${process.env.PORT}...`
        )
    )
  }

  catch (err) {

    console.log(
      "Database Connection is Failed..."
    )

    console.log(
      "Error is : ",
      err
    )

  }
}

connectDB()

const errorMiddleware = (
  err,
  req,
  res,
  next
) => {

  if (
    err.name ===
    "ValidationError"
  ) {

    const errors = {}

    Object.keys(
      err.errors
    ).forEach((key) => {

      errors[key] =
        err.errors[key].message

    })

    return res
      .status(400)
      .json({
        success: false,
        errors
      })

  }

  if (
    err.code === 11000
  ) {

    return res
      .status(409)
      .json({
        success: false,
        message:
          "Already Exists"
      })

  }

  return res
    .status(500)
    .json({
      success: false,
      message:
        err.message
    })

}

app.use(errorMiddleware)