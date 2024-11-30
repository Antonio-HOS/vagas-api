const Usuario = require("../models/usuario");

async function obterTodos() {
  return Usuario.findAll();
}

async function buscarPorId(id) {
  return Usuario.findByPk(id);
}

async function buscarPorEmail(email) {
  return Usuario.findOne({ where: { email } });
}

async function adicionarUsuario(dados) {
  const { nome, email, senha } = dados;
  return Usuario.create({ nome, email, senha });
}

async function deletarUsuario(id) {
  const usuario = await Usuario.findByPk(id);
  if (usuario) {
    await usuario.destroy();
    return usuario;
  }
  return null;
}

async function editarUsuario(id, dadosAtualizados) {
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
  obterTodos,
  buscarPorId,
  buscarPorEmail,
  adicionarUsuario,
  editarUsuario,
  deletarUsuario,
};
