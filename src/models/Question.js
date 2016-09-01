const mongoose = require('mongoose');
Schema = mongoose.Schema;

var questionSchema = new mongoose.Schema({
	question: {type: String, required: true}
}, {timestamps: true});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;