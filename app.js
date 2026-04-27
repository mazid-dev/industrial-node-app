const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('<h1>Hello DevOps</h1><p>version 1.0</p>'));
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.listen(3000, () => console.log('listening on 3000'));