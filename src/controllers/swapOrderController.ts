// Swap Order controller
import type { RequestHandler } from "express";
import type { RowDataPacket } from "mysql2/promise";
import type { SwapOrderFilters, SwapOrder } from "../types/index.js";
import {
  getSwapOrdersModel,
  createSwapOrderModel,
  updateSwapOrderModel,
  deleteSwapOrderModel,
} from "../models/swapOrderModel.js";

import { z } from "zod";
import validate from "../utils/validateUtil.js";
import validateId from "../utils/validateIdUtil.js";

const swapOrderInputSchema = z.object({
  productIds: z
    .array(z.number().int().positive())
    .min(1, "At least one product is required"),
  userIds: z
    .array(z.number().int().positive())
    .min(1, "At least one user is required"),
});

const getSwapOrdersController: RequestHandler = async (req, res, next) => {
  try {
    const filters: SwapOrderFilters = {
      startDate: req.query.startDate ? String(req.query.startDate) : undefined,
      endDate: req.query.endDate ? String(req.query.endDate) : undefined,
      productId: req.query.productId ? Number(req.query.productId) : undefined,
      userId: req.query.userId ? Number(req.query.userId) : undefined,
    };
    const swapOrdersRow = await getSwapOrdersModel(filters);
    const swapOrders = formatOrders(swapOrdersRow);
    res.status(200).json(swapOrders);
  } catch (err) {
    next(err);
  }
};

const createSwapOrderController: RequestHandler = async (req, res, next) => {
  try {
    const { productIds, userIds } = validate(swapOrderInputSchema, req.body);

    const orderId = await createSwapOrderModel(productIds, userIds);
    res.status(201).json({ id: orderId });
  } catch (err) {
    next(err);
  }
};

const updateSwapOrderController: RequestHandler = async (req, res, next) => {
  try {
    const orderId = Number(req.params.id);
    validateId(orderId);
    const { productIds, userIds } = validate(swapOrderInputSchema, req.body);

    await updateSwapOrderModel(orderId, productIds, userIds);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const deleteSwapOrderController: RequestHandler = async (req, res, next) => {
  try {
    const orderId = Number(req.params.id);
    validateId(orderId);
    await deleteSwapOrderModel(orderId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

/////////// Helpers ///////////

const formatOrders = (rowOrders: RowDataPacket[]): SwapOrder[] => {
  const ordersMap = new Map<number, SwapOrder>();

  rowOrders.forEach((row) => {
    if (!ordersMap.has(row.order_id)) {
      ordersMap.set(row.order_id, {
        id: row.order_id,
        createdAt: row.order_created_at,
        products: [],
        users: [],
      });
    }
    const order = ordersMap.get(row.order_id)!;
    order.products?.push({
      id: row.product_id,
      userId: row.user_id,
      name: row.product_name,
      createdAt: row.product_created_at,
    });

    order.users?.push({
      id: row.user_id,
      name: row.user_name,
      surname: row.user_surname,
      email: row.user_email,
      createdAt: row.user_created_at,
    });
  });
  return Array.from(ordersMap.values());
};

export {
  getSwapOrdersController,
  createSwapOrderController,
  updateSwapOrderController,
  deleteSwapOrderController,
};
