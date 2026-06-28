// Swap Order routes
import { Router } from "express";
import {
  createSwapOrderController,
  updateSwapOrderController,
  deleteSwapOrderController,
} from "../controllers/swapOrderController.js";

const swapOrderRouter = Router();

swapOrderRouter.post("/", createSwapOrderController);

swapOrderRouter.put("/:id", updateSwapOrderController);

swapOrderRouter.delete("/:id", deleteSwapOrderController);

export default swapOrderRouter;
