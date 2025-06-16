const mongoose = require("mongoose");
const productSchemaRules = {
	name: {
		type: String,
		required: [true, "Kindly pass the name"],
		unique: [true, "product name should be unique"],
		maxlength: [40, "product name is more than 40 characters"],
	},
	price: {
		type: Number,
		required: [true, "Kindly pass the price"],
		validate: {
			validator: function () {
				return this.price > 0;
			},
			message: "price should can't be negative",
		},
	},
	categories: {
		type: String,
		required: true,
	},
	productImages: {
		type: String,
	},
	averageRating: Number,
	discountedPrice: {
		type: Number,
		validate: {
			validator: function () {
				return this.discountedPrice < this.price;
			},
			message: "Discount must be less than actual price",
		},
	},
};
const productSchema = new mongoose.Schema(productSchemaRules);
const ProductModel = mongoose.model("productModel", productSchema);

module.exports = ProductModel;
