const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

// Configurações
const secretKey = '1234567890';
const products = [
    { id: 1, nome: 'escova de dente', preco: '10.00' },
    { id: 2, nome: 'shampoo', preco: '40.00' }
];

// Middleware
app.use(bodyParser.json());

// Endpoint de autenticação
app.post('/auth/login', (req, res) => {
    const { usuario, senha } = req.body;

    // Validação simples para demonstração (não usar em produção)
    if (usuario === 'user' && senha === 'password') {
        const token = jwt.sign({ usuario }, secretKey, { expiresIn: '1h' });
        return res.json({ token });
    } else {
        return res.status(401).json({ error: 'Credenciais inválidas' });
    }
});

// Middleware para verificar o token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Endpoint protegido
app.get('/produtos', authenticateToken, (req, res) => {
    res.json({ produtos: products });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
