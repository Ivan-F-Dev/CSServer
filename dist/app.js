"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)(), port = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    origin: '*'
    // origin: 'http://localhost:3001'
}));
app.use(express_1.default.urlencoded({ extended: false })); //позволяет получать body запроса
app.use(express_1.default.json()); //позволяет получать json запроса
app.use('/images', express_1.default.static(path_1.default.join(__dirname, 'public', 'images')));
app.use('/auth', require('./routes/auth'));
app.use('/categories', require('./routes/categories'));
app.use('/products', require('./routes/products'));
app.use('/orders', require('./routes/orders'));
app.use('/clients', require('./routes/clients'));
app.get('/', (req, res) => {
    res.send('ok');
});
app.listen(port, () => {
    console.log(`App started on ${port} port`);
});
