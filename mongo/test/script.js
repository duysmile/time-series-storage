import http from 'k6/http';
import { check } from 'k6';

export let options = {
    vus: 1,
    iterations: 1,
};

export default function () {
    const res = http.get(
        'http://localhost:3000/messages?org=1&engine=2',
        // JSON.stringify({
        //     org: Math.floor(Math.random() * 10),
        //     engine: Math.floor(Math.random() * 10),
        //     value: Math.floor(Math.random() * 10),
        // }),
        {
            headers: { 'Content-Type': 'application/json' },
        },
    );

    check(res, { 'status was 200': (r) => r.status == 200 });
}
