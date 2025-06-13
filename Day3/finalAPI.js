const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const { PORT, DB_USER, DB_PASSWORD } = process.env;
const app = express();

const dbURL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.whao5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose
	.connect(dbURL)
	.then(function (connection) {
		console.log("Connection success");
	})
	.catch((err) => console.log(err));

const userSchemaRules = {
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		minlength: 8,
	},
	confirmPassword: {
		type: String,
		required: true,
		minlength: 8,
		validate: function () {
			return this.password == this.confirmPassword;
		},
	},
	createAt: {
		type: Date,
		default: Date.now(),
	},
	token: String,
};
const userSchema = new mongoose.Schema(userSchemaRules);
const UserModel = mongoose.model("UserModel", userSchema);

app.use(express.json());

app.use(function (request, response, next) {
	if (request.method == "POST") {
		const userDetails = request.body;
		const isEmpty = !userDetails || Object.keys(userDetails).length == 0;
		if (isEmpty) {
			response.status(404).json({
				status: "failure",
				message: "Data is Empty",
			});
		} else {
			next();
		}
	} else {
		next();
	}
});

app.get("/api/user", getAllUsers);

app.post("/api/user", createUserHandler);

app.get("/api/user/:userId", getUserById);

function getUserByid(id) {
	const user = userDataStore.find((eachUser) => eachUser.id == id);
	if (user == undefined) {
		return "No User Found";
	} else {
		return user;
	}
}

async function createUserHandler(request, response) {
	try {
		const userDetails = request.body;
		const user = await UserModel.create(userDetails);

		response.status(200).json({
			status: "success",
			message: "added the user",
			user,
		});
	} catch (err) {
		response.status(500).json({
			status: "failure",
			message: err.message,
		});
	}
}

async function getUserById(request, response) {
	try {
		const userId = request.params.userId;
		const userDetails = await UserModel.findById(userId);
		if (userDetails == "No User Found") {
			throw new Error(`User with ${userId} Not Found`);
		} else {
			response.status(200).json({
				status: "success",
				message: userDetails,
			});
		}
	} catch (err) {
		response.status(404).json({
			status: "failure",
			message: err.message,
		});
	}
}

async function getAllUsers(request, response) {
	try {
		console.log("I am inside get method");
		const userDataStore = await UserModel.find();
		if (userDataStore.length == 0) {
			throw new Error("No User Found");
		}
		response.status(200).json({
			status: "success",
			message: userDataStore,
		});
	} catch (err) {
		response.status(404).json({
			status: "failure",
			message: err.message,
		});
	}
}

app.use(function (request, response) {
	response.status(404).json({
		status: "failure",
		message: "404 page not found",
	});
});

app.listen(PORT, function (request, response) {
	console.log(`Server is running at ${PORT} port`);
});
