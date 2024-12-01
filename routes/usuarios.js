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

//CRIAR USUÁRIO
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

//FAZER LOGIN
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
    res.json({ token, id: user.id , senha: user.senha, nome: user.nome, email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//GET: TODAS OS USUÁRIOS
router.get("/", authenticateToken, async (req, res) => {
  try {
    const usuarios = await getAllUsers();
    res.json({ usuarios });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//GET: UM USUÁRIO POR ID
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

//PUT: ATUALIZAR USUÁRIO POR ID
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


// PATCH: ATUALIZAR USUÁRIO PARCIALMENTE POR ID
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



//DELETE: DELETAR USUÁRIO POR ID
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const deletedUser = await deleteUser(req.params.id);
    if (deletedUser) {
      res.json({ user: deletedUser });
    } else {
      res.status(404).json({ error: "Usuário não encontrado" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
