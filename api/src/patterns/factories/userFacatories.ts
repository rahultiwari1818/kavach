import User from "../../models/users.model.js";
import { hashPassword } from "../../utils/utils.js";
import userToken from "../../interfaces/userToken.interface.js";
import { generateToken } from "../../utils/webTokenUtils.js";
import { Response } from "express";
import { HydratedDocument } from "mongoose";
import { User as IUser } from "../../interfaces/user.interface.js";

interface IUserFactory {
  createUser(
    name: string,
    email: string,
    password: string
  ): Promise<HydratedDocument<IUser>>;
  generateAuthCookies(user: any, res: Response): void;
}

export class PublicUserFactory implements IUserFactory {
  async createUser(name: string, email: string, password: string) {
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      name,
      email,
      role: "public",
      password: hashedPassword,
    });
    return newUser.save();
  }

  generateAuthCookies(user: any, res: Response) {
    const payload: userToken = {
      _id: String(user._id),
      email: user.email,
      role: user.role,
    };

    const token = generateToken(payload);

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    res.cookie("role", user.role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });
  }
}

export class AdminFactory extends PublicUserFactory {
  async createUser(name: string, email: string, password: string) {
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      name,
      email,
      role: "admin",
      password: hashedPassword,
      isActive: true,
    });
    return newUser.save();
  }
}

export class SuperAdminFactory extends PublicUserFactory {
  async createUser(name: string, email: string, password: string) {
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      name,
      email,
      role: "super-admin",
      password: hashedPassword,
      isActive: true,
    });
    return newUser.save();
  }
}

export class UserFactoryProvider {
  static getFactory(role: string): IUserFactory {
    switch (role) {
      case "admin":
        return new AdminFactory();
      case "super-admin":
        return new SuperAdminFactory();
      default:
        return new PublicUserFactory();
    }
  }
}
