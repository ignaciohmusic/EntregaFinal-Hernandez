import CartModel from "../models/cart.model.js";

class CartManager {
    async createCart() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save()
            return newCart;
        } catch (error) {
            console.log("Error al crear un nuevo carrito");
            return null;
        }
    }

    async getCartById(cartId){
        try {
            const cart = await CartModel.findById(cartId);
            if(!cart) {
                console.log("El carrito que se busca no existe");
                return null;
            }
            return cart;
        } catch (error) {
            console.log("Error al obtener carrito por ID");
            throw error;
        }
    }

    async addProductsToCart(cartId, productId, quantity = 1) {
        try {
            const carrito = await this.getCartById(cartId);
            const existProduct = carrito.products.find(item => item.product.toString() === productId);

            if (existProduct) {
                existProduct.quantity += quantity;
            } else {
                carrito.products.push({ product: productId, quantity });
            }
            carrito.markModified("products");

            await carrito.save();
            return carrito;

        } catch (error) {
            console.log("error al agregar un producto", error);
        }
    }
}

export default CartManager;