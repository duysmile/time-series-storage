const express = require('express');
const { writeDB, queryDB } = require('./db');

app = express();

app.use(express.json());

app.post('/messages', async (req, res) => {
    const { org, engine, value } = req.body;

    await writeDB({ org, engine, value });

    res.send('OK');
});

app.get('/messages', async (req, res) => {
    const { org, engine, timestamp } = req.query;

    const data = await queryDB({ org, engine, timestamp });

    res.json(data);
});

app.listen(3000, () => {
    console.log('Server started at port 3000');
});
