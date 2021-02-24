import path from 'path';
import express from 'express';
import type { Express, NextFunction, Request, Response } from 'express';
import * as OpenApiValidator from 'express-openapi-validator';
import { HttpException } from "./error";

export async function createServer(): Promise<Express> {
  const app = express();

  // Parse json to req.body
  app.use(express.json());

  const spec = path.resolve(__dirname, "../openapi.yml");

  app.get("/spec", (req, res) => {
    res.sendFile(spec);
  });

  app.use(OpenApiValidator.middleware({
    apiSpec: spec,
    validateRequests: true,
    validateResponses: false
  }));


  // Error handler
  app.use((err: HttpException | Error, req: Request, res: Response, next: NextFunction) => {
    if ('status' in err) {
      res.status(err.status || 500);
    } else {
      res.status(500);
    }
    res.json({
      message: err.message,
    });
  });

  app.get("/ping", (req, res) => {
    res.send("OK");
  });

  return app;
}