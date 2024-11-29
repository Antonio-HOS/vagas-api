const vaga = require('../models/vaga');

async function getAllVagas() {
  try {
    return await vaga.findAll();
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getVagaById(id) {
  try {
    return await vaga.findByPk(id);
  } catch (error) {
    throw new Error(error.message);
  }
}

async function createVaga(title, description, dataCadastro, telefone, status, empresa) {
  try {
    return await vaga.create({ title, description, dataCadastro, telefone, status, empresa });
  } catch (error) {
    throw new Error(error.message);
  }
}

async function updateVaga(id, title, description, dataCadastro, telefone, status, empresa) {
  try {
    const vagaInstance = await vaga.findByPk(id);
    if (!vagaInstance) {
      throw new Error('Vaga not found'); 
    } 
    vagaInstance.title = title;
    vagaInstance.description = description;
    vagaInstance.dataCadastro = dataCadastro;
    vagaInstance.telefone = telefone;
    vagaInstance.status = status;
    vagaInstance.empresa = empresa;
    return await vagaInstance.save(); 
  } catch (error) {
    throw new Error(error.message);
  }
}

async function deleteVaga(id) {
  try {
    const vagaInstance = await vaga.findByPk(id);
    if (!vagaInstance) {
      throw new Error('Vaga not found');
    }
    return await vagaInstance.destroy(); 
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  getAllVagas,
  getVagaById,
  createVaga,
  updateVaga,
  deleteVaga,
};
