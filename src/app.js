const express = require('express');
const mongoose = require('mongoose');
const productRouter = require('./routes/products.router.js');
const cartRouter = require('./routes/carts.router.js');
const viewsRouter = require('./routes/views.router.js');
const exphbs = require('express-handlebars');
const socket = require('socket.io');

// Conexión a MongoDB
mongoose.connect("mongodb+srv://ipunto09:coderhouse@cluster0.35esf.mongodb.net/ProyectoFinal?retryWrites=true&w=majority&appName=Cluster0");

// Configuración de la aplicación
const app = express();
const PUERTO = 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

// Configuración de Express-Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set('views', './src/views');

// Rutas de la aplicación
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use('/', viewsRouter);

// Configuración de servidor HTTP y Socket.io
const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchando en el http://localhost:${PUERTO}`);
});

const io = socket(httpServer);

// ProductManager para gestionar productos (de ser necesario)
const ProductManager = require('./managers/product-manager.js');
const manager = new ProductManager('./src/data/products.json');

// Conexión de clientes mediante socket.io
io.on('connection', async (socket) => {
  console.log('Un cliente se conectó');

  // Emitir productos al cliente
  socket.emit('products', await manager.getProducts());

  // Escuchar cuando un cliente agrega un nuevo producto
  socket.on('nuevoProducto', async (producto) => {
    await manager.addProduct(producto);
    const productosActualizados = await manager.getProducts();
    io.emit('products', productosActualizados); // Actualizar todos los clientes
  });

  // Escuchar cuando un cliente elimina un producto
  socket.on('eliminarProducto', async (id) => {
    await manager.deleteProduct(id);
    const productosActualizados = await manager.getProducts();
    io.emit('products', productosActualizados); // Actualizar todos los clientes
  });
});

module.exports = app;
