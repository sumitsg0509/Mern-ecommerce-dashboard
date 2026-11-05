const ApiError = require("../utils/ApiError");

// Validates req.body against a Zod schema.
// Zod strips unknown keys by default, which also blocks NoSQL operator injection.
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const issue = result.error.issues[0];
    return next(new ApiError(400, issue.message));
  }

  req.body = result.data;
  next();
};

module.exports = validate;
