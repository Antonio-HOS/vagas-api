const express = requite("express");
const router = express.Router();
const bcrypt = require("jsonwebtoken");
const Usuario = require("../models/usuario");
const { authenticateToken } = require("../middlewares/authenticateToken");
const { where } = require("sequelize");
const SECRET_KEY = process.env.SECRET_KEY || "secreta";

router.post("/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const hashedPassWord = await bcrypt.hash(senha, 10);

    const newuser = await Usuario.create({
      nome,
      email,
      senha: hashedPassWord,
    });
    res
      .status(201)
      .jso({ message: "Usuário criado com sucesso", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//ÁREA DE LOGIN

router.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const user = await Usuario.findOne({ where: { email } });
    if (!user || !bcrypt.compareSync(senha, user.senha)) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//GET: DE TODOS OS USUÁRIOS

router.get("/", authenticateToken, async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json({ usuarios });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

//GET: DE UM ÚNICO USUÁRIO

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const user = await Usuario.findByPk(req.params.id);
    if (user) {
      res.json({ user });
    } else {
      res.status(404), json({ error: "Usuario não encontrado" });
    }
  } catch (err) {
    res.status(500), json({ error: err.message });
  }
});

//POST: CRIAR NOVO USUÁRIO
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { nome, email, senha } = res.body;
    const hashedPassWord = await bcrypt.hash(senha, 10);

    const newUser = await Usuario.create({
      nome,
      email,
      senha: hashedPassWord,
    });

    res.status(201).json({ user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//PUT: ATUALIZANDO USUÁRIO
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const user = await Usuario.findByPk(req.params.id);

    if (user) {
      (user.nome = nome),
        (user.email = email),
        (user.senha = senha ? await bcrypt.hash(senha, 10) : user.senha);
      await user.save();
      res.json({ user });
    } else {
      res.status(404).json({ error: "usuario não encontrado" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//DELETE: DELETANDO USUÁRIO POR ID
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const user = await Usuario.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.json({ user });
    } else {
      res.status(404).json({ error: "Usuário não encontrado" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  } 
});

module.exports = router;
