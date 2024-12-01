const express = require("express");
const router = express.Router();
const vagaRepository = require("../repositories/vagaRepository");
const { authenticateToken } = require("../middlewares/authenticateToken");

// Variável de chave secreta para JWT
const SECRET_KEY = process.env.SECRET_KEY || "secreta";

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/vagas:
 *   get:
 *     summary: Obter todas as vagas
 *     tags:
 *       - Vagas
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de vagas retornada com sucesso.
 *       500:
 *         description: Erro ao buscar vagas.
 */
router.get("/", authenticateToken, async (req, res) => {
  try {
    const jobs = await vagaRepository.getAllVagas();
    res.status(200).json({ jobs });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar vagas." });
  }
});

/**
 * @swagger
 * /api/vagas/{id}:
 *   get:
 *     summary: Obter uma vaga por ID
 *     tags:
 *       - Vagas
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vaga retornada com sucesso.
 *       404:
 *         description: Vaga não encontrada.
 *       500:
 *         description: Erro ao buscar vaga.
 */
router.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const job = await vagaRepository.getVagaById(id);
    if (job) {
      res.status(200).json({ job });
    } else {
      res.status(404).json({ error: "Vaga não encontrada." });
    }
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar vaga." });
  }
});

/**
 * @swagger
 * /api/vagas:
 *   post:
 *     summary: Criar nova vaga
 *     tags:
 *       - Vagas
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dataCadastro:
 *                 type: string
 *                 format: date
 *               telefone:
 *                 type: string
 *               status:
 *                 type: string
 *               empresa:
 *                 type: string
 *     responses:
 *       201:
 *         description: Vaga criada com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       500:
 *         description: Erro ao criar vaga.
 */
router.post("/", authenticateToken, async (req, res) => {
  const { title, description, dataCadastro, telefone, status, empresa } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Título e descrição são obrigatórios." });
  }

  try {
    const job = await vagaRepository.createVaga(
      title,
      description,
      dataCadastro,
      telefone,
      status,
      empresa
    );
    res.status(201).json({ job });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar vaga." });
  }
});

/**
 * @swagger
 * /api/vagas/{id}:
 *   put:
 *     summary: Atualizar vaga por ID
 *     tags:
 *       - Vagas
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dataCadastro:
 *                 type: string
 *               telefone:
 *                 type: string
 *               status:
 *                 type: string
 *               empresa:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vaga atualizada com sucesso.
 *       404:
 *         description: Vaga não encontrada.
 *       500:
 *         description: Erro ao atualizar vaga.
 */
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, dataCadastro, telefone, status, empresa } = req.body;

  try {
    const job = await vagaRepository.updateVaga(
      id,
      title,
      description,
      dataCadastro,
      telefone,
      status,
      empresa
    );
    if (job) {
      res.status(200).json({ job });
    } else {
      res.status(404).json({ error: "Vaga não encontrada." });
    }
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar vaga." });
  }
});

/**
 * @swagger
 * /api/vagas/{id}:
 *   delete:
 *     summary: Remover vaga por ID
 *     tags:
 *       - Vagas
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vaga removida com sucesso.
 *       404:
 *         description: Vaga não encontrada.
 *       500:
 *         description: Erro ao remover vaga.
 */
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedJob = await vagaRepository.deleteVaga(id);
    if (deletedJob) {
      res.status(200).json({ message: "Vaga removida com sucesso." });
    } else {
      res.status(404).json({ error: "Vaga não encontrada." });
    }
  } catch (err) {
    res.status(500).json({ error: "Erro ao remover vaga." });
  }
});

module.exports = router;
