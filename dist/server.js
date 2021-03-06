"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SetupServer = void 0;

var _core = require("@overnightjs/core");

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _expressPinoLogger = _interopRequireDefault(require("express-pino-logger"));

var _cors = _interopRequireDefault(require("cors"));

var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));

var _expressOpenapiValidator = require("express-openapi-validator");

var _apiSchema = _interopRequireDefault(require("./api.schema.json"));

var _forecast = require("./controllers/forecast");

var database = _interopRequireWildcard(require("./database"));

var _beaches = require("./controllers/beaches");

var _users = require("./controllers/users");

var _logger = _interopRequireDefault(require("./logger"));

var _apiErrorValidator = require("./middlewares/api-error-validator");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SetupServer extends _core.Server {
  constructor(port = 3000) {
    super();
    this.port = port;
  }

  async init() {
    this.setupExpress();
    await this.docsSetup();
    this.setupControllers();
    await this.setupDatabase();
    this.setupErrorHandlers();
  }

  getApp() {
    return this.app;
  }

  setupExpress() {
    this.app.use(_bodyParser.default.json());
    this.app.use((0, _expressPinoLogger.default)({
      logger: _logger.default
    }));
    this.app.use((0, _cors.default)({
      origin: "*"
    }));
  }

  async setupDatabase() {
    await database.connect();
  }

  setupControllers() {
    const forecastController = new _forecast.ForecastController();
    const beachesController = new _beaches.BeachesController();
    const usersController = new _users.UsersController();
    this.addControllers([forecastController, beachesController, usersController]);
  }

  setupErrorHandlers() {
    this.app.use(_apiErrorValidator.apiErrorValidator);
  }

  async docsSetup() {
    this.app.use("/docs", _swaggerUiExpress.default.serve, _swaggerUiExpress.default.setup(_apiSchema.default));
    await new _expressOpenapiValidator.OpenApiValidator({
      apiSpec: _apiSchema.default,
      validateRequests: true,
      validateResponses: true
    }).install(this.app);
  }

  start() {
    this.app.listen(process.env.PORT || this.port, () => {
      _logger.default.info(`Server listening of port ${this.port}`);
    });
  }

  async close() {
    await database.close();
  }

}

exports.SetupServer = SetupServer;