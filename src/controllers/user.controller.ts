import {Router} from "express";
import UserService from "../service/user.service";
import auth from "../middlewares/authMiddleware";

export const userRouter = Router();

userRouter.post('/create-user' , UserService.createUser);
userRouter.post('/login' , UserService.loginUser);
userRouter.get("/get-all-user" , UserService.getAllUser);