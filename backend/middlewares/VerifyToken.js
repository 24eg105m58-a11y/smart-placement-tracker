import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const { verify } = jwt;

export const verifyToken = (...allowedRoles) => {
  return async (req, res, next) => {
    try {

      const token = req.cookies?.token;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Please login first",
        });
      }

      const decodedToken = verify(
        token,
        process.env.SECRET_KEY
      );

      if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(decodedToken.role)
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      req.user = decodedToken;

      next();

    } catch (err) {

      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired",
        });
      }

      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Invalid token",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Authentication failed",
      });

    }
  };
};