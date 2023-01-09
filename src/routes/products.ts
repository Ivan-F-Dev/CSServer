import {Request, Response} from "express";
import path from "path";
import promisify from "../utils/promisify"
import {RequestWithBody} from "../types/Response&Request";
import {bodyWithToken} from "../types/RequestBodies";
import auth, {Payload} from "../middleWares/authMiddleWare";
import {OrderEntity, OrderItem, ProductEntity, UserEntity} from "../types/Entities";

const express = require('express'),
    router = express.Router()

router.route('/')
    .get(async (req: RequestWithBody<bodyWithToken>, res: Response) => {

        if ( !(req.query.hasOwnProperty('category'))) return  res.status(400).json({message:"Отсутствует поле категории товара"})

        let allProds, selectedProd

        allProds = JSON.parse(await promisify.readFileAsync(path.join(__dirname, '..','db','products.json')))

        selectedProd = allProds.filter( (el:any) => el.category === req.query.category)

        return res.status(200).send(selectedProd)
})
    .post(auth, async (req: RequestWithBody<{order:Array<OrderItem>,token:Payload}>, res: Response) => {


        if ( !(req.body.hasOwnProperty('order')) ) {
                if (req.body.order.length <= 0) return res.status(400).json({message: "Заказ пустой"})
                return res.status(400).json({message: "Отсутствует поле 'prods: Array<{prod}>'"})
        }
        let newProds,prods:Array<ProductEntity>, order:Array<OrderItem> = req.body.order, writeSuccess:boolean, supportArr:Array<any> = [null,[],[]]//new Array(order.length).fill({})

        prods = JSON.parse(await promisify.readFileAsync(path.join(__dirname, '..','db','products.json')))
        newProds = [...JSON.parse(JSON.stringify(prods))] as ProductEntity[]

        for (let i = 0;i<order.length;i++) {

                let index = prods.findIndex((el) => el.id === order[i].id)
                console.log("newProds[index]: ",newProds[index]," order[i]: ",order[i])
                if (newProds[index].count<order[i].buyCount) return res.status(200).send({error:'недостаточно товара на складе',product:newProds[index].producer+' '+newProds[index].model,count:newProds[index].count,buyCount: order[i].buyCount})

                newProds[index] = {...newProds[index],count: newProds[index].count - order[i].buyCount}

                supportArr[1].push(prods[index])
                supportArr[2].push(newProds[index])
        }

        writeSuccess = await promisify.writeFileAsync(path.join(__dirname, '..','db','products.json'),JSON.stringify(newProds))

        if (writeSuccess) {
                let orders:Array<OrderEntity>//,newOrder:OrderEntity

                orders = JSON.parse(await promisify.readFileAsync(path.join(__dirname, '..','db','orders.json')))
                orders.push({
                        id: orders[orders.length-1].id + 1,
                        clientId: req.body.token.id,
                        date: new Date().toDateString(),
                        prods: order
                })
                supportArr[0] = orders[orders.length-1]
                await promisify.writeFileAsync(path.join(__dirname, '..','db','orders.json'),JSON.stringify(orders))
        }

        return writeSuccess ? res.status(200).send({order:supportArr[0],oldProds:supportArr[1],newProds:supportArr[2]}): res.status(500).send('an error occurred while writing the file')

})
    .put(auth,(req: Request, res: Response) => {
    res.send('update product...')
})
    .delete(auth,(req: Request, res: Response) => {
    res.send('delete product...')
})

module.exports = router