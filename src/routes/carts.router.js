// src/routes/carts.router.js
const express = require('express');
const Cart = require('../models/cart.model.js');
const router = express.Router();

router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    res.render('cart', { cart });
  } catch (error) {
    res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
  }
});

router.put('/carts/:cid', async (req, res) => {
  try {
    const cart = await Cart.findByIdAndUpdate(req.params.cid, { products: req.body.products }, { new: true });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.delete('/carts/:cid/products/:pid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    cart.products = cart.products.filter(p => p.product.toString() !== req.params.pid);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
