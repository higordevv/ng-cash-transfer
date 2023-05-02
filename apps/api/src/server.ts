import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import UserRouter from "./routers/user/route";
import Transactions from "./routers/transactions/route";

class NgCashTransfer {
  readonly app: Express;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.app.disable("x-powered-by");
    this.app.use(morgan("dev"));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    const corsOptions: CorsOptions = {
      origin: "http://localhost:3000",
      credentials: true,
    };
    this.app.use(cors(corsOptions));
    this.app.use(cookieParser());
  }

  private routes(): void {
    this.app.use("/user", UserRouter);
    this.app.use("/transaction", Transactions);
  }
}

export default new NgCashTransfer().app;
