const { InfluxDB, Point } = require('@influxdata/influxdb-client');

// You can generate a Token from the "Tokens Tab" in the UI
const TOKEN = '_VG73Km5fx50_Bt6Ro9dHCV58O7uiwkCBiMmXXG2sbrCOJCVlr0rM3_RRZO61utLL2FyM9iUsI-Fm25Xd8GjXQ==';
const ORG = 'VNLP';
const BUCKET = 'statistic-dev';

const influxDB = new InfluxDB({
    url: 'http://localhost:8086',
    token: TOKEN,
});


exports.writeDB = ({ org, engine, value }) => {
    const writeApi = influxDB.getWriteApi(ORG, BUCKET)
    const point = new Point('session')
        .tag('org', org)
        .tag('engine', engine)
        .floatField('value', value);

    writeApi.writePoint(point)
    return writeApi.close();
};

exports.queryDB = ({ org, engine, timeRange }) => {
    const queryApi = influxDB.getQueryApi(ORG);
    const fluxQuery =
        `from(bucket: "statistic-dev")
        |> range(start: -1d) |> filter(fn: (r) => r._measurement == "session")`

    const promise = new Promise((res, reject) => {
        const data = [];
        const fluxObserver = {
            next(row, tableMeta) {
                const o = tableMeta.toObject(row);
                console.log(
                    `${o._time} ${o._measurement} in ${o.region} (${o.sensor_id}): ${o._field}=${o._value}`
                );
                data.push(o);
            },
            error(error) {
                console.error(error);
                console.log('Finished ERROR');
                reject(error);
            },
            complete() {
                console.log('Finished SUCCESS');
                res(data);
            },
        };

        queryApi.queryRows(fluxQuery, fluxObserver);
    });

    return promise;
};
