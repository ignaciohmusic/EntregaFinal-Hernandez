import { Router } from 'express';
const router = Router();

import ProductManager from '../managers/productManager.js'
const manager = new ProductManager("./src/data/products.json");

router.get("/",  async (req, res) => {
    try {
        const products = await manager.getProducts();
        res.render("home", {product:products});
    } catch (error) {
        res.status(500).json({error: "Error interno del servidor"})
    }
})

router.get("/realtimeproducts",  (req, res) => {
    res.render("realtimeproducts");
})

export default router;