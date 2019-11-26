import { Router } from 'express';
import { ASAN_ROUTER } from './asan';

export const BASE_ROUTER = Router();

[
    {
        path: '/asan',
        router: ASAN_ROUTER,
    }
].forEach(route => {
    BASE_ROUTER.use(route.path, route.router);
});
