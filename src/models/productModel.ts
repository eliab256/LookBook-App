// Product model
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import type { Product } from "../types/index.js";

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
    throw new Error("get product by id failed");
  }

  return result[0];
};

const createProductModel = async (
  name: string,
  userId: number,
  photos: string[],
): Promise<number> => {
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO products (name, user_id) VALUES (?, ?)",
    [name, userId],
  );

  if (result.affectedRows === 0) {
    throw new Error("create product failed");
  }

  const product_id = result.insertId;

  await Promise.all(
    photos.map((path) =>
      pool.execute<ResultSetHeader>(
        "INSERT INTO product_photos (product_id, path) VALUES (?, ?)",
        [product_id, path],
      ),
    ),
  );
  return product_id;
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
  const [result] = await pool.execute<ResultSetHeader>(
    "UPDATE products SET name = ? WHERE id = ?",
    [name, productId],
  );

  if (result.affectedRows === 0) {
    throw new Error("Product not found");
  }

  await pool.execute("DELETE FROM product_photos WHERE product_id = ?", [
    productId,
  ]);

  await Promise.all(
    photos.map((path) =>
      pool.execute<ResultSetHeader>(
        "INSERT INTO product_photos (product_id, path) VALUES (?, ?)",
        [productId, path],
      ),
    ),
  );
};

const deleteProductModel = async (productId: number): Promise<void> => {
  const [result] = await pool.execute<ResultSetHeader>(
    "DELETE FROM products WHERE id = ?",
    [productId],
  );

  if (result.affectedRows === 0) {
    throw new Error("Product not found");
  }
};

export {
  getAllProductsModel,
  getProductByIdModel,
  createProductModel,
  updateProductModel,
  deleteProductModel,
};
