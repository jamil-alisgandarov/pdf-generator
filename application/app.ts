import * as express from 'express';
import { PORT } from './consts';
import { BASE_ROUTER } from './routes';
import { Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-Parser';

export const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Expose-Headers', 'Content-Length,Content-Range');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use('/', BASE_ROUTER);

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})
