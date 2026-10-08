import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, usersTable, businessesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_hackathon";

// Helper to generate token
const generateToken = (userId: string, businessId: string | null, role: string) => {
  return jwt.sign({ userId, businessId, role }, JWT_SECRET, { expiresIn: "7d" });
};

// Register Route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email)
    });
    
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create User (using a transaction to create Business as well)
    const result = await db.transaction(async (tx) => {
      const [newUser] = await tx.insert(usersTable).values({
        name,
        email,
        passwordHash,
      }).returning();

      const [newBusiness] = await tx.insert(businessesTable).values({
        name: `${name}'s Store`,
        ownerId: newUser.id,
      }).returning();

      // Link business back to user
      const [updatedUser] = await tx.update(usersTable)
        .set({ businessId: newBusiness.id })
        .where(eq(usersTable.id, newUser.id))
        .returning();

      return updatedUser;
    });

    const token = generateToken(result.id, result.businessId, result.role);
    
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      id: result.id,
      name: result.name,
      email: result.email,
      role: result.role,
      businessId: result.businessId
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email)
    });

    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id, user.businessId, user.role);
    
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      businessId: user.businessId
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
// Real Google Auth Route for Hackathon
router.post("/google", async (req, res) => {
  try {
    const { accessToken } = req.body;
    
    if (!accessToken) {
      return res.status(400).json({ message: "Access token is required" });
    }

    // Verify the token with Google
    const googleResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!googleResponse.ok) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    const googleUser = await googleResponse.json();
    const email = googleUser.email;
    const name = googleUser.name;
    const googleId = googleUser.sub;
    
    let user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email)
    });

    if (!user) {
      // Create User
      user = await db.transaction(async (tx) => {
        const [newUser] = await tx.insert(usersTable).values({
          name,
          email,
          provider: "google",
          googleId: googleId,
          profileImage: googleUser.picture
        }).returning();

        const [newBusiness] = await tx.insert(businessesTable).values({
          name: `${name}'s Store`,
          ownerId: newUser.id,
        }).returning();

        const [updatedUser] = await tx.update(usersTable)
          .set({ businessId: newBusiness.id })
          .where(eq(usersTable.id, newUser.id))
          .returning();

        return updatedUser;
      });
    }

    const token = generateToken(user.id, user.businessId, user.role);
    
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      businessId: user.businessId
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Logout Route
router.post("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.json({ message: "Logged out successfully" });
});

// Get Current User Route
import { authenticate } from "../middleware/auth";
router.get("/me", authenticate, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    businessId: req.user.businessId
  });
});

export default router;
