import cors from 'cors';
import express, { Application } from 'express';
import { errorMiddleware } from './middlewares/error.middleware';
import routes from './routes';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/', routes);

app.use(errorMiddleware);

export default app;
