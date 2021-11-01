const express = require('express');
const { MongoClient } = require('mongodb');

const URL = 'mongodb://localhost:27018';
const MONGO_DB = 'test';
const mongo = new MongoClient(URL, {
    useUnifiedTopology: true,
    maxPoolSize: 10,
    maxIdleTimeMS: 10000,
});

const db = mongo.db(MONGO_DB);

const app = express();

async function main() {
    // await db.createCollection('bot-statistic', {
    //     timeseries: {
    //         timeField: "timestamp",
    //         metaField: "metadata",
    //         granularity: "hours",
    //     },
    //     expireAfterSeconds: 86400,
    // });


    app.use(express.json());

    app.post('/messages', async (req, res) => {
        const { org, engine, value } = req.body;

        const date = new Date();
        date.setDate(Math.floor(Math.random() * 30));

        await db.collection('bot-statistic').insertOne({
            metadata: { org, engine },
            timestamp: date,
            sessions: value,
        });

        res.send('OK');
    });

    app.get('/messages', () => {

    });

    app.listen(3000, () => {
        console.log('server started on port 3000');
    });
}

mongo.connect().then(main);
