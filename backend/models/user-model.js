import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    firstname: {
      type: String,
      required: [true, "firstname required"],
    },

    lastname: {
      type: String,
    },

    email: {
      type: String,
      required: [true, "email required"],
      unique: true,
    },

    password: {
      type: String,
      required: [true, "password required"],
      minlength: [8, "minimum 8 characters"],
    },

    role: {
      type: String,
      enum: ["STUDENT", "ADMIN", "RECRUITER"],
      required: [true, "Invalid role"],
    },

    profileImageUrl: {
      type: String,
    },

    companyName: {
      type: String,
      trim: true,
    },

    isUserActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw",
  }
);

const UserModel = model("user", UserSchema);

export default UserModel;