import { Request, Response } from "express";
import { prisma } from "../database/Prisma";
import { z } from "zod";
import jwt, { JwtPayload } from "jsonwebtoken";
import type {Transaction } from "@prisma/client"
const secret = process.env.TOKEN_SECRET as string;

const TransactionSchema = z.object({
  creditedAccountUsername: z.string().nonempty(),
  value: z.number().positive(),
});

type TransactionBody = z.infer<typeof TransactionSchema>;

export default new (class TransactionController {
  async createTransaction(
    req: Request<any, any, TransactionBody>,
    res: Response
  ) {
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
      const { creditedAccountUsername, value } = TransactionSchema.parse(
        req.body
      );

      if (`@${creditedAccountUsername}` === user.username)
        return res
          .status(400)
          .json({ message: "Não é possível transferir para a própria conta" });

      const [debitedAccount, creditedAccount] = await Promise.all([
        prisma.account.findUnique({ where: { id: account.id } }),
        prisma.account.findFirst({
          where: { users: { username: `@${creditedAccountUsername}` } },
        }),
      ]);

      if (!debitedAccount || !creditedAccount)
        return res.status(404).json({ message: "Conta não encontrada" });

      if (debitedAccount.balance < value)
        return res.status(400).json({ message: "Saldo insuficiente" });

      const transaction = await prisma.transaction.create({
        data: {
          debitedAccount: { connect: { id: account.id } },
          creditedAccount: { connect: { id: creditedAccount.id } },
          value,
          type: "CashOut"
        },
      });
      await prisma.transaction.create({
        data: {
          debitedAccount: { connect: { id: account.id } },
          creditedAccount: { connect: { id: creditedAccount.id } },
          value,
          type: "CashIn"
        },
      });
      

      await prisma.account.update({
        where: { id: account.id },
        data: { balance: debitedAccount.balance - value },
      });
      
      await prisma.account.update({
        where: { id: creditedAccount.id },
        data: { balance: creditedAccount.balance + value },
        select: {transactions: { where: { }}}
      });

      return res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: any = {};
        error.errors.forEach((err) => {
          errors[err.path[0]] = err.message;
        });
        return res.status(400).json({ message: "Erro de validação", errors });
      } else {
        console.error(error);
        return res.status(500).send("Erro ao criar transação.");
      }
    }
  }
})();
