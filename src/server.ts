import { Server } from "@overnightjs/core";
import bodyParser from "body-parser";
import { Application } from "express";
import expressPino from "express-pino-logger";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import { OpenApiValidator } from "express-openapi-validator";
import { OpenAPIV3 } from "express-openapi-validator/dist/framework/types";

import apiSchema from "./api.schema.json";
import { ForecastController } from "./controllers/forecast";
import * as database from "@src/database";
import { BeachesController } from "./controllers/beaches";
import { UsersController } from "./controllers/users";
import logger from "./logger";
import { apiErrorValidator } from "./middlewares/api-error-validator";

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    await this.docsSetup();
    this.setupControllers();
    await this.setupDatabase();
    this.setupErrorHandlers();
  }

  public getApp(): Application {
    return this.app;
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
    this.app.use(
      expressPino({
        logger,
      })
    );
    this.app.use(
      cors({
        origin: "*",
      })
    );
  }

  private async setupDatabase(): Promise<void> {
    await database.connect();
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    const beachesController = new BeachesController();
    const usersController = new UsersController();
    this.addControllers([
      forecastController,
      beachesController,
      usersController,
    ]);
  }
  private setupErrorHandlers(): void {
    this.app.use(apiErrorValidator);
  }

  private async docsSetup(): Promise<void> {
    this.app.use("/docs", swaggerUI.serve, swaggerUI.setup(apiSchema));
    await new OpenApiValidator({
      apiSpec: apiSchema as OpenAPIV3.Document,
      validateRequests: true,
      validateResponses: true,
    }).install(this.app);
  }

  public start(): void {
    this.app.listen(process.env.PORT || this.port, () => {
      logger.info(`Server listening of port ${this.port}`);
    });
  }

  public async close(): Promise<void> {
    await database.close();
  }
}
