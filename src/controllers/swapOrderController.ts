// Swap Order controller
import type { RequestHandler } from "express";
import {
  createSwapOrderModel,
  updateSwapOrderModel,
  deleteSwapOrderModel,
} from "../models/swapOrderModel.js";

const createSwapOrderController: RequestHandler = async (req, res, next) => {
  try {
    const { productIds, userIds } = req.body as {
      productIds: number[];
      userIds: number[];
    };

    const orderId = createSwapOrderModel(productIds, userIds);
    res.status(201).json({ id: orderId });
  } catch (err) {
    next(err);
  }
};

const updateSwapOrderController: RequestHandler = async (req, res, next) => {
  try {
    const orderId = Number(req.params.id);
    const { productIds, userIds } = req.body as {
      productIds: number[];
      userIds: number[];
    };

    updateSwapOrderModel(orderId, productIds, userIds);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const deleteSwapOrderController: RequestHandler = async (req, res, next) => {
  try {
    const orderId = Number(req.params.id);
    await deleteSwapOrderModel(orderId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export {
  createSwapOrderController,
  updateSwapOrderController,
  deleteSwapOrderController,
};
