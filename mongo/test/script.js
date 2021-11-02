import http from 'k6/http';
import { check } from 'k6';

export let options = {
    vus: 100,
    iterations: 200000,
};

export default function () {
    const res = http.post(
        'http://localhost:3000/messages',
        JSON.stringify({
            org: Math.floor(Math.random() * 10),
            engine: Math.floor(Math.random() * 10),
            value: Math.floor(Math.random() * 10),
        }),
        {
            headers: { 'Content-Type': 'application/json' },
        },
    );

    check(res, { 'status was 200': (r) => r.status == 200 });
}
