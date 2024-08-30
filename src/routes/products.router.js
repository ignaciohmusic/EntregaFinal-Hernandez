import express from "express";
import {Router} from "express";
const router = Router();
import ProductManager from '../dao/db/product-manager-db.js'
const manager = new ProductManager();

router.use(express.json());

router.get("/", async (req, res) => {

  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const products = await manager.getProducts({
        limit: parseInt(limit),
        page: parseInt(page),
        sort,
        query,
    });

    res.json({
        status: 'success',
        payload: products,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
        nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
    });
  } catch (error) {
      console.error("Error al obtener productos", error);
      res.status(500).json({
          status: 'error',
          error: "Error interno del servidor"
      });
  }
});

router.get("/:pid", async (req, res) => {
  const id = req.params.pid;
  try {
    const product = await manager.getProductById(id);
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
  const id = req.params.pid;
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
  const id = req.params.pid;
  try {
    await manager.deleteProduct(id);
    res.send("Producto eliminado exitosamente")
  } catch (error) {
    console.log(error);
    res.send("Error al intentar borrar el ID")
  }

})

export default router;