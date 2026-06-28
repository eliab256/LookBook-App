// Swap Order routes
import { Router } from "express";
import {
  getSwapOrdersController,
  createSwapOrderController,
  updateSwapOrderController,
  deleteSwapOrderController,
} from "../controllers/swapOrderController.js";

const swapOrderRouter = Router();

swapOrderRouter.get("/", getSwapOrdersController);

swapOrderRouter.post("/", createSwapOrderController);

swapOrderRouter.put("/:id", updateSwapOrderController);

swapOrderRouter.delete("/:id", deleteSwapOrderController);

export default swapOrderRouter;
