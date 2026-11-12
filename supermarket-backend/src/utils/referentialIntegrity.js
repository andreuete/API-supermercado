async function assertNoReferences(entityName, references) {
  const relatedEntities = await Promise.all(
    references.map(async ({ exists, label }) => {
      return (await exists) ? label : null;
    })
  );
  const blockers = relatedEntities.filter(Boolean);

  if (blockers.length > 0) {
    const error = new Error(
      `No se puede eliminar ${entityName} porque está referenciado por ${blockers.join(", ")}`
    );
    error.statusCode = 409;
    throw error;
  }
}

module.exports = { assertNoReferences };
