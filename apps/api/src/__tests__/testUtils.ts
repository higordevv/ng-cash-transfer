import express, { Express } from "express";
import UserRouter from "../routers/user/route";

const app: Express = express();

app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(UserRouter);

export default app;
