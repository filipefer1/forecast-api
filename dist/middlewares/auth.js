"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authMiddleware = authMiddleware;

var _auth = _interopRequireDefault(require("../services/auth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function authMiddleware(req, res, next) {
  var _req$headers;

  const token = (_req$headers = req.headers) === null || _req$headers === void 0 ? void 0 : _req$headers["x-access-token"];

  try {
    const decoded = _auth.default.decodeToken(token);

    req.decoded = decoded;
    next();
  } catch (err) {
    var _res$status;

    (_res$status = res.status) === null || _res$status === void 0 ? void 0 : _res$status.call(res, 401).send({
      code: 401,
      error: err.message
    });
  }
}