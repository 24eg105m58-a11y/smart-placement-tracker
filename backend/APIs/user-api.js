import exp from "express";
import UserModel from "../models/user-model.js";

import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

import { verifyToken } from "../middlewares/VerifyToken.js";

import { upload } from "../config/multer.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";

config();

const { sign } = jwt;

export const userApp = exp.Router();

// register
userApp.post(
  "/register",

  upload.single("profileImageUrl"),

  async (req, res, next) => {

    let cloudinaryResult;

    try {

      const newUser = req.body;

      const allowedRoles = [
        "STUDENT",
        "ADMIN",
        "RECRUITER",
      ];

      if (!allowedRoles.includes(newUser.role)) {

        return res.status(400).json({
          success: false,
          message: "Invalid role",
        });

      }

      if (
        !newUser.password ||
        typeof newUser.password !== "string" ||
        newUser.password.length < 8
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Password must contain minimum 8 characters",
        });

      }

      if (req.file) {

        cloudinaryResult =
          await uploadToCloudinary(
            req.file.buffer
          );

        newUser.profileImageUrl =
          cloudinaryResult.secure_url;

      }

      newUser.password = await hash(
        newUser.password,
        12
      );

      const newUserDoc =
        new UserModel(newUser);

      await newUserDoc.save();

      return res.status(201).json({
        success: true,
        message:
          "User created successfully",
      });

    } catch (err) {

      if (cloudinaryResult?.public_id) {

        await cloudinary.uploader.destroy(
          cloudinaryResult.public_id
        );

      }

      next(err);

    }

  }
);

// login
userApp.post(
  "/login",

  async (req, res, next) => {

    try {

      const { email, password } =
        req.body;

      const user =
        await UserModel.findOne({
          email,
          isUserActive: true,
        });

      if (!user) {

        return res.status(400).json({
          success: false,
          message: "Invalid email",
        });

      }

      const isMatched =
        await compare(
          password,
          user.password
        );

      if (!isMatched) {

        return res.status(400).json({
          success: false,
          message: "Invalid password",
        });

      }

      const signedToken = sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
          firstname: user.firstname,
          lastname: user.lastname,
          profileImageUrl:
            user.profileImageUrl,
        },

        process.env.SECRET_KEY,

        {
          expiresIn: "1h",
        }
      );

      res.cookie("token", signedToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });

      const userObj = user.toObject();

      delete userObj.password;

      return res.status(200).json({
        success: true,
        message: "Login successful",
        payload: userObj,
      });

    } catch (err) {

      next(err);

    }

  }
);

// logout

userApp.get(
  "/logout",

  (req, res) => {

    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });

  }
);

// check auth
userApp.get(
  "/check-auth",

  verifyToken(
    "STUDENT",
    "ADMIN",
    "RECRUITER"
  ),

  (req, res) => {

    return res.status(200).json({
      success: true,
      message: "Authenticated",
      payload: req.user,
    });

  }
);

// change password

userApp.put(
  "/password",

  verifyToken(
    "STUDENT",
    "ADMIN",
    "RECRUITER"
  ),

  async (req, res, next) => {

    try {

      const {
        currentPassword,
        newPassword,
      } = req.body;

      const user =
        await UserModel.findById(
          req.user.id
        );

      if (!user) {

        return res.status(404).json({
          success: false,
          message: "User not found",
        });

      }

      const isMatched =
        await compare(
          currentPassword,
          user.password
        );

      if (!isMatched) {

        return res.status(400).json({
          success: false,
          message:
            "Current password is incorrect",
        });

      }

      const isSamePassword =
        await compare(
          newPassword,
          user.password
        );

      if (isSamePassword) {

        return res.status(400).json({
          success: false,
          message:
            "New password cannot be same as current password",
        });

      }

      if (newPassword.length < 8) {

        return res.status(400).json({
          success: false,
          message:
            "Password must contain minimum 8 characters",
        });

      }

      user.password = await hash(
        newPassword,
        12
      );

      await user.save();

      return res.status(200).json({
        success: true,
        message:
          "Password updated successfully",
      });

    } catch (err) {

      next(err);

    }

  }
);

// soft delete user

userApp.put(
  "/soft-delete/:id",

  verifyToken("ADMIN"),

  async (req, res, next) => {

    try {

      const deletedUser =
        await UserModel.findByIdAndUpdate(

          req.params.id,

          {
            isUserActive: false,
          },

          {
            new: true,
          }
        );

      if (!deletedUser) {

        return res.status(404).json({
          success: false,
          message: "User not found",
        });

      }

      return res.status(200).json({
        success: true,
        message:
          "User soft deleted successfully",
      });

    } catch (err) {

      next(err);

    }

  }
);
