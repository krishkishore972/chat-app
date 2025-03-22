import prisma from "../db/prismaClient";
import bcrypt from "bcrypt";
import { Request,Response } from "express";
import generateJWTTokenAndSetCookie from "../utils/generateToken";



export const signup = async (
  req:Request,
  res:Response
) => {
  try {
    const { email, password,username } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });
    if (existingUser) {
      res.status(400).json({
        message: "User already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
      },
    });

    generateJWTTokenAndSetCookie(user.id, res);
    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, email: user.username },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

export const signin = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "email and password are required" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    generateJWTTokenAndSetCookie(user.id.toString(), res);
    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Error while logging in" });
  }
};
