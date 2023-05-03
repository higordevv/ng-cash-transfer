import { Request, Response } from "express";
import { Hash, VerifyHash } from "../Utils/bcrypt";
import { z } from "zod";
import { prisma } from "../database/Prisma";
import jwt, { JwtPayload } from "jsonwebtoken";

const secret = process.env.TOKEN_SECRET as string;

const UserSchema = z.object({
  username: z.string().min(3, "O User deve ter pelo menos 3 caracteres"),
  password: z
    .string()
    .min(
      8,
      "A senha deve ter pelo menos 8 caracteres, um número e uma letra maiúscula."
    )
    .regex(/^(?=.*[A-Z])(?=.*\d).*$/),
});

type UserBody = z.infer<typeof UserSchema>;

export default new (class UserController {
  async AuthenticateUser(req: Request<any, any, UserBody>, res: Response) {
    try {
      const { username, password } = UserSchema.parse(req.body);

      const user = await prisma.user.findMany({
        where: { username: `@${username}` },
      });

      if (user.length > 0) {
        if (!(await VerifyHash(password, user[0].password))) {
          return res.status(401).json({ message: "Senha invalida" });
        }

        const { id } = user[0];
        const token_login = jwt.sign({ id }, secret, {
          expiresIn: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 Hours
        });
        return res
          .cookie("Authorization", token_login, { httpOnly: true })
          .json({
            status: "User logged in",
            expiresIn: "Token expires in 24h",
          });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Erro de validação",
          errors: error.errors.map((e) => e.message),
        });
      }
      console.error(error);
      res.status(500).send("Erro ao criar usuário.");
    }
  }

  async RegisterUser(req: Request<any, any, UserBody>, res: Response) {
    try {
      const { username, password } = UserSchema.parse(req.body);
      
      
      const user = await prisma.user.findMany({
        where: { username: `@${username}` },
      });

      if (user.length > 0) {
        return res.status(400).json({message: "User já existe"})
      }
      const hashedPassword = await Hash(password);

      const { id: accountId } = await prisma.account.create({
        data: {
          balance: 100,
        },
      });

      const { id } = await prisma.user.create({
        data: {
          username: `@${username}`,
          password: hashedPassword,
          account: { connect: { id: accountId } },
        },
        include: { account: true },
      });

      const token = jwt.sign({ id }, secret, {
        expiresIn: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 Hours
      });
      return res
        .cookie("Authorization", token, { httpOnly: true })
        .json({ status: "User registred", user: username, balance: "100R$" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Erro de validação",
          errors: error.errors.map((e) => e.message),
        });
      }
      console.error(error);
      res.status(500).send("Erro ao criar usuário.");
    }
  }

  async requestUserInfo(req: Request, res: Response) {
    try {
      const token = req.cookies.Authorization;
      const decodedToken = jwt.verify(token, secret) as JwtPayload;
      const userId = decodedToken.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { account: true },
      });

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const { username, account } = user;

      return res.status(200).json({
        user_id: userId,
        username,
        account,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send("Erro ao buscar informações do usuário.");
    }
  }
  async getTransactionHistory(req: Request, res: Response) {
    try {
      const token = req.cookies.Authorization;
      const decodedToken = jwt.verify(token, secret) as JwtPayload;
      const userId = decodedToken.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { account: true },
      });

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const { account } = user;
      const transactions = await prisma.transaction.findMany({
        where: {
          OR: [
            { creditedAccountId: account.id },
            { debitedAccountId: account.id },
          ],
        },
        include: { creditedAccount: true, debitedAccount: true },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({
        transactions,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send("Erro ao buscar histórico de transações do usuário.");
    }
  }
})();
