import { IRouter, Router } from "express";
import UserController from "../../Controllers/UserController";

const route: IRouter = Router();

route.post("/", UserController.CREATE);
route.get("/");

export default route;
