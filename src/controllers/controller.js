var Question = require('../models/Question.js');
var Email = require('../models/Emails.js');
var Results = require('../models/Results.js');

/**
 * GET /
 */
exports.getHome = (req, res) => {
  Question.find((err, questions) => {
	  if (err) return console.error(err);
	  Email.find((err, emails) => {
	  	if (err) return console.error(err);
	  	Results.find((err, results) => {
	  		if (err) return console.error(err);
	  		res.render('home', { data: { questions: questions, emails: emails, results: results }});
	  	})
	  });
  });
};


/*
* POST /quesiton
*/
exports.postQuestion = (req, res, next) => {
	console.log(req.body);
	var question = new Question({
		question: req.body.QUESTION
	})
	question.save(function(err){
		if (err) {
			console.error(err);
			res.status(400);
			return res.send({status: 'error', errors: err});
		}
		res.redirect('/');
	});
};

/*
 * DELETE /question/:questionID
 */
exports.deleteQuestion = (req, res) => {
  Question.remove({ _id: req.params.questionID }, function (err) {
    if (err) {
      console.error(err);
      return res.send({status: 'error:', errors: err});
    }
    res.redirect('/');
  });
};

/*
* POST /email
*/
exports.postEmail = (req, res, next) => {
	console.log(req.body);
	var email = new Email({
		email: req.body.EMAIL
	})
	email.save(function(err){
		if (err) {
			console.error(err);
			res.status(400);
			return res.send({status: 'error', errors: err});
		}
		res.redirect('/');
	});
};

/*
 * DELETE /email/delete/:emailID
 */
exports.deleteEmail = (req, res) => {
  Email.remove({ _id: req.params.emailID }, function (err) {
    if (err) {
      console.error(err);
      return res.send({status: 'error:', errors: err});
    }
    res.redirect('/');
  });
};

/*
 * GET /results
 */
exports.getResults = (req, res) => {
  Results.find({}).sort('-createdAt').exec(function (err, results) {
    if (err) {
      console.error(err);
      return res.send({status: 'error:', errors: err});
    }
    res.send({data : results});
  });
};