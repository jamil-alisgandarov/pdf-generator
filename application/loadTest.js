import { check } from "k6";
import http from "k6/http";

export let options = {
    vus: 200,
    duration: '3m',
};

export default function () {
    const payload = {
        "form": {
            "customerName": "Example",
            "finCode": "2221231",
            "signDate": "24.05.1998"
        }
    };
    const url = "http://localhost:9092/asan/asan-finance";
    let res = http.post(url, payload, { headers: { timeout: 0 } });
    if (res.status !== 200) { console.log(res.status) };
    check(res, {
        "is status 200": (r) => r.status === 200,
        "is file provided": (r) => r.body && r.body.length > 0,
    });
};
