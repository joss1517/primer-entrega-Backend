const express = require("express");
const router = express.Router();
const ProductManager = require("../managers/product-manager.js");
const manager = new ProductManager("./src/data/products.json");


router.get("/", async (req, res) => {
  let limit = req.query.limit;

  try {
    const arrayProductos = await manager.getProducts();

    if (limit) {
      res.send(arrayProductos.slice(0, limit));
    } else {
      res.send(arrayProductos);
    }
  } catch (error) {
    res.status(500).send("Error del servidor")
  }
});


router.get("/:pid", async (req, res) => {
  let id = req.params.pid;

  try {
    const productoBuscado = await manager.getProductById(parseInt(id));

    if (!productoBuscado) {
      res.send("Producto no encontrado")
    } else {
      res.send(productoBuscado)
    }

  } catch (error) {
    res.status(500).send("Error del servidor")
  }
});


router.post("/", async (req, res) => {
  const nuevoProducto = req.body;


  try {
    await manager.addProduct(nuevoProducto);
    res.status(201).send("Producto agregado exitosamente");
  } catch (error) {
    res.status(500).send("Error del servidor")
  }
});


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


router.delete("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);

  try {
    await manager.deleteProduct(id);
    res.send("Producto eliminado exitosamente");
  } catch (error) {
    res.status(500).send("Error del servidor");
  }
});

module.exports = router;