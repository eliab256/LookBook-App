// Product controller
import type { RequestHandler } from "express";
import {
  getAllProductsModel,
  getProductByIdModel,
  createProductModel,
  deleteProductModel,
  updateProductModel,
} from "../models/productModel.js";

const getProductController: RequestHandler = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    const product = await getProductByIdModel(productId);
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

const getAllProductsController: RequestHandler = async (req, res, next) => {
  try {
    const products = await getAllProductsModel();
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

const createProductController: RequestHandler = async (req, res, next) => {
  try {
    const { name, userId } = req.body;
    const photos = (req.files as Express.Multer.File[]).map(
      (file) => file.path,
    );
    const productId = await createProductModel(name, userId, photos);
    res.status(201).json({ id: productId });
  } catch (err) {
    next(err);
  }
};

const updateProductController: RequestHandler = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    const { name } = req.body;
    const photos = (req.files as Express.Multer.File[]).map(
      (file) => file.path,
    );
    await updateProductModel(name, productId, photos);
    res.status(204).send;
  } catch (err) {
    next(err);
  }
};

const deleteProductController: RequestHandler = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    await deleteProductModel(productId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export {
  getProductController,
  getAllProductsController,
  createProductController,
  updateProductController,
  deleteProductController,
};
