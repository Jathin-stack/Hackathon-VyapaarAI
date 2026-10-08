import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_hackathon";

// Add user to Request object typing
declare global {
  namespace Express {
    interface Request {
      user?: any; // You can strongly type this later to match the User model
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const payload = jwt.verify(token, JWT_SECRET) as any;

    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, payload.userId)
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid user session" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
};
