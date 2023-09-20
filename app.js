const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 5000;
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

// Conexão com o banco de dados MongoDB 
mongoose.connect('mongodb+srv://victor1pedroso:TjUUgnwP09jd9jXy@cluster0.tz545aq.mongodb.net/controleFinanceiro', {
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
// Definição de um modelo para usuários no MongoDB
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

    // Cria uma nova instância do modelo Transaction e salva 
    const newTransaction = new Transaction(data);
    await newTransaction.save();

    return res.status(201).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para obter todas as transações 
app.get('/todastransacoes', async (req, res) => {
  try {
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
      console.log(email, senha);
  
      // Consulte o banco de dados para encontrar um usuário com o email e senha fornecidos
      const usuario = await Usuario.findOne({ email, senha });
  
      if (!usuario) {
        // Se não encontrar um usuário com as credenciais fornecidas, retorne um status 401 (Não Autorizado)
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }
  
      // Se as credenciais estiverem corretas, gera um token 
      const token = Math.random().toString(36).substring(2);
      console.log(token);
  
      return res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }); 
  
  // Rota para consultar usuarios pelo email
  app.get('/usuarios/email/:user', async (req, res) => {
    try {
      const { user } = req.params;
      const usuario = await Usuario.findOne({ email: user });
  
      if (!usuario) {
        // Se nenhum usuário for encontrado, retorna um status 404 (Não Encontrado)
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
  
      // Se o usuário for encontrado, retorne suas informações
      return res.status(200).json(usuario);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Rota para deletar uma transação pelo campo "id"
app.delete('/transacao/delete/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deletedTransaction = await Transaction.findOneAndDelete({ id });
  
      if (!deletedTransaction) {
        return res.status(404).json({ error: 'Transação não encontrada' });
      }
  
      return res.status(200).json(deletedTransaction);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });
  
  
// API rodando na porta 5000
app.listen(port, () => {
  console.log(`API de transações ouvindo na porta ${port}`);
});
