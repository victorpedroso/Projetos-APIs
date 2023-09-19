const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // Importe o mongoose para interagir com o MongoDB
const app = express();
const port = 5000;
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

// Conexão com o banco de dados MongoDB (certifique-se de substituir com sua própria URL)
mongoose.connect('mongodb+srv://<>/usuario:<senha>@cluster0.tz545aq.mongodb.net/controleFinanceiro', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

// Definição de um modelo para transações no MongoDB
const Transaction = mongoose.model('transacoes', {
  id: Number,
  desc: String,
  amount: Number,
  expense: Boolean,
});

const Usuario = mongoose.model('users', {
    id: Number,
    nome: String,
    email: String,
    senha: String
});


// Rota para adicionar uma nova transação
app.post('/transacao', async (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    if (!data) {
      return res.status(400).json({ error: 'Dados de transação inválidos' });
    }

    // Crie uma nova instância do modelo Transaction e salve-a no MongoDB
    const newTransaction = new Transaction(data);
    await newTransaction.save();

    return res.status(201).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para obter todas as transações do banco de dados MongoDB
app.get('/todastransacoes', async (req, res) => {
  try {
    // Consulte o MongoDB para recuperar todas as transações
    const transacoes = await Transaction.find({});
    res.json(transacoes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/signin', async (req, res) => {
    try {
      const { email, senha } = req.body;
  
      // Consulte o banco de dados para encontrar um usuário com o email e senha fornecidos
      const usuario = await Usuario.findOne({ email, senha });
  
      if (!usuario) {
        // Se não encontrar um usuário com as credenciais fornecidas, retorne um status 401 (Não Autorizado)
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }
  
      // Se as credenciais estiverem corretas, você pode gerar um token JWT ou algum outro método de autenticação
      // Aqui, apenas simularemos um token aleatório
      const token = Math.random().toString(36).substring(2);
  
      return res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }); 
  
  
  app.get('/usuarios/email/:user', async (req, res) => {
    try {
      const { user } = req.params;
  
      // Use o método findOne do modelo 'usuarios' para buscar um usuário com o email fornecido
      const usuario = await Usuario.findOne({ email: user }); // Use { email: user } para pesquisar no campo "email"
  
      if (!usuario) {
        // Se nenhum usuário for encontrado, retorne um status 404 (Não Encontrado)
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
  
      // Se o usuário for encontrado, retorne suas informações
      return res.status(200).json(usuario);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });
  
  

app.listen(port, () => {
  console.log(`API de transações ouvindo na porta ${port}`);
});
