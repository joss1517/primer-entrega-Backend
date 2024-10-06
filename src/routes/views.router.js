const express = require('express')
const router = express.Router();
const ProductManager = require('../managers/product-manager.js');
const manager = new ProductManager('./src/data/products.json')


// 1) Punto 1 - Segunda pre entrega:
router.get('/products', async (req, res) => {
  try {
    // Tengo que recuperar todos los productos y mandarlos a la vista:
    const products = await manager.getProducts();

    res.render('home', { products });
  } catch (error) {
    res.status(500).send('Error del servidor')
  }
})


// 2) Se trabaja con websockets:

router.get('/realtimeproducts', async (req, res) => {
  try {
    res.render('realtimeproducts');
  } catch (error) {
    res.status(500).send('Error del servidor')

  }
})

// Ruta para la raíz (home)
router.get('/', async (req, res) => {
  try {
    const products = await manager.getProducts(); // Recuperar productos
    res.render('home', { products }); // Renderizar la vista home
  } catch (error) {
    res.status(500).send('Error del servidor');
  }
});








module.exports = router;