# time-series-storage
Example for time series DB

### Install InfluxDB
- Generate config:
```bash
docker run \
  --rm influxdb:2.0.9 \
  influxd print-config > config.yml
```

- Run in docker
```bash
docker run \
    --name influxdb \
    -p 8086:8086 \
    --volume $PWD:/var/lib/influxdb2 \
    influxdb:2.0.9
```
