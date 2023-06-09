import express, { Express } from 'express';
import dotenv from 'dotenv';
import routes from './routes/index';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

app.use('/api', routes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

export default app;
