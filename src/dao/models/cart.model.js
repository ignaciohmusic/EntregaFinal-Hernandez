import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Products',
                required: true
            },
            quantity: {
                type: Number,
                require: true
            }
        }
    ]
});

cartSchema.pre('findOne', function (next) {
    this.populate('products.product', '_id title price');
    next();
});

const CartModel = mongoose.model("carts", cartSchema);

export default CartModel;