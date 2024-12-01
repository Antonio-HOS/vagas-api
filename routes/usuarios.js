const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../middlewares/authenticateToken");
const {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
} = require("../repositories/usuarioRepository");
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
 * /api/usuario/register:
 *   post:
 *     summary: Criar um novo usuário
 *     description: Cria um novo usuário com os dados fornecidos.
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do usuário.
 *               email:
 *                 type: string
 *                 description: Email do usuário.
 *               senha:
 *                 type: string
 *                 description: Senha do usuário.
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 *       500:
 *         description: Erro ao criar usuário.
 */
router.post("/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const hashedPassword = await bcrypt.hash(senha, 10);
    const newUser = await createUser({ nome, email, senha: hashedPassword });
    res
      .status(201)
      .json({ message: "Usuário criado com sucesso", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/usuario/login:
 *   post:
 *     summary: Fazer login
 *     description: Realiza o login e gera um token JWT.
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email do usuário.
 *               senha:
 *                 type: string
 *                 description: Senha do usuário.
 *     responses:
 *       200:
 *         description: Login bem-sucedido. Retorna o token JWT.
 *       401:
 *         description: Credenciais inválidas.
 *       500:
 *         description: Erro ao fazer login.
 */
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await getUserByEmail(email);
    if (!user || !bcrypt.compareSync(senha, user.senha)) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ token, id: user.id, senha: user.senha, nome: user.nome, email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/usuario/:
 *   get:
 *     summary: Obter todos os usuários
 *     description: Retorna uma lista de todos os usuários registrados.
 *     tags:
 *       - users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso.
 *       500:
 *         description: Erro ao buscar usuários.
 */
router.get("/", authenticateToken, async (req, res) => {
  try {
    const usuarios = await getAllUsers();
    res.json({ usuarios });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/usuario/{id}:
 *   get:
 *     summary: Obter um usuário por ID
 *     description: Retorna um usuário específico pelo ID.
 *     tags:
 *       - users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuário.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalhes do usuário retornados com sucesso.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro ao buscar usuário.
 */
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (user) {
      res.json({ user });
    } else {
      res.status(404).json({ error: "Usuário não encontrado" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/usuario/{id}:
 *   put:
 *     summary: Atualizar um usuário por ID
 *     description: Atualiza os dados de um usuário específico.
 *     tags:
 *       - users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuário.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro ao atualizar usuário.
 */
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const hashedPassword = senha ? await bcrypt.hash(senha, 10) : undefined;
    const updatedUser = await updateUser(req.params.id, {
      nome,
      email,
      senha: hashedPassword,
    });
    if (updatedUser) {
      res.json({ user: updatedUser });
    } else {
      res.status(404).json({ error: "Usuário não encontrado" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/usuario/{id}:
 *   patch:
 *     summary: Atualizar parcialmente um usuário por ID
 *     description: Atualiza alguns dados de um usuário específico.
 *     tags:
 *       - users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuário.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado parcialmente com sucesso.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro ao atualizar parcialmente o usuário.
 */
router.patch("/:id", authenticateToken, async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // Busca o usuário atual no banco
    const existingUser = await getUserById(req.params.id); // Função que busca o usuário no banco
    if (!existingUser) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Monta o objeto de atualizações, preservando os valores existentes
    const updates = {
      nome: nome ?? existingUser.nome,
      email: email ?? existingUser.email,
      senha: senha ? await bcrypt.hash(senha, 10) : existingUser.senha,
    };

    // Atualiza o usuário no banco
    const updatedUser = await updateUser(req.params.id, updates);

    res.json({ user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/usuario/{id}:
 *   delete:
 *     summary: Deletar um usuário por ID
 *     description: Deleta um usuário específico pelo ID.
 *     tags:
 *       - users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuário.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro ao deletar usuário.
 */
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    await deleteUser(req.params.id);
    res.json({ message: "Usuário deletado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
