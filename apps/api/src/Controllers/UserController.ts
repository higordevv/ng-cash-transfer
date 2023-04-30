import { Request, Response } from "express";
import { Hash } from "../Utils/bcrypt";
import { z } from "zod";
import { prisma } from "../database/Prisma";
import jwt from "jsonwebtoken";
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
  async CREATE(req: Request<any, any, UserBody>, res: Response) {
    const { username, password } = UserSchema.parse(req.body);

    const user = await prisma.user.findMany({
      where: { username: `@${username}` },
    });

    if (user.length > 0)
      return res.status(400).json({ message: "Usuário já existe." });

    try {
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

      const secret = process.env.TOKEN_SECRET as string;
      const token = jwt.sign({ id }, secret, {
        expiresIn: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 Hours
      });
      return res
        .cookie("Authorization", token, { httpOnly: true })
        .json({ token, user: username, balance: "100R$" });
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
})();
