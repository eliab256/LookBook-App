// Product routes
import { Router } from "express";
import uploadMiddleware from "../middlewares/uploadMiddleware.js";
import {
  getProductController,
  getAllProductsController,
  createProductController,
  updateProductController,
  deleteProductController,
} from "../controllers/productController.js";

const productRouter = Router();

productRouter.get("/", getAllProductsController);

productRouter.get("/:id", getProductController);

productRouter.post("/", uploadMiddleware, createProductController);

productRouter.put("/:id", uploadMiddleware, updateProductController);

productRouter.delete("/:id", deleteProductController);

export default productRouter;
