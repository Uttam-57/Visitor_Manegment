import { ZodError } from "zod";

export const validateRequest = (schema) => async (req, res, next) => {
  try {
    const parsed = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    if (parsed.body) req.body = parsed.body;
    if (parsed.query) Object.assign(req.query, parsed.query);
    if (parsed.params) Object.assign(req.params, parsed.params);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.errors.map((e) => ({ path: e.path.join("."), message: e.message })),
      });
    }
    next(error);
  }
};

// Aliasing validateRequest as validate to not break auth routes
export const validate = validateRequest;