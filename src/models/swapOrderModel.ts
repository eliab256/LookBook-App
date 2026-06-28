// Swap Order model
import type { PoolConnection, ResultSetHeader } from "mysql2/promise";
import pool from "../config/db.js";

const createSwapOrderModel = async (
  productIds: number[],
  userIds: number[],
): Promise<number> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.execute<ResultSetHeader>(
      "INSERT INTO swap_orders () VALUES ()",
    );
    const orderId = result.insertId;
    await insertOrderProducts(connection, orderId, productIds);
    await insertOrderUsers(connection, orderId, userIds);
    await connection.commit();

    return orderId;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

const updateSwapOrderModel = async (
  orderId: number,
  productIds: number[],
  userIds: number[],
): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute(
      "DELETE FROM swap_order_products WHERE order_id = ?",
      [orderId],
    );
    await connection.execute(
      "DELETE FROM swap_order_users WHERE order_id = ?",
      [orderId],
    );
    await insertOrderProducts(connection, orderId, productIds);
    await insertOrderUsers(connection, orderId, userIds);
    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

const deleteSwapOrderModel = async (orderId: number): Promise<void> => {
  const [result] = await pool.execute<ResultSetHeader>(
    "DELETE FROM swap_orders WHERE id = ?",
    [orderId],
  );

  if (result.affectedRows === 0) {
    throw new Error("Swap order not found");
  }
};

// internal helpers
const insertOrderProducts = async (
  connection: PoolConnection,
  orderId: number,
  productIds: number[],
): Promise<void> => {
  await Promise.all(
    productIds.map((productId) =>
      connection.execute(
        "INSERT INTO swap_order_products (order_id, product_id) VALUES (?, ?)",
        [orderId, productId],
      ),
    ),
  );
};

const insertOrderUsers = async (
  connection: PoolConnection,
  orderId: number,
  userIds: number[],
): Promise<void> => {
  await Promise.all(
    userIds.map((userId) =>
      connection.execute(
        "INSERT INTO swap_order_users (order_id, user_id) VALUES (?, ?)",
        [orderId, userId],
      ),
    ),
  );
};

export { createSwapOrderModel, updateSwapOrderModel, deleteSwapOrderModel };
