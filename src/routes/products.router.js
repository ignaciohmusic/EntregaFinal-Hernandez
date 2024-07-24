import express from "express";
import {Router} from "express";
const router = Router();
import ProductManager from '../managers/productManager.js'
const manager = new ProductManager("./src/data/products.json");

router.use(express.json());

router.get("/", async (req, res) => {
  const limit = req.query.limit;
  try {
    const arrayProducts = await manager.getProducts();
    if (limit) {
        res.send(arrayProducts.slice(0, limit));
    } else {
        res.send(arrayProducts);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error });
  }
})

router.get("/:pid", async (req, res) => {
  let id = req.params.pid;
  try {
    const product = await manager.getProductById(parseInt(id));
    if (!product) {
        res.send("Producto no encontrado");      
    } else {
        res.send(product);
    }
  } catch(error) {
      res.status(500).json({ message: 'Error al buscar el producto por ID', error });
  }
})

router.post("/", async (req, res) => {
  const {title, description, code, price, status = true, stock, category, thumbnails} = req.body;
  try {
      await manager.addProduct(title, description, code, price, status, stock, category, thumbnails); 
      res.status(201).send("Producto agregado exitosamente"); 
  } catch (error) {
      res.status(500).json({status: "error", message: error.message});
  }
})

router.put("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;
  try {
    const updatedProduct = await manager.updateProduct(id, { title, description, code, price, status, stock, category, thumbnails });
    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al intentar actualizar el producto", error });
  }
});

router.delete("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  try {
    await manager.deleteProduct(id);
    res.send("Producto eliminado exitosamente")
  } catch (error) {
    console.log(error);
    res.send("Error al intentar borrar el ID")
  }

})

export default router;