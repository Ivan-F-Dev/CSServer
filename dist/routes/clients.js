"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const promisify_1 = __importDefault(require("../utils/promisify"));
const authMiddleWare_1 = __importDefault(require("../middleWares/authMiddleWare"));
const express = require('express'), router = express.Router();
router.route('/')
    .get(authMiddleWare_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let allClients = JSON.parse(yield promisify_1.default.readFileAsync(path_1.default.join(__dirname, '..', 'db', 'users.json')));
    return res.status(200).send(allClients);
}))
    .post(authMiddleWare_1.default, (req, res) => {
    res.send('create client...');
})
    .put(authMiddleWare_1.default, (req, res) => {
    res.send('update client...');
})
    .delete(authMiddleWare_1.default, (req, res) => {
    res.send('delete client...');
});
module.exports = router;
