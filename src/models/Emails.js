const mongoose = require('mongoose');
Schema = mongoose.Schema;

var emailSchema = new mongoose.Schema({
	email: {type: String, required: true}
}, {timestamps: true});

const Email = mongoose.model('Email', emailSchema);
module.exports = Email;