const mongoose = require("mongoose");
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
const UserModel = mongoose.model("userModel", userSchema);

module.exports = UserModel;
