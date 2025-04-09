import jwt from "jsonwebtoken";
import { Response } from "express";

const generateJWTTokenAndSetCookie = (userId: string, res: Response): void => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const token = jwt.sign( {sub:userId} , process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // milliseconds
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production", // Set to true in production
  });
};

export default generateJWTTokenAndSetCookie;
