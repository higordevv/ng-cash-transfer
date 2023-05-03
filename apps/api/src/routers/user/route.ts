import { IRouter, Router } from "express";
import UserController from "../../Controllers/UserController";
import JwtMiddleware from "../../middleware/JwtMiddleware";

const route: IRouter = Router();

route.post("/login", UserController.AuthenticateUser);
route.post("/register", UserController.RegisterUser);
route.get("/", JwtMiddleware, UserController.requestUserInfo);
route.get("/transactions", JwtMiddleware, UserController.getTransactionHistory);

export default route;
