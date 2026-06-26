// User routes
import { Router } from "express";
import {
  getUserController,
  getAllUsersController,
  createUserController,
  updateUserController,
  deleteUserController,
} from "../controllers/userController.js";

const userRouter = Router();

userRouter.get("/", getAllUsersController);

userRouter.get("/:id", getUserController);

userRouter.post("/", createUserController);

userRouter.put("/:id", updateUserController);

userRouter.delete("/:id", deleteUserController);

export default userRouter;
