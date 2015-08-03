var path = require('path');

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name 	= (url[6] || null);
var user 		= (url[2] || null);
var pwd 		= (url[3] || null);
var protocol	= (url[1] || null);
var dialect 	= (url[1] || null);
var port		= (url[5] || null);
var host 		= (url[4] || null);
var storage = process.env.DATABASE_STORAGE;

var Sequelize = require('sequelize');

var sequelize = new Sequelize(DB_name, user, pwd,
					{
						dialect: protocol,
					 	protocol: protocol,
					 	port: port,
					 	host: host,
					 	storage: storage,
					 	omitNull: true
					});


// Importar definicion de la tabla Comment
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

// Importar definicion de la tabla Comment
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz;
exports.Comment = Comment;

// Inicializa tabla de preguntas en DB
sequelize.sync().then(function() {

	Quiz.count().then(function(count){
		if(count === 0){
			Quiz.create({ pregunta: 'Capital de España',
							respuesta: 'Madrid', tematica: 'Geografía'
						})
			Quiz.create({ pregunta: 'Capital de Alemania',
							respuesta: 'Berlín', tematica: 'Geografía'
						})
			Quiz.create({ pregunta: 'Quien descubrio América',
							respuesta: 'Colón', tematica: 'Humanidades'
						})
			Quiz.create({ pregunta: 'Formula Química del Agua',
							respuesta: 'H20', tematica: 'Ciencia'
						})
			Quiz.create({ pregunta: 'Rio que pasa por Munich',
							respuesta: 'Isar', tematica: 'Geografía'
						})
			Quiz.create({ pregunta: 'Sistema Operativo Relacionado con un Pingüino',
							respuesta: 'Linux', tematica: 'Tecnología'
						})
			.then(function(){console.log('Base de datos Inicializada')});
		};
	});
});