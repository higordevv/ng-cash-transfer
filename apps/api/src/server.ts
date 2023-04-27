import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import { log } from "logger";

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
    this.app.use(cors());
  }

  private routes(): void {}
}

export default new NgCashTransfer().app;
