"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Enums_1 = require("../types/Enums");
const config = require('../config');
const authMiddleWare = function (req, res, next) {
    if (req.method === "OPTIONS")
        next();
    try {
        if (!req.headers.authorization)
            return res.status(403).json({ message: "Пользователь не авторизован", description: "no authorization header" });
        const token = req.headers.authorization.split(' ')[1];
        if (!token)
            return res.status(403).json({ message: "Пользователь не авторизован", description: "no token in authorization header" });
        req.body.token = jsonwebtoken_1.default.verify(token, config.secretKey);
        if (!req.body.token.roles.includes(Enums_1.RolesEnum.USER))
            res.status(403).json({ message: "Недостаточно прав", description: "" });
        next();
    }
    catch (e) {
        console.log(e);
        return res.status(403).json({ message: "Пользователь не авторизован", error: e });
    }
};
exports.default = authMiddleWare;
