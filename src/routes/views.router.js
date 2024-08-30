import { Router } from 'express';
const router = Router();

import ProductManager from '../dao/db/product-manager-db.js'
import CartManager from "../dao/db/cart-manager-db.js";
const manager = new ProductManager();
const cartManager = new CartManager();

router.get("/products",  async (req, res) => {
   try {
      const {page = 1, limit = 5} = req.query
      const products = await manager.getProducts({
         page: parseInt(page),
         limit: parseInt(limit),
      });

      const newArray = products.docs.map(product => {
         const {_id, ...rest } = product.toObject();
         return rest;
      });

      res.render("product", {
         products: newArray,
         hasPrevPage: products.hasPrevPage,
         hasNextPage:products.hasNextPage,
         prevPage:products.prevPage,
         nextPage:products.nextPage,
         currentPage:products.page,
         totalPages:products.totalPages,
      })
   } catch (error) {
      console.log("Error al obtener productos");
      res.status(500).json({
         status: 'error',
         error: 'Error interno del servidor'
      });
   }
})

router.get("/realtimeproducts",  (req, res) => {
    res.render("realtimeproducts");
})

router.get("/carts/:cid", async (req, res) => {
   const cartId = req.params.cid;
   try {
      const cart = await cartManager.getCartById(cartId);

      if (!carrito) {
         console.log("No existe ese carrito con el id");
         return res.status(404).json({ error: "Carrito no encontrado" });
      }

      const productsInCart = cart.products.map(item => ({
         product: item.product.toObject(),
         quantity: item.quantity
      }));


      res.render("cart", { productos: productsInCart });
   } catch (error) {
      console.error("Error al obtener el carrito", error);
      res.status(500).json({ error: "Error interno del servidor" });
   }
});

export default router;