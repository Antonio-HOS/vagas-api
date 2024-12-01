const express = require("express");
const router = express.Router();
const vagaRepository = require("../repositories/vagaRepository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../middlewares/authenticateToken");
const SECRET_KEY = process.env.SECRET_KEY || "secreta";

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   security:
 *     - BearerAuth: []  // Isso indica que todas as rotas requerem autenticação JWT
 */

/**
 * @swagger
 * /api/vagas:
 *   get:
 *     summary: Obter todas as vagas
 *     description: Retorna uma lista de todas as vagas disponíveis.
 *     tags:
 *       - vagas
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
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/vagas/{id}:
 *   get:
 *     summary: Obter uma vaga por ID
 *     description: Retorna uma vaga específica pelo ID.
 *     tags:
 *       - vagas
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da vaga.
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

/**
 * @swagger
 * /api/vagas:
 *   post:
 *     summary: Criar nova vaga
 *     description: Cria uma nova vaga com os dados fornecidos.
 *     tags:
 *       - vagas
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título da vaga.
 *               description:
 *                 type: string
 *                 description: Descrição da vaga.
 *               dataCadastro:
 *                 type: string
 *                 format: date
 *                 description: Data de cadastro da vaga.
 *               telefone:
 *                 type: string
 *                 description: Telefone de contato.
 *               status:
 *                 type: string
 *                 description: Status da vaga (ex: aberta, fechada).
 *               empresa:
 *                 type: string
 *                 description: Nome da empresa oferecendo a vaga.
 *     responses:
 *       201:
 *         description: Vaga criada com sucesso.
 *       500:
 *         description: Erro ao criar vaga.
 */
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, description, dataCadastro, telefone, status, empresa } =
      req.body;
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
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/vagas/{id}:
 *   put:
 *     summary: Atualizar vaga por ID
 *     description: Atualiza os dados de uma vaga específica pelo ID.
 *     tags:
 *       - vagas
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da vaga.
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
 *                 format: date
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
  try {
    const { title, description, dataCadastro, telefone, status, empresa } =
      req.body;
    const job = await vagaRepository.updateVaga(
      req.params.id,
      title,
      description,
      dataCadastro,
      telefone,
      status,
      empresa
    );
    if (job) {
      res.json({ job });
    } else {
      res.status(404).json({ error: "Vaga não encontrada" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/vagas/{id}:
 *   delete:
 *     summary: Remover vaga por ID
 *     description: Deleta uma vaga específica pelo ID.
 *     tags:
 *       - vagas
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da vaga.
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
