const express = require('express');
const productRouter = require('./routes/products.router.js');
const cartRouter = require('./routes/carts.router.js');
const viewsRouter = require('./routes/views.router.js')
const exphbs = require('express-handlebars');
const socket = require('socket.io')
const app = express();
const PUERTO = 8080;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

// Express-handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set('views', './src/views');

// RUTAS:
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter)
app.use('/', viewsRouter);


const httpServer = app.listen(PUERTO, () => {
  console.log((`Escuchando en el http://localhost:${PUERTO}`));
})

// Array de productos
const ProductManager = require('./managers/product-manager.js');
const manager = new ProductManager('./src/data/products.json')



const io = socket(httpServer);

io.on('connection', async (socket) => {
  console.log('Un cliente se conecto');
  
  socket.emit('products', await manager.getProducts())

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
})