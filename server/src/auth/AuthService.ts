import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository.js";
import { User } from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

export class AuthService {
  private static instance: AuthService;
  private googleClient: OAuth2Client;
  private userRepository: UserRepository;

  private constructor() {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    this.userRepository = new UserRepository();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Verifies Google ID Token and logs in/registers the user
   */
  async loginWithGoogle(idToken: string): Promise<{ user: User; token: string }> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID ?? "",
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email || !payload.sub) {
        throw new Error("Invalid Google token payload");
      }

      const { email, name, sub: googleId } = payload;

      // Upsert user in database
      const user = await this.userRepository.upsertGoogleUser({
        email,
        name: name || null,
        googleId,
      });

      // Issue app JWT
      const token = this.generateAppToken(user.id);

      return { user, token };
    } catch (error: any) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  /**
   * Mock login for demo purposes
   */
  /**
   * Mock login for demo purposes
   */
  async loginDemo(email: string, name: string): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.upsertGoogleUser({
      email,
      name,
      googleId: "demo-google-id",
    });

    // Ensure they have default categories immediately
    const categoryRepo = new (await import("../repositories/CategoryRepository.js")).CategoryRepository();
    await categoryRepo.findByUserId(user.id);

    const token = this.generateAppToken(user.id);
    return { user, token };
  }

  /**
   * Generates a custom JWT for the application session
   */
  public generateAppToken(userId: string): string {
    const secret = process.env.JWT_SECRET || "default_secret_change_me";
    return jwt.sign({ userId }, secret, { expiresIn: "7d" });
  }

  /**
   * Verifies the app's own JWT
   */
  verifyAppToken(token: string): { userId: string } | null {
    try {
      const secret = process.env.JWT_SECRET || "default_secret_change_me";
      const decoded = jwt.verify(token, secret) as { userId: string };
      return decoded;
    } catch {
      return null;
    }
  }
}
