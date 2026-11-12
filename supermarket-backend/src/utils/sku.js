function generateSku(categoryName, productName) {
  const categoryPrefix = String(categoryName || "").replace(/[^a-zA-Z0-9]/g, "").slice(0, 3).toUpperCase() || "PRD";
  const namePrefix = String(productName || "").replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase() || "ITEM";

  return `${categoryPrefix}-${namePrefix}-${Date.now().toString().slice(-4)}`;
}

module.exports = { generateSku };
