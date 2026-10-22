function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
}

function errorHandler(error, req, res, next) {
  console.error(error);

  // ── Errores de validación de Zod ────────────────────────────────────────────
  if (error.isZodError) {
    return res.status(400).json({
      success: false,
      message: error.message,
      errors: error.errors
    });
  }

  // ── Errores de validación de Mongoose ───────────────────────────────────────
  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Error de validación",
      errors: Object.values(error.errors).map((item) => item.message)
    });
  }

  // ── Duplicado de clave única (MongoDB) ──────────────────────────────────────
  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Registro duplicado"
    });
  }

  // ── Error genérico ───────────────────────────────────────────────────────────
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Error interno del servidor"
  });
}

module.exports = { notFound, errorHandler };
