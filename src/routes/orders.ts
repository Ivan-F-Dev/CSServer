import {Request, Response} from "express";
import path from "path";
import promisify from "../utils/promisify"

const express = require('express'),
    router = express.Router()

router.route('/')
    .get(async (req: Request, res: Response) => {

        let allOrders = JSON.parse(await promisify.readFileAsync(path.join(__dirname, '..','db','orders.json')))

        return res.status(200).send(allOrders)
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