import pool from "./config/db.js";
import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import swapOrderRouter from "./routes/swapOrderRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(errorMiddleware);

// endpoint routers
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/swap-orders", swapOrderRouter);
app.use("/uploads", express.static("uploads"));

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await pool.execute("SELECT 1");
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection error:", error);
  }
});
