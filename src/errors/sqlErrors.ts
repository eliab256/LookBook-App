const sqlErrors = {
  ER_DUP_ENTRY: {
    status: 409,
    code: "RESOURCE_ALREADY_EXISTS",
    message: "Resource already exists",
  },

  ER_NO_REFERENCED_ROW_2: {
    status: 400,
    code: "INVALID_REFERENCE",
    message: "Invalid reference",
  },

  ER_ROW_IS_REFERENCED_2: {
    status: 409,
    code: "RESOURCE_IN_USE",
    message: "Resource is in use and cannot be deleted",
  },

  ER_DATA_TOO_LONG: {
    status: 400,
    code: "DATA_TOO_LONG",
    message: "Data is too long",
  },
} as const;

export default sqlErrors;
