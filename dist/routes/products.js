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
// type OrderItem = {
//         id:string,
//         buyCount:number
// }
const express = require('express'), router = express.Router();
router.route('/')
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(req.query.hasOwnProperty('category')))
        return res.status(400).json({ message: "Отсутствует поле категории товара" });
    let allProds, selectedProd;
    allProds = JSON.parse(yield promisify_1.default.readFileAsync(path_1.default.join(__dirname, '..', 'db', 'products.json')));
    selectedProd = allProds.filter((el) => el.category === req.query.category);
    return res.status(200).send(selectedProd);
}))
    .post(authMiddleWare_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(req.body.hasOwnProperty('order'))) {
        if (req.body.order.length <= 0)
            return res.status(400).json({ message: "Заказ пустой" });
        return res.status(400).json({ message: "Отсутствует поле 'prods: Array<{prod}>'" });
    }
    let newProds, prods, order = req.body.order, writeSuccess, supportArr = [null, [], []]; //new Array(order.length).fill({})
    prods = JSON.parse(yield promisify_1.default.readFileAsync(path_1.default.join(__dirname, '..', 'db', 'products.json')));
    newProds = [...JSON.parse(JSON.stringify(prods))];
    for (let i = 0; i < order.length; i++) {
        let index = prods.findIndex((el) => el.id === order[i].id);
        console.log("newProds[index]: ", newProds[index], " order[i]: ", order[i]);
        if (newProds[index].count < order[i].buyCount)
            return res.status(200).send({ error: 'недостаточно товара на складе', product: newProds[index].producer + ' ' + newProds[index].model, count: newProds[index].count, buyCount: order[i].buyCount });
        newProds[index] = Object.assign(Object.assign({}, newProds[index]), { count: newProds[index].count - order[i].buyCount });
        supportArr[1].push(prods[index]);
        supportArr[2].push(newProds[index]);
    }
    writeSuccess = yield promisify_1.default.writeFileAsync(path_1.default.join(__dirname, '..', 'db', 'products.json'), JSON.stringify(newProds));
    if (writeSuccess) {
        let orders; //,newOrder:OrderEntity
        orders = JSON.parse(yield promisify_1.default.readFileAsync(path_1.default.join(__dirname, '..', 'db', 'orders.json')));
        orders.push({
            id: orders[orders.length - 1].id + 1,
            clientId: req.body.token.id,
            date: new Date().toDateString(),
            prods: order
        });
        supportArr[0] = orders[orders.length - 1];
        yield promisify_1.default.writeFileAsync(path_1.default.join(__dirname, '..', 'db', 'orders.json'), JSON.stringify(orders));
    }
    return writeSuccess ? res.status(200).send({ order: supportArr[0], oldProds: supportArr[1], newProds: supportArr[2] }) : res.status(500).send('an error occurred while writing the file');
}))
    .put(authMiddleWare_1.default, (req, res) => {
    res.send('update product...');
})
    .delete(authMiddleWare_1.default, (req, res) => {
    res.send('delete product...');
});
module.exports = router;
