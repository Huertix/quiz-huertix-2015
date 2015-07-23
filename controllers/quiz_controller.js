var models = require('../models/models.js');

exports.load = function(req, res, next, quizId){
	models.Quiz.findById(quizId).then(
		function(quiz){
			if(quiz){
				req.quiz = quiz;
				next();
			}else{
				next (new Error('No existe quizId ' + quizId));
			}
		}).catch(function(error){ next(error);});
};

exports.index = function(req, res) {
	
	var string = req.query.search;

	if(string == null){
		models.Quiz.findAll().then(function(quizes) {
		res.render('quizes/index.ejs', { quizes: quizes});
		}).catch(function(error){ next(error);});
	}else{
		string = string.replace(" ","%");
		string = "%"+string+"%";
		models.Quiz.findAll({where:["pregunta like ?", string]}).then(function(quizes) {
		res.render('quizes/index.ejs', { quizes: quizes});
	}).catch(function(error){ next(error);});
	}

};



// GET /quizes/question
exports.show = function(req, res){
	models.Quiz.findById(req.params.quizId).then(function(quiz){
		res.render('quizes/show',{quiz: req.quiz})
	})
};


// GET /quizes/answer
exports.answer = function(req, res){
	models.Quiz.findById(req.params.quizId).then(function(quiz){
		if(req.query.respuesta === req.quiz.respuesta){
			res.render('quizes/answer',
				{ quiz: quiz, respuesta: 'Correcto'});
		}else{
			res.render('quizes/answer',
				{ quiz: req.quiz, respuesta: 'Incorrecto'});
		}
		
	})

};

// GET /quizes/new
exports.new = function(req, res){
	var quiz = models.Quiz.build(
		{ pregunta: "Pregunta", Respuesta: "Respuesta"});

		res.render('quizes/new',{quiz: quiz});	
};

// GET /quizes/create
exports.create = function(req, res){
	var quiz = models.Quiz.build( req.body.quiz );

		// guarda en DB solo los campos pregunta y respuesta de quiz. Evitamos virus por entrada de mas parametros en la DB
		quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
			res.redirect('/quizes');
		})
};
