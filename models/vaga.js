const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Emprego = sequelize.define("Emprego", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tituloVaga: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  detalhes: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  criadoEm: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  contato: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  situacao: {
    type: DataTypes.ENUM("ativo", "inativo"),
    allowNull: false,
  },
  companhia: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Emprego;
