import { appRouter } from './root';
import { createTRPCContext } from './trpc';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import cors from 'cors';
import express from 'express';

const app = express();
const port = 4000;

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: false,
  }),
);

app.use(express.json());

app.use(
  '/api/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext: createTRPCContext,
  }),
);

// Start the server
app.listen(port, () => {
  console.log(`Express server listening on http://localhost:${port}`);
});
