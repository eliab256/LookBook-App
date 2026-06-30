// Product model
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import type { Product } from "../types/index.js";
import AppError from "../errors/AppErrors.js";

const getAllProductsModel = async (): Promise<Product[]> => {
  const [result] = await pool.execute<Product[] & RowDataPacket[]>(
    "SELECT * FROM products",
  );

  return result;
};

const getProductByIdModel = async (productId: number): Promise<Product> => {
  const [result] = await pool.execute<Product[] & RowDataPacket[]>(
    "SELECT * FROM products WHERE id = ?",
    [productId],
  );

  if (result.length === 0) {
    throw new AppError(404, "Product not found", "PRODUCT_NOT_FOUND");
  }

  return result[0];
};

const createProductModel = async (
  name: string,
  userId: number,
  photos: string[],
): Promise<number> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.execute<ResultSetHeader>(
      "INSERT INTO products (name, user_id) VALUES (?, ?)",
      [name, userId],
    );

    const product_id = result.insertId;

    await Promise.all(
      photos.map((path) =>
        connection.execute<ResultSetHeader>(
          "INSERT INTO product_photos (product_id, path) VALUES (?, ?)",
          [product_id, path],
        ),
      ),
    );

    await connection.commit();
    return product_id;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

/**
 * @notice this function will delete all older photos and insert new ones
 * @param name
 * @param id
 * @param photos
 */
const updateProductModel = async (
  name: string,
  productId: number,
  photos: string[],
): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.execute<ResultSetHeader>(
      "UPDATE products SET name = ? WHERE id = ?",
      [name, productId],
    );

    if (result.affectedRows === 0) {
      throw new AppError(404, "Product not found", "PRODUCT_NOT_FOUND");
    }

    await connection.execute(
      "DELETE FROM product_photos WHERE product_id = ?",
      [productId],
    );

    await Promise.all(
      photos.map((path) =>
        connection.execute<ResultSetHeader>(
          "INSERT INTO product_photos (product_id, path) VALUES (?, ?)",
          [productId, path],
        ),
      ),
    );

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

const deleteProductModel = async (productId: number): Promise<void> => {
  const [orders] = await pool.execute<RowDataPacket[]>(
    "SELECT 1 FROM swap_order_products WHERE product_id = ? LIMIT 1",
    [productId],
  );

  if (orders.length > 0) {
    throw new AppError(
      409,
      "Product is part of a swap order and cannot be deleted",
      "PRODUCT_IN_USE",
    );
  }

  const [result] = await pool.execute<ResultSetHeader>(
    "DELETE FROM products WHERE id = ?",
    [productId],
  );

  if (result.affectedRows === 0) {
    throw new AppError(404, "Product not found", "PRODUCT_NOT_FOUND");
  }
};

export {
  getAllProductsModel,
  getProductByIdModel,
  createProductModel,
  updateProductModel,
  deleteProductModel,
};
