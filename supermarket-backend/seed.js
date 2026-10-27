/**
 * Seed del supermercado.
 * Uso:  node seed.js
 * Requiere: mongoose (y opcionalmente bcryptjs para hashear contraseñas).
 * Variable de entorno: MONGODB_URI (por defecto mongodb://127.0.0.1:27017/supermercado)
 *
 * Coloca este archivo junto a la carpeta /models.
 * ATENCIÓN: borra el contenido de todas las colecciones antes de insertar.
 */
const mongoose = require("mongoose");
const crypto = require("crypto");
const { Category, Brand, Product, Image, Role, User } = require("./src/models");
const { generateSlug } = require("./src/utils/slug");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/supermarket";

// ---------- Utilidades ----------
function hashPassword(plain) {
  try {
    const bcrypt = require("bcryptjs");
    return bcrypt.hashSync(plain, 10);
  } catch (_) {
    // Fallback sin dependencias externas (scrypt)
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.scryptSync(plain, salt, 64).toString("hex");
    return `scrypt$${salt}$${hash}`;
  }
}

const snapshot = (doc) => ({ id: doc._id, slug: doc.slug, name: doc.name });
const published = { is_active: true, status: "published" };

// ---------- Datos ----------
const rolesData = [
  { name: "Cliente", permissions: ["products:read", "orders:create", "orders:read:own"], ...published },
  { name: "Gestor de inventario", permissions: ["products:read", "products:write", "variants:write", "stock:update"], ...published },
  { name: "Admin de tienda", permissions: ["*"], ...published }
];

const parentCategories = [
  { name: "Lácteos", description: "Leche, yogures, quesos y derivados" },
  { name: "Frutas y verduras", description: "Producto fresco de temporada" },
  { name: "Panadería", description: "Pan y bollería" },
  { name: "Bebidas", description: "Aguas, refrescos y zumos" },
  { name: "Despensa", description: "Pasta, arroz, aceites y conservas" }
];

const childCategories = [
  { name: "Leche", parent: "Lácteos" },
  { name: "Yogures", parent: "Lácteos" },
  { name: "Frutas", parent: "Frutas y verduras" },
  { name: "Verduras", parent: "Frutas y verduras" },
  { name: "Pan", parent: "Panadería" },
  { name: "Agua", parent: "Bebidas" },
  { name: "Refrescos", parent: "Bebidas" },
  { name: "Pasta y arroz", parent: "Despensa" },
  { name: "Aceites", parent: "Despensa" }
];

const brandsData = [
  { name: "Puleva" },
  { name: "Danone" },
  { name: "Bimbo" },
  { name: "Font Vella" },
  { name: "Coca-Cola" },
  { name: "Gallo" },
  { name: "Carbonell" },
  { name: "Hacendado" }
];

