import { Router } from 'express';
const router = Router();
import CartManager from "../dao/db/cart-manager-db.js";
const cartManager = new CartManager();
import CartModel from '../dao/models/cart.model.js';

router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.json(newCart);
    } catch (error) {
        res.status(500).send("Error del servidor")
    }
})

router.get("/:cid", async (req, res) => {
    const id = req.params.cid;
    try {
        const cartList = await CartManager.getCartById(id);
        if(!cartList) {
            console.log("No existe un carrito con ese id");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        return res.json(cartList.products);
    } catch (error) {
        res.status(500).send("Error al obtener los productos del carrito");
    }
})

router.post("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const updatedCart = await cartManager.addProductsToCart(cartId, productId, quantity);
        if (updatedCart) {
            res.json(updatedCart.products);
        } else {
            res.status(404).send("Carrito no encontrado");
        }
    } catch (error) {
        res.status(500).send("Error al agregar un producto al carrito");
    }
});

export default router;