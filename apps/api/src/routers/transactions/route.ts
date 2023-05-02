import { IRouter, Router } from "express";
import JwtMiddleware from "../../middleware/JwtMiddleware";
import TransactionController from "../../Controllers/TransactionController";

const route: IRouter = Router();

route.post("/make", JwtMiddleware, TransactionController.createTransaction);
route.get("/");

export default route;
