const mongoose = require("mongoose");

/**
 * Middleware que valida que req.params.id sea un ObjectId de MongoDB válido.
 * Si no lo es, devuelve un 400 sin llegar al controller ni al service.
 *
 * @type {import("express").RequestHandler}
 */
function validateMongoId(req, res, next) {
  const { id } = req.params;

  if (!id) return next(); // si la ruta no tiene :id, se salta

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error(`El ID proporcionado no es válido: "${id}"`);
    error.statusCode = 400;
    return next(error);
  }

  next();
}

module.exports = { validateMongoId };
