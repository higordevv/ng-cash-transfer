import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";

const secret = process.env.TOKEN_SECRET as string;

export default new (class VerifyJwt {
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  public handler = async (
    req: Request<User | any>,
    res: Response,
    next: NextFunction
  ) => {
    const token = req.cookies.Authorization;

    if (!token) {
      return res.status(401).send({ message: "Token não encontrado" });
    }

    try {
      if (this.secret) {
        jwt.verify(token, this.secret);
        next();
      }
    } catch (e) {
      return res.status(401).json({ message: "Token inválido" });
    }
  };
})(secret).handler;
