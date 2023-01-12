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
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const promisify_1 = __importDefault(require("../utils/promisify"));
const authMiddleWare_1 = __importDefault(require("../middleWares/authMiddleWare"));
const generateAccessToken = (id, roles) => {
    const payload = { id, roles };
    return jsonwebtoken_1.default.sign(payload, require('../config').secretKey, { expiresIn: '12h' });
};
const router = express_1.default.Router();
router.get('/users', authMiddleWare_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log('in get handler')
    let allUsers = JSON.parse(yield promisify_1.default.readFileAsync(path_1.default.join(__dirname, '..', 'db', 'users.json')));
    res.json(allUsers);
}));
router.post('/login', [
    (0, express_validator_1.check)('login', 'Логин должен иметь длину от 6 до 20 символов').isLength({ min: 6, max: 20 }),
    (0, express_validator_1.check)('password', 'Пароль должен иметь длину от 6 до 12 символов').isLength({ min: 6, max: 12 })
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ message: 'Ошибка при регистрации', errors });
    const { login, password } = req.body;
    let allUsers = JSON.parse(yield promisify_1.default.readFileAsync(path_1.default.join(__dirname, '..', 'db', 'users.json')));
    const user = allUsers.find((el) => el.login === login);
    if (!user)
        return res.status(400).json({ message: "Неверный логин" });
    const validPas = bcryptjs_1.default.compareSync(password, user.password);
    if (!validPas)
        return res.status(400).json({ message: "Неверный пароль" });
    let token = generateAccessToken(user.id, user.roles);
    return res.status(200).json({ message: 'Вход выполнен успешно', token: token, user });
}));
router.post('/registration', [
    (0, express_validator_1.check)('login', 'Логин должен иметь длину от 6 до 20 символов').isLength({ min: 6, max: 20 }),
    (0, express_validator_1.check)('password', 'Пароль должен иметь длину от 6 до 12 символов').isLength({ min: 6, max: 12 }),
    (0, express_validator_1.check)('name', 'Логин должен иметь длину от 6 до 20 символов').isLength({ min: 1, max: 20 }),
    (0, express_validator_1.check)('surname', 'Фамилия должна иметь длину от 1 до 20 символов').isLength({ min: 1, max: 20 }),
    (0, express_validator_1.check)('dateOfBirth', 'Дату рождения нужно указать в формате "гггг-мм-дд"').isLength({ min: 10, max: 10 })
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('registration');
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ message: 'Ошибка при регистрации', errors });
    const { login, password, name, surname, dateOfBirth } = req.body;
    let allUsers = JSON.parse(yield promisify_1.default.readFileAsync(path_1.default.join(__dirname, '..', 'db', 'users.json')));
    const candidate = allUsers.find((el) => el.login === login);
    if (candidate)
        return res.status(400).json({ message: "Пользователь с таким логином уже существует" });
    const newUser = {
        id: allUsers[allUsers.length - 1].id + 1,
        name: name,
        surname: surname,
        dateOfBirth: dateOfBirth,
        phoneNumber: '',
        email: '',
        login: login,
        password: bcryptjs_1.default.hashSync(password, 7),
        roles: ["USER"]
    };
    allUsers.push(newUser);
    yield promisify_1.default.writeFileAsync(path_1.default.join(__dirname, '..', 'db', 'users.json'), JSON.stringify(allUsers));
    res.status(200).json({ message: "Регистрация нового пользователя прошла успешно", newUser });
}));
module.exports = router;
