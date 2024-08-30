import express from "express";
const app = express();
const PUERTO = 8080;
 
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from './routes/products.router.js'; 
import cartRouter from './routes/cart.router.js';
import viewsRouter from './routes/views.router.js';
import "./database.js";

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./src/public"));  

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter)

const httpServer = app.listen(PUERTO, () => {
  console.log(`escuchando a http://localhost:${PUERTO}`);
}); 

const io = new Server(httpServer);

import ProductManager from "./dao/db/product-manager-db.js";
const productManager = new ProductManager();

io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");

  socket.emit("products", await productManager.getProducts());

  socket.on("deleteProduct", async(id) => {
    await productManager.deleteProduct(id);
    socket.emit("products", await productManager.getProducts());
  })
  
  socket.on("addProduct", async (product) => {
    await productManager.addProduct(
      product.title,
      product.description,
      product.code,
      product.price,
      product.status,
      product.stock,
      product.category,
      product.thumbnails
    );
    io.emit("products", await productManager.getProducts());
  });
});