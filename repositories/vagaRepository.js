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
    // Validação básica
    if (!title || !description || !dataCadastro || !telefone || !status || !empresa) {
      throw new Error("Todos os campos são obrigatórios.");
    }

    // Converta dataCadastro para um formato válido, se necessário
    const dataCadastroFormatada = new Date(dataCadastro);
    if (isNaN(dataCadastroFormatada)) {
      throw new Error("Formato de data inválido para 'dataCadastro'.");
    }

    // Criação da vaga
    const vagaCriada = await vaga.create({
      title,
      description,
      dataCadastro: dataCadastroFormatada,
      telefone,
      status,
      empresa,
    });

    return vagaCriada;
  } catch (error) {
    // Mensagem de erro mais detalhada
    throw new Error(`Erro ao criar vaga: ${error.message}`);
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