const productsData = [
  {
    name: "Leche entera",
    description: "Leche de vaca entera UHT. Fuente de calcio y proteínas.",
    category: "Leche", brand: "Puleva",
    variants: [
      { sku: "LECH-ENT-1L", price: 1.15, stock: 240, attributes: { volumen: "1 L", unidades: 1 } },
      { sku: "LECH-ENT-6X1L", price: 6.49, stock: 80, attributes: { volumen: "1 L", unidades: 6 } }
    ]
  },
  {
    name: "Leche semidesnatada",
    description: "Leche semidesnatada UHT, baja en grasa.",
    category: "Leche", brand: "Puleva",
    variants: [
      { sku: "LECH-SEM-1L", price: 1.1, stock: 200, attributes: { volumen: "1 L", unidades: 1 } },
      { sku: "LECH-SEM-6X1L", price: 6.29, stock: 60, attributes: { volumen: "1 L", unidades: 6 } }
    ]
  },
  {
    name: "Yogur natural",
    description: "Yogur natural sin azúcares añadidos.",
    category: "Yogures", brand: "Danone",
    variants: [
      { sku: "YOG-NAT-4U", price: 1.45, stock: 150, attributes: { peso: "125 g", unidades: 4 } },
      { sku: "YOG-NAT-8U", price: 2.69, stock: 90, attributes: { peso: "125 g", unidades: 8 } }
    ]
  },
  {
    name: "Yogur de fresa",
    description: "Yogur cremoso con trozos de fresa.",
    category: "Yogures", brand: "Danone", status: "draft", is_active: false,
    variants: [
      { sku: "YOG-FRE-4U", price: 1.65, stock: 0, attributes: { peso: "125 g", unidades: 4 }, is_active: false, status: "inactive" }
    ]
  },
  {
    name: "Plátano de Canarias",
    description: "Plátano de Canarias IGP, maduración natural.",
    category: "Frutas", brand: "Hacendado",
    variants: [
      { sku: "FRU-PLA-KG", price: 2.35, stock: 120, attributes: { peso: "1 kg" } },
      { sku: "FRU-PLA-500G", price: 1.29, stock: 70, attributes: { peso: "500 g" } }
    ]
  },
  {
    name: "Naranjas de mesa",
    description: "Naranjas de la Comunitat Valenciana, ideales para comer.",
    category: "Frutas", brand: "Hacendado",
    variants: [
      { sku: "FRU-NAR-2KG", price: 2.99, stock: 95, attributes: { peso: "2 kg" } },
      { sku: "FRU-NAR-5KG", price: 6.5, stock: 40, attributes: { peso: "5 kg" } }
    ]
  },
  {
    name: "Tomate pera",
    description: "Tomate pera para ensalada y cocinar.",
    category: "Verduras", brand: "Hacendado",
    variants: [{ sku: "VER-TOM-KG", price: 1.89, stock: 110, attributes: { peso: "1 kg" } }]
  },
  {
    name: "Pan de molde integral",
    description: "Pan de molde integral en rebanadas, con semillas.",
    category: "Pan", brand: "Bimbo",
    variants: [
      { sku: "PAN-INT-450G", price: 2.15, stock: 85, attributes: { peso: "450 g", rebanadas: 17 } },
      { sku: "PAN-INT-675G", price: 2.89, stock: 50, attributes: { peso: "675 g", rebanadas: 25 } }
    ]
  },
  {
    name: "Agua mineral natural",
    description: "Agua mineral natural de baja mineralización.",
    category: "Agua", brand: "Font Vella",
    variants: [
      { sku: "AGU-FV-1_5L", price: 0.55, stock: 500, attributes: { volumen: "1,5 L", unidades: 1 } },
      { sku: "AGU-FV-6X1_5L", price: 2.95, stock: 160, attributes: { volumen: "1,5 L", unidades: 6 } },
      { sku: "AGU-FV-5L", price: 1.25, stock: 100, attributes: { volumen: "5 L", unidades: 1 } }
    ]
  },
  {
    name: "Coca-Cola Zero",
    description: "Refresco de cola sin azúcar.",
    category: "Refrescos", brand: "Coca-Cola",
    variants: [
      { sku: "COC-ZERO-33CL", price: 0.89, stock: 320, attributes: { volumen: "33 cl", formato: "lata" } },
      { sku: "COC-ZERO-2L", price: 2.1, stock: 140, attributes: { volumen: "2 L", formato: "botella" } },
      { sku: "COC-ZERO-24X33CL", price: 15.9, stock: 30, attributes: { volumen: "33 cl", formato: "lata", unidades: 24 } }
    ]
  },
  {
    name: "Espaguetis nº 5",
    description: "Pasta de sémola de trigo duro, cocción 9 minutos.",
    category: "Pasta y arroz", brand: "Gallo",
    variants: [
      { sku: "PAS-ESP-500G", price: 1.35, stock: 210, attributes: { peso: "500 g" } },
      { sku: "PAS-ESP-1KG", price: 2.49, stock: 100, attributes: { peso: "1 kg" } }
    ]
  },
  {
    name: "Aceite de oliva virgen extra",
    description: "Aceite de oliva virgen extra, primera prensada en frío.",
    category: "Aceites", brand: "Carbonell",
    variants: [
      { sku: "ACE-AOVE-500ML", price: 5.99, stock: 130, attributes: { volumen: "500 ml" } },
      { sku: "ACE-AOVE-1L", price: 10.95, stock: 90, attributes: { volumen: "1 L" } },
      { sku: "ACE-AOVE-5L", price: 49.9, stock: 15, attributes: { volumen: "5 L" } }
    ]
  },
  {
    name: "Arroz bomba",
    description: "Arroz bomba ideal para paella.",
    category: "Pasta y arroz", brand: "Hacendado", status: "archived", is_active: false,
    deleted_at: new Date(),
    variants: [
      { sku: "ARR-BOM-1KG", price: 3.2, stock: 0, attributes: { peso: "1 kg" }, is_active: false, status: "inactive", deleted_at: new Date() }
    ]
  }
];

