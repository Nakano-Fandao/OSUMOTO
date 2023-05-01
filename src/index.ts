import express, { Application, Request, Response } from 'express';
import { middleware, WebhookEvent } from '@line/bot-sdk';
import { lineBotConfig, textEventHandler } from './line';

import { load } from 'ts-dotenv';
import { checkAsk } from './gpt';
const env = load({
  PORT: String,
});
const PORT = env.PORT || 3000;

const app: Application = express();

app.get('/', async (req: Request, res: Response) => {
  const message = await checkAsk("Hello")
  res.send(message)
});

app.post('/webhook', middleware(lineBotConfig),
  async (req: Request, res: Response): Promise<Response> => {
    await Promise.all(
      req.body.events.map( async (event: WebhookEvent) => {
        try {
          await textEventHandler(event);
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error(err);
          }
          return res.status(500);
        }
      })
    );
    return res.status(200);
  }
);

app.listen(PORT);
console.log(`Server running at ${PORT}`);