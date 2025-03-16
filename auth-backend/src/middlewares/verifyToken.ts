import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const secret: Secret = process.env.JWT_SECRET || "default_secret";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      res.status(401).json({ message: "Unauthorized: No token provided" });
      return;
    }

    const decoded = jwt.verify(token, secret);
    if (!decoded) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userId = (decoded as any).sub;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    req.userId = userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
    return;
  }
};
