const { ZodError } = require("zod");

/**
 * Middleware factory que valida req.body contra un esquema Zod.
 * Si la validación falla, lanza un error 400 que captura el errorHandler central.
 *
 * @param {import("zod").ZodSchema} schema - Esquema Zod a aplicar
 * @returns {import("express").RequestHandler}
 */
function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // Construimos un error estándar para que lo capture el errorHandler central
      const validationError = new Error("Error de validación de los datos enviados");
      validationError.statusCode = 400;
      validationError.isZodError = true;
      // Extraemos los mensajes de cada campo inválido de manera legible
      validationError.errors = result.error.errors.map((e) => ({
        campo: e.path.join(".") || "body",
        mensaje: e.message
      }));
      return next(validationError);
    }

    // Sustituimos req.body por los datos validados (coerción de tipos aplicada)
    req.body = result.data;
    next();
  };
}

module.exports = { validateBody };
