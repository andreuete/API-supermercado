require("dotenv").config();

const connectDB = require("./src/config/database");
const Product = require("./src/models/product.model");

const products = [
  {
    nombre: "Leche entera",
    categoria: "Lácteos",
    precio: 1.25,
    stock: 40,
    marca: "Central Lechera",
    descripcion: "Leche entera pasteurizada.",
    slug: "leche-entera",
    isActive: true,
    status: "active",
    createdAt: null,
    updatedAt: null,
    deletedAt: null
  },
  {
    nombre: "Pan de molde",
    categoria: "Panadería",
    precio: 1.89,
    stock: 25,
    marca: "PanCasa",
    descripcion: "Pan de molde blanco en rebanadas.",
    slug: "pan-de-molde",
    isActive: true,
    status: "active",
    createdAt: null,
    updatedAt: null,
    deletedAt: null
  },
  {
    nombre: "Arroz largo",
    categoria: "Despensa",
    precio: 2.15,
    stock: 60,
    marca: "Campo Real",
    descripcion: "Arroz de grano largo.",
    slug: "arroz-largo",
    isActive: true,
    status: "active",
    createdAt: null,
    updatedAt: null,
    deletedAt: null
  },
  {
    nombre: "Aceite de oliva virgen extra",
    categoria: "Aceites",
    precio: 8.95,
    stock: 18,
    marca: "Olivar",
    descripcion: "Aceite de oliva virgen extra de 1 litro.",
    slug: "aceite-de-oliva-virgen-extra",
    isActive: true,
    status: "active",
    createdAt: null,
    updatedAt: null,
    deletedAt: null
  },
  {
    nombre: "Tomate triturado",
    categoria: "Conservas",
    precio: 1.49,
    stock: 35,
    marca: "Huerta Viva",
    descripcion: "Tomate triturado natural.",
    slug: "tomate-triturado",
    isActive: false,
    status: "inactive",
    createdAt: null,
    updatedAt: null,
    deletedAt: null
  },
  {
    nombre: "Huevos tamaño M",
    categoria: "Huevos",
    precio: 2.75,
    stock: 30,
    marca: "Granja Sol",
    descripcion: "Docena de huevos tamaño M.",
    slug: "huevos-tamano-m",
    isActive: true,
    status: "active",
    createdAt: null,
    updatedAt: null,
    deletedAt: null
  },
  {
    nombre: "Manzana Golden",
    categoria: "Frutas",
    precio: 2.49,
    stock: 50,
    marca: "Finca Verde",
    descripcion: "Manzanas Golden frescas.",
    slug: "manzana-golden",
    isActive: true,
    status: "active",
    createdAt: null,
    updatedAt: null,
    deletedAt: null
  },
  {
    nombre: "Agua mineral",
    categoria: "Bebidas",
    precio: 3.2,
    stock: 45,
    marca: "Fuente Clara",
    descripcion: "Pack de seis botellas de agua mineral.",
    slug: "agua-mineral",
    isActive: true,
    status: "active",
    createdAt: null,
    updatedAt: null,
    deletedAt: null
  }
];

async function seed() {
  try {
    await connectDB();
    await Product.deleteMany({});
    const inserted = await Product.insertMany(products);
    console.log(`Seed completado: ${inserted.length} productos insertados.`);
  } catch (error) {
    console.error("Error ejecutando seed:", error);
    process.exitCode = 1;
  } finally {
    const mongoose = require("mongoose");
    await mongoose.connection.close();
  }
}

seed();
