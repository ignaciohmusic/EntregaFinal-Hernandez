import { Router } from 'express';
const router = Router();
import CartManager from "../managers/cartManager.js";
const cartManager = new CartManager("./src/data/carts.json");

router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.json(newCart);
    } catch (error) {
        res.status(500).send("Error del servidor")
    }
})

router.get("/:cid", async (req, res) => {
    let cartId = parseInt(req.params.cid);
    try {
        const cartList = await cartManager.getCartById(cartId);
        res.json(cartList.products)
    } catch (error) {
        res.status(500).send("Error al obtener los productos del carrito");
    
    }
})

router.post("/:cid/products/:pid", async (req, res) => {
    let cartId = parseInt(req.params.cid);
    let productId = req.params.pid;
    let quantity = req.body.quantity || 1;

    try {
        const updated = await cartManager.addProductsToCart(cartId, productId, quantity);
        res.json(updated.products);
    } catch (error) {
        res.status(500).send("Error al agregar un producto")
    }
})



export default router;