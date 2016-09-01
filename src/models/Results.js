const mongoose = require('mongoose');
Schema = mongoose.Schema;

var resultsSchema = new mongoose.Schema({
	participant: {type: String, required: true},
	question: {type: String, required: true},
	answer: {type: String, required: true},
	date: {type: String},
	channel: {type: String},
}, {timestamps: true});

const Results = mongoose.model('Results', resultsSchema);
module.exports = Results;