const usersData = [
  { email: "admin@supermercado.com", full_name: "Admin Tienda", roles: ["Admin de tienda"], password: "Admin1234!" },
  { email: "inventario@supermercado.com", full_name: "Laura Inventario", roles: ["Gestor de inventario"], password: "Inventario1234!" },
  { email: "ana.garcia@example.com", full_name: "Ana García", roles: ["Cliente"], password: "Cliente1234!" },
  { email: "carlos.lopez@example.com", full_name: "Carlos López", roles: ["Cliente"], password: "Cliente1234!" },
  { email: "marta.perez@example.com", full_name: "Marta Pérez", roles: ["Cliente"], password: "Cliente1234!", is_active: false, status: "inactive" }
];

// ---------- Seed ----------
async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log(`Conectado a ${MONGODB_URI}`);

  // Limpieza (y reconstrucción de índices por si cambiaron)
  await Promise.all([Category, Brand, Product, Image, Role, User].map((M) => M.deleteMany({})));
  await Promise.all([Category, Brand, Product, Image, Role, User].map((M) => M.syncIndexes()));
  console.log("Colecciones limpiadas");

  // Roles
  const roles = await Role.create(rolesData);
  const roleByName = Object.fromEntries(roles.map((r) => [r.name, r]));

  // Usuarios
  const users = await User.create(
    usersData.map(({ roles: roleNames, password, ...u }) => ({
      is_active: true,
      status: "published",
      ...u,
      password: hashPassword(password),
      role_ids: roleNames.map((n) => roleByName[n]._id)
    }))
  );

  // Categorías (primero padres, luego hijas con parent_id)
  const parents = await Category.create(parentCategories.map((c) => ({ ...c, ...published })));
  const parentByName = Object.fromEntries(parents.map((c) => [c.name, c]));
  const children = await Category.create(
    childCategories.map(({ name, parent }) => ({
      name,
      parent_id: parentByName[parent]._id,
      ...published
    }))
  );
  const categoryByName = Object.fromEntries([...parents, ...children].map((c) => [c.name, c]));

  // Marcas
  const brands = await Brand.create(brandsData.map((b) => ({ ...b, ...published })));
  const brandByName = Object.fromEntries(brands.map((b) => [b.name, b]));

  // Productos (con category/brand desnormalizados, variantes e imágenes embebidas)
  const products = await Product.create(
    productsData.map(({ category, brand, ...p }) => {
      const slug = generateSlug(p.name);
      return {
        is_active: true,
        status: "published",
        ...p,
        category: snapshot(categoryByName[category]),
        brand: snapshot(brandByName[brand]),
        variants: p.variants.map((v) => ({ is_active: true, status: "published", ...v })),
        images: [
          { url: `https://cdn.supermercado.com/products/${slug}-1.jpg`, alt_text: `${p.name} - vista principal` },
          { url: `https://cdn.supermercado.com/products/${slug}-2.jpg`, alt_text: `${p.name} - detalle` }
        ]
      };
    })
  );

  // Imágenes centralizadas (colección polimórfica) para product, category y brand
  const imageDocs = [
    ...products.map((p) => ({
      url: `https://cdn.supermercado.com/products/${p.slug}-1.jpg`,
      entity_type: "product",
      entity_id: p._id,
      alt_text: `${p.name} - vista principal`
    })),
    ...[...parents, ...children].map((c) => ({
      url: `https://cdn.supermercado.com/categories/${c.slug}.jpg`,
      entity_type: "category",
      entity_id: c._id,
      alt_text: `Categoría ${c.name}`
    })),
    ...brands.map((b) => ({
      url: `https://cdn.supermercado.com/brands/${b.slug}.png`,
      entity_type: "brand",
      entity_id: b._id,
      alt_text: `Logo ${b.name}`
    }))
  ].map((i) => ({ ...i, ...published }));
  const images = await Image.create(imageDocs);

  console.log("Seed completado:");
  console.log(`  Roles:      ${roles.length}`);
  console.log(`  Usuarios:   ${users.length}`);
  console.log(`  Categorías: ${parents.length + children.length} (${parents.length} raíz, ${children.length} subcategorías)`);
  console.log(`  Marcas:     ${brands.length}`);
  console.log(`  Productos:  ${products.length}`);
  console.log(`  Imágenes:   ${images.length}`);
}

seed()
  .catch((err) => {
    console.error("Error en el seed:", err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
