"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UsersController = void 0;

var _core = require("@overnightjs/core");

var _user = require("../models/user");

var _ = require(".");

var _auth = _interopRequireDefault(require("../services/auth"));

var _dec, _dec2, _dec3, _class, _class2;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

let UsersController = (_dec = (0, _core.Controller)("users"), _dec2 = (0, _core.Post)(""), _dec3 = (0, _core.Post)("authenticate"), _dec(_class = (_class2 = class UsersController extends _.BaseController {
  async create(req, res) {
    try {
      const user = new _user.User(req.body);
      const newUser = await user.save();
      res.status(201).send(newUser);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  async authenticate(req, res) {
    const {
      email,
      password
    } = req.body;
    const user = await _user.User.findOne({
      email
    });

    if (!user) {
      return this.sendErrorResponse(res, {
        code: 401,
        message: "User not found"
      });
    }

    const isPasswordsEqual = await _auth.default.comparePasswords(password, user.password);

    if (!isPasswordsEqual) {
      return this.sendErrorResponse(res, {
        code: 401,
        message: "Password does not match!"
      });
    }

    const token = _auth.default.generateToken(user.toJSON());

    return res.status(200).send({ ...user.toJSON(),
      ...{
        token
      }
    });
  }

}, (_applyDecoratedDescriptor(_class2.prototype, "create", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "create"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "authenticate", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "authenticate"), _class2.prototype)), _class2)) || _class);
exports.UsersController = UsersController;