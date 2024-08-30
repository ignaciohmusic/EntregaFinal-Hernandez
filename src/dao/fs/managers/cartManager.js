import {promises as fs } from "fs";

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
        this.ultId = 0;
        this.uploadCarts();
    }

    async uploadCarts() {
        try {
            const data = await fs.readFile(this.path,"utf-8");
            this.carts = JSON.parse(data);
            if(this.carts.length > 0) {
                this.ultId = Math.max(...this.carts.map(cart => cart.id));
            }
        } catch (error) {
            console.log("Error al cargar los carritos", error);
            await this.saveCarts();      
        }
    }

    async saveCarts() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    async createCart() {
        const newCart  = {
            id: ++this.ultId,
            products: []
        }
        this.carts.push(newCart);
        await this.saveCarts();
        return newCart;
    }

    async getCartById(cartId){
        try {
            const cartReturn = this.carts.find(c => c.id === cartId)

            if (!cartReturn) {
                throw new error("No existe un carrito con ese ID");
            }
            return cartReturn;
        } catch (error) {
            console.log("Error al obtener carrito por ID");
            throw error;
        }
    }

    async addProductsToCart(cartId, productId, quantity = 1) {
        const cartReturn = await this.getCartById(cartId);
        const existsProduct = cartReturn.products.find(p => p.product === productId);

        if (existsProduct) {
            existsProduct.quantity += quantity;
        } else {
            cartReturn.products.push({product: productId, quantity });
        }
        await this.saveCarts();
        return cartReturn;
    }
}

export default CartManager;