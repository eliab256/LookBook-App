import AppError from "../errors/AppErrors.js";

const validateId = (id: number) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, "Invalid id", "INVALID_ID");
  }
};

export default validateId;
