import express from "express";
const app = express();
const PUERTO = 8080;

import productsRouter from './routes/products.router.js'; 
import cartRouter from './routes/cart.router.js';

app.use(express.json()); 

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

app.listen(PUERTO, () => {
  console.log(`escuchando a http://localhost:${PUERTO}`);
})



