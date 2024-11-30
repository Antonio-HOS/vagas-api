const Usuario = require("../models/usuario");

async function getAllUsers() {
  return Usuario.findAll();
}

async function getUserById(id) {
  return Usuario.findByPk(id);
}

async function GetUserByEmail(email) {
  return Usuario.findOne({ where: { email } });
}

async function createUser(dados) {
  const { nome, email, senha } = dados;
  return Usuario.create({ nome, email, senha });
}

async function deleteUser(id) {
  const usuario = await Usuario.findByPk(id);
  if (usuario) {
    await usuario.destroy();
    return usuario;
  }
  return null;
}

async function updateUser(id, dadosAtualizados) {
  const usuario = await Usuario.findByPk(id);
  if (usuario) {
    const { nome, email, senha } = dadosAtualizados;
    usuario.set({ nome, email, senha });
    await usuario.save();
    return usuario;
  }
  return null;
}

module.exports = {
  getAllUsers,
  getUserById,
  GetUserByEmail,
  createUser,
  deleteUser,
  updateUser,
};
