const express = require("express");
const CartManager = require("../managers/cart-manager.js");
const cartManager = new CartManager("./src/data/carts.json");
const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const nuevoCarrito = await cartManager.crearCarrito();
    res.send(nuevoCarrito);
  } catch (error) {
    res.status(500).send("Error interno del servidor");
  }
})


router.get("/:cid", async (req, res) => {
  let carritoId = parseInt(req.params.cid);

  try {
    const carritoBuscado = await cartManager.getCarritoById(carritoId);

    res.json(carritoBuscado.products);
  } catch (error) {
    res.status(500).send("Error interno del servidor");
  }
})



router.post("/:cid/product/:pid", async (req, res) => {
  const carritoId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  const quantity = req.body.quantity || 1;

  try {
    const carritoActualizado = await cartManager.agregarProductoAlCarrito(carritoId, productId, quantity);
    res.json(carritoActualizado.products);
  } catch (error) {
    res.status(500).send("Error interno del servidor");
  }
})


module.exports = router; 