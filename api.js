const express = require("express");
const app = express();

const port = process.env.PORT || 3000;

app.use(function (request, response, next) {
	console.log("before", request.body);
	next();
});

app.use(express.json());

app.post("/api/user", function (request, response) {
	console.log("I am inside the post Method", request.body);
	response.status(200).json({
		status: "success",
		message: "sending request from post method",
	});
});

app.get("/api/user", function (request, response) {
	console.log("I am inside get method");
	response.status(200).json({
		status: "success",
		message: "sending response from get method",
	});
});

app.listen(port, function () {
	console.log("Server is listening at port 3000");
});
