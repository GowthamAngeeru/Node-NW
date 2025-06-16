const express = require("express");

const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const { PORT, DB_USER, DB_PASSWORD } = process.env;
const app = express();
const UserModel = require("./UserModel");
const ProductModel = require("./ProductModel");

const {
	getAllFactory,
	createFactory,
	getByIdFactory,
	deleteByIdFactory,
} = require("./utility/crudFactory.js");

const dbURL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.whao5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose
	.connect(dbURL)
	.then(function (connection) {
		console.log("Connection success");
	})
	.catch((err) => console.log(err));

app.use(express.json());

const checkInput = function (request, response, next) {
	if (request.method == "POST") {
		const userDetails = request.body;
		const isEmpty = !userDetails || Object.keys(userDetails).length == 0;
		if (isEmpty) {
			response.status(404).json({
				status: "failure",
				message: "Data is Empty",
			});
		}
	} else {
		next();
	}
};

const createUserHandler = createFactory(UserModel);
const getUserById = getByIdFactory(UserModel);
const getAllUsers = getAllFactory(UserModel);
const deleteById = deleteByIdFactory(UserModel);

const createProductHandler = createFactory(ProductModel);
const getAllProducts = getAllFactory(ProductModel);
const getProductById = getByIdFactory(ProductModel);
const deleteProductById = deleteByIdFactory(ProductModel);

app.post("/api/user", createUserHandler);
app.get("/api/user", getAllUsers);
app.get("/api/user/:userId", getUserById);
app.delete("/api/user/:userId", deleteById);

app.post("/api/product", createProductHandler);
app.get("/api/product", getAllProducts);
app.get("/api/product/:productId", getProductById);
app.delete("/api/product/:productId", deleteProductById);

app.use(function (request, response) {
	response.status(404).json({
		status: "failure",
		message: "404 page not found",
	});
});

//app.use(checkInput);

app.listen(PORT, function (request, response) {
	console.log(`Server is running at ${PORT} port`);
});
