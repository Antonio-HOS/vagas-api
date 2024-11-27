const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: './database.sqlite' // Caminho para o arquivo do banco de dados
});

module.exports = sequelize;
