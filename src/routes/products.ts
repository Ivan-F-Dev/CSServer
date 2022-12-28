import {Request, Response} from "express";
import path from "path";
import promisify from "../utils/promisify"
import {RequestWithBody} from "../types/Response&Request";
import {bodyWithOrder, bodyWithToken} from "../types/RequestBodies";
import auth from "../middleWares/authMiddleWare";

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
    .post(auth, async (req: RequestWithBody<bodyWithOrder>, res: Response) => {
        console.log(req.body.token)

        if ( !(req.body.hasOwnProperty('buyCount') && req.body.hasOwnProperty('id')) ) return  res.status(400).json({message:"Отсутствует поля количество и id"})

        let curData, elemIndex, newData, newElem, entryStatus

        curData = JSON.parse(await promisify.readFileAsync(path.join(__dirname, '..','db','products.json')))

        elemIndex = curData.findIndex((el:any) => el.id === req.body.id)

        newElem = {...curData[elemIndex], count: curData[elemIndex].count - Number(req.body.buyCount)}

        newData = [...curData]; newData[elemIndex] = newElem

        entryStatus = await promisify.writeFileAsync(path.join(__dirname, '..','db','products.json'),JSON.stringify(newData))

        return entryStatus ? res.status(200).send([curData[elemIndex],newData[elemIndex]]): res.status(500).send('an error occurred while writing the file')
})
    .put(auth,(req: Request, res: Response) => {
    res.send('update product...')
})
    .delete(auth,(req: Request, res: Response) => {
    res.send('delete product...')
})

module.exports = router