import express from "express";
import type { Request, Response, NextFunction } from "express";
import { AuthService } from "./AuthService.js";

// Extend Request interface to include user
export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Invalid token format" });
    return;
  }
  const authService = AuthService.getInstance();
  const decoded = authService.verifyAppToken(token);

  if (!decoded) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  req.userId = decoded.userId;
  next();
};
