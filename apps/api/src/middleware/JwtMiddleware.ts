import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
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
    try {
      if (this.secret) {
        const token = req.cookies.Authorization;
        if (!token) {
          return res.status(401).send({ message: "Token não encontrado" });
        }
        const decodedToken = jwt.decode(token) as JwtPayload;
        if (decodedToken.exp && decodedToken.exp < Date.now() / 1000) {
          return res.status(401).send({ message: "Token expirado" });
        }
        jwt.verify(
          token,
          this.secret,
          { ignoreExpiration: false, complete: true },
          (err, decoded) => {
            if (decoded) {
              next();
            } else {
              return res.status(401).send({ message: "Token inválido" });
            }
          }
        );
      }
    } catch (e) {
      return res.status(500).send({ message: "Erro interno do servidor" });
    }
  };
})(secret).handler;
