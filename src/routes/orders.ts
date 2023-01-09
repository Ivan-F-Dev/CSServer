import {Request, Response} from "express";
import path from "path";
import promisify from "../utils/promisify"
import {OrderEntity} from "../types/Entities";

const express = require('express'),
    router = express.Router()

router.route('/')
    .get(async (req: Request, res: Response) => {
        const id = req.query.id
        let allOrders:Array<OrderEntity>,userOrders:Array<OrderEntity>

        if (!id) res.status(400).json({message: "Не передан id query"})

        allOrders = JSON.parse(await promisify.readFileAsync(path.join(__dirname, '..','db','orders.json')))
        //if (id === 'all')  return res.status(200).send(allOrders)
        userOrders = allOrders.filter(value => value.clientId === Number(id))

        return res.status(200).json(userOrders)
})
    .post((req: Request, res: Response) => {
    res.send('create order...')
})
    .put((req: Request, res: Response) => {
    res.send('update order...')
})
    .delete((req: Request, res: Response) => {
    res.send('delete order...')
})

module.exports = router