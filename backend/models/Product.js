const mongoose = require('mongoose');

// 1. Define the rules for a Product
const productSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }
});

// 2. Export the blueprint so our server can use it
module.exports = mongoose.model('Product', productSchema);