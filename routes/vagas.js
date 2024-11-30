const express = require("express");
const router = express.Router();
const vagaRepository = require("../repositories/vagaRepository");

// GET: Todas as vagas
router.get("/", async (req, res) => {
  try {
    const jobs = await vagaRepository.getAllVagas();
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Vaga por ID
router.get("/:id", async (req, res) => {
  try {
    const job = await vagaRepository.getVagaById(req.params.id);
    if (job) {
      res.json({ job });
    } else {
      res.status(404).json({ error: "Vaga não encontrada" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Criar nova vaga
router.post("/", async (req, res) => {
  try {
    const { title, description, dataCadastro, telefone, status, empresa } = req.body;
    const job = await vagaRepository.createVaga(title, description, dataCadastro, telefone, status, empresa);
    res.status(201).json({ job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Atualizar vaga por ID
router.put("/:id", async (req, res) => {
  try {
    const { title, description, dataCadastro, telefone, status, empresa } = req.body;
    const job = await vagaRepository.updateVaga(req.params.id, title, description, dataCadastro, telefone, status, empresa);
    if (job) {
      res.json({ job });
    } else {
      res.status(404).json({ error: "Vaga não encontrada" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Remover vaga por ID
router.delete("/:id", async (req, res) => {
  try {
    const job = await vagaRepository.deleteVaga(req.params.id);
    if (job) {
      res.json({ job });
    } else {
      res.status(404).json({ error: "Vaga não encontrada" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
