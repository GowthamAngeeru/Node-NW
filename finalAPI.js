const express = require("express");
const short = require("short-uuid");
const app = express();

const fs = require("fs");
const { use } = require("react");

const strContent = fs.readFileSync("./dev-data.json", "utf-8");
const userDataStore = JSON.parse(strContent);

app.get("/api/user", function (request, response) {
	try {
		console.log("I am inside get method");
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
});

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

app.post("/api/user", function (request, response) {
	const id = short.generate();
	const userDetails = request.body;
	userDetails.id = id;
	userDataStore.push(userDetails);

	const strUserData = JSON.stringify(userDataStore);
	fs.writeFileSync("./dev-data.json", strUserData);

	response.status(200).json({
		status: "success",
		message: "got request from post method",
	});
});

app.get("/api/user/:userId", function (request, response) {
	try {
		const userId = request.params.userId;
		const userDetails = getUserById(userId);
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
});
function getUserById(id) {
	const user = userDataStore.find((eachUser) => eachUser.id == id);
	if (user == undefined) {
		return "No User Found";
	} else {
		return user;
	}
}

app.use(function (request, response) {
	response.status(404).json({
		status: "failure",
		message: "404 page not found",
	});
});
const port = process.env.PORT || 3000;

app.listen(port, function () {
	console.log(`server running at ${port} port`);
});
