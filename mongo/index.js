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
    //     expireAfterSeconds: 86400, // time to live index in seconds
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

    app.get('/messages', async (req, res) => {
        const { org, engine, from, to } = req.query;
        const botStatistic = db.collection('bot-statistic').aggregate([
            {
                '$match': {
                    'metadata.org': org * 1,
                    'metadata.engine': engine * 1,
                    'timestamp': {
                        $gte: from,
                        $lte: to,
                    },
                },
            },
            {
                '$project': {
                    'date': {
                        '$dateToParts': {
                            'date': '$timestamp',
                        },
                    },
                    'sessions': 1
                },
            }, {
                '$group': {
                    '_id': {
                        'date': {
                            'year': '$date.year',
                            'month': '$date.month',
                            'day': '$date.day',
                        },
                    },
                    'totalSession': {
                        '$sum': '$sessions'
                    }
                }
            }, {
                '$sort': {
                    '_id': 1
                },
            },
        ]);

        const result = [];
        await botStatistic.forEach(r => {
            result.push(r);
        });

        res.json(result);
    });

    app.listen(3000, () => {
        console.log('server started on port 3000');
    });
}

mongo.connect().then(main);
