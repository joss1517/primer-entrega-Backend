const express = require("express");
const router = express.Router();
const ProductManager = require("../managers/product-manager.js");
const manager = new ProductManager("./src/data/products.json");

// Método GET para obtener productos con paginación, filtros y ordenamiento
router.get("/", async (req, res) => {
  let { limit = 10, page = 1, sort, query } = req.query;
  limit = parseInt(limit);
  page = parseInt(page);

  try {
    const arrayProductos = await manager.getProducts();

    // Filtrar productos por categoría o disponibilidad
    let filteredProducts = arrayProductos;
    if (query) {
      filteredProducts = arrayProductos.filter(product =>
        product.category === query ||
        (query === 'available' && product.availability)
      );
    }

    // Ordenar productos por precio si se especifica
    if (sort) {
      filteredProducts.sort((a, b) =>
        sort === 'asc' ? a.price - b.price : b.price - a.price
      );
    }

    // Paginación
    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // Formato de respuesta
    res.json({
      status: 'success',
      payload: paginatedProducts,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/products?page=${page - 1}&limit=${limit}&sort=${sort}&query=${query}` : null,
      nextLink: page < totalPages ? `/products?page=${page + 1}&limit=${limit}&sort=${sort}&query=${query}` : null,
    });
  } catch (error) {
    res.status(500).send("Error del servidor");
  }
});

// Método GET para obtener un producto por ID
router.get("/:pid", async (req, res) => {
  let id = req.params.pid;

  try {
    const productoBuscado = await manager.getProductById(parseInt(id));

    if (!productoBuscado) {
      res.send("Producto no encontrado");
    } else {
      res.send(productoBuscado);
    }

  } catch (error) {
    res.status(500).send("Error del servidor");
  }
});

// Método POST para agregar un nuevo producto
router.post("/", async (req, res) => {
  const nuevoProducto = req.body;

  try {
    await manager.addProduct(nuevoProducto);
    const productosActualizados = await manager.getProducts();
    io.emit('products', productosActualizados);
    res.status(201).send("Producto agregado exitosamente");
  } catch (error) {
    res.status(500).send("Error del servidor");
  }
});

// Método PUT para actualizar un producto
router.put("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const productoActualizado = req.body;

  try {
    await manager.updateProduct(id, productoActualizado);
    res.send("Producto actualizado exitosamente");
  } catch (error) {
    res.status(500).send("Error del servidor");
  }
});

// Método DELETE para eliminar un producto
router.delete("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);

  try {
    await manager.deleteProduct(id);
    const productosActualizados = await manager.getProducts();
    io.emit('products', productosActualizados);
    res.send("Producto eliminado exitosamente");
  } catch (error) {
    res.status(500).send("Error del servidor");
  }
});

module.exports = router;
