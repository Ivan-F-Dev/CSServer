import {Request, Response} from "express";
import path from "path";
import promisify from "../utils/promisify"
import {RequestWithBody} from "../types/Response&Request";
import {bodyWithToken} from "../types/RequestBodies";
import auth from "../middleWares/authMiddleWare";

const express = require('express'),
    router = express.Router()

router.route('/')
    .get(async (req: RequestWithBody<bodyWithToken>, res: Response) => {

        let allCats = JSON.parse(await promisify.readFileAsync(path.join(__dirname, '..','db','categories.json')))

        return res.status(200).send(allCats)
})
    .post(auth,(req: Request, res: Response) => {
    res.send('create category...')
})
    .put(auth,(req: Request, res: Response) => {
    res.send('update category...')
})
    .delete(auth,(req: Request, res: Response) => {
    res.send('delete category...')
})

module.exports = router