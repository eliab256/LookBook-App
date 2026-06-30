// Product controller
import type { RequestHandler } from "express";
import {
  getAllProductsModel,
  getProductByIdModel,
  createProductModel,
  deleteProductModel,
  updateProductModel,
} from "../models/productModel.js";
import AppError from "../errors/AppErrors.js";
import validateId from "../utils/validateIdUtil.js";

const getProductController: RequestHandler = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    validateId(productId);
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
    avoidPorductWithoutPhotos(photos);
    const productId = await createProductModel(name, userId, photos);
    res.status(201).json({ id: productId });
  } catch (err) {
    next(err);
  }
};

const updateProductController: RequestHandler = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    validateId(productId);
    const { name } = req.body;
    const photos = (req.files as Express.Multer.File[]).map(
      (file) => file.path,
    );
    avoidPorductWithoutPhotos(photos);

    await updateProductModel(name, productId, photos);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const deleteProductController: RequestHandler = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    validateId(productId);
    await deleteProductModel(productId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

////// helpers /////

/// @dev Accept any as input type to be able to manage all possible wrong scenario with AppError
const avoidPorductWithoutPhotos = (photos: any) => {
  if (!Array.isArray(photos) || photos.length === 0) {
    throw new AppError(
      400,
      "At least one photo is required",
      "PHOTOS_REQUIRED",
    );
  }
};

export {
  getProductController,
  getAllProductsController,
  createProductController,
  updateProductController,
  deleteProductController,
};
