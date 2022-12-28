import {Request, Response} from "express";
import path from "path";
import promisify from "../utils/promisify"
import auth from "../middleWares/authMiddleWare";

const express = require('express'),
    router = express.Router()

router.route('/')
    .get(auth,async (req: Request, res: Response) => {

        let allClients = JSON.parse(await promisify.readFileAsync(path.join(__dirname, '..','db','users.json')))

        return res.status(200).send(allClients)
})
    .post(auth,(req: Request, res: Response) => {
    res.send('create client...')
})
    .put(auth,(req: Request, res: Response) => {
    res.send('update client...')
})
    .delete(auth,(req: Request, res: Response) => {
    res.send('delete client...')
})

module.exports = router