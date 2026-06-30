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

  ER_BAD_NULL_ERROR: {
    status: 400,
    code: "MISSING_REQUIRED_FIELD",
    message: "A required field is missing",
  },

  ER_TRUNCATED_WRONG_VALUE_FOR_FIELD: {
    status: 400,
    code: "INVALID_FIELD_VALUE",
    message: "Invalid value for one or more fields",
  },

  WARN_DATA_OUT_OF_RANGE: {
    status: 400,
    code: "VALUE_OUT_OF_RANGE",
    message: "Value is out of allowed range",
  },

  // --- Errori del server / connessione (non da esporre con dettagli, status 5xx) ---
  ER_PARSE_ERROR: {
    status: 500,
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal server error",
  },

  ECONNREFUSED: {
    status: 503,
    code: "DATABASE_UNAVAILABLE",
    message: "Database connection refused",
  },

  PROTOCOL_CONNECTION_LOST: {
    status: 503,
    code: "DATABASE_UNAVAILABLE",
    message: "Database connection lost",
  },

  ER_CON_COUNT_ERROR: {
    status: 503,
    code: "DATABASE_UNAVAILABLE",
    message: "Too many database connections",
  },

  ETIMEDOUT: {
    status: 503,
    code: "DATABASE_TIMEOUT",
    message: "Database connection timed out",
  },

  ER_LOCK_DEADLOCK: {
    status: 409,
    code: "TRANSACTION_CONFLICT",
    message: "Transaction conflict, please retry",
  },

  ER_LOCK_WAIT_TIMEOUT: {
    status: 503,
    code: "DATABASE_BUSY",
    message: "Database operation timed out, please retry",
  },
} as const;

export default sqlErrors;
