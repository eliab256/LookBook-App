// Swap Order model
import type {
  PoolConnection,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";
import type { SwapOrderFilters as Filters } from "../types/index.js";
import pool from "../config/db.js";

type Param = string | number;

const getSwapOrdersModel = async (
  filters?: Filters,
): Promise<RowDataPacket[]> => {
  const { conditions, params } = createConditionsAndParams(filters);

  const where =
    conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT 
      swap_orders.id AS order_id,
      swap_orders.created_at AS order_created_at,
      products.id AS product_id,
      products.name AS product_name,
      products.created_at AS product_created_at,
      users.id AS user_id,
      users.name AS user_name,
      users.surname AS user_surname,
      users.email AS user_email,
      users.created_at AS user_created_at
    FROM swap_orders
    JOIN swap_order_products ON swap_orders.id = swap_order_products.order_id
    JOIN products ON swap_order_products.product_id = products.id
    JOIN swap_order_users ON swap_orders.id = swap_order_users.order_id
    JOIN users ON swap_order_users.user_id = users.id
     ${where}`,
    params,
  );

  return rows;
};

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

const createConditionsAndParams = (
  filters?: Filters,
): { conditions: string[]; params: Param[] } => {
  const conditions: string[] = [];
  const params: Param[] = [];

  if (filters?.startDate) {
    conditions.push("so.created_at >= ?");
    params.push(filters.startDate);
  }
  if (filters?.endDate) {
    conditions.push("so.created_at <= ?");
    params.push(filters.endDate);
  }
  if (filters?.productId) {
    conditions.push("p.id = ?");
    params.push(filters.productId);
  }
  if (filters?.userId) {
    conditions.push("u.id = ?");
    params.push(filters.userId);
  }

  return { conditions, params };
};

export {
  getSwapOrdersModel,
  createSwapOrderModel,
  updateSwapOrderModel,
  deleteSwapOrderModel,
};
