import express from 'express'
import path from "path";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {check,validationResult} from 'express-validator'
import promisify from "../utils/promisify"
import auth from "../middleWares/authMiddleWare"

import {Request, Response} from "express";
import {RequestWithBody} from "../types/Response&Request";
import {bodyForLog, bodyForReg} from "../types/RequestBodies";

const generateAccessToken = (id:number,roles:string[]) => {
    const payload = {id,roles}
    return jwt.sign(payload, require('../config').secretKey,{expiresIn:'12h'})
}

const router = express.Router()

router.get('/users',auth,async (req: RequestWithBody<{}>, res: Response) => {
    //console.log('in get handler')
    let allUsers = JSON.parse(await promisify.readFileAsync(path.join(__dirname, '..','db','users.json')))
    res.json(allUsers)
})

router.post('/login', [
    check('login','Логин должен иметь длину от 6 до 20 символов').isLength({min:6,max:20}),
    check('password','Пароль должен иметь длину от 6 до 12 символов').isLength({min:6,max:12})
],async (req: RequestWithBody<bodyForLog>, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({message:'Ошибка при регистрации', errors})

    const {login, password} = req.body;

    let allUsers = JSON.parse(await promisify.readFileAsync(path.join(__dirname, '..','db','users.json')))
    const user = allUsers.find((el:any) => el.login === login)
    if (!user) return res.status(400).json({message: "Неверный логин"})

    const validPas = bcrypt.compareSync(password,user.password)
    if (!validPas) return res.status(400).json({message: "Неверный пароль"})

    let token = generateAccessToken(user.id,user.roles)
    return res.status(200).json({message: 'Вход выполнен успешно',token: token})

})

router.post('/registration',[
    check('login','Логин должен иметь длину от 6 до 20 символов').isLength({min:6,max:20}),
    check('password','Пароль должен иметь длину от 6 до 12 символов').isLength({min:6,max:12}),
    check('name','Логин должен иметь длину от 6 до 20 символов').isLength({min:2,max:15}),
    check('surname','Фамилия должна иметь длину от 1 до 20 символов').isLength({min:1,max:20}),
    check('dateOfBirth','Дату рождения нужно указать в формате "ддммгггг"').isLength({min:8,max:8})
],async (req: RequestWithBody<bodyForReg>, res: Response) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({message:'Ошибка при регистрации', errors})

    const {login, password, name, surname, dateOfBirth} = req.body;
    let allUsers = JSON.parse(await promisify.readFileAsync(path.join(__dirname, '..','db','users.json')))
    const candidate = allUsers.find((el:any) => el.login === login)

    if (candidate) return res.status(400).json({message: "Пользователь с таким именем уже существует"})

    const newUser = {
        id: allUsers[allUsers.length-1].id + 1 ,
        name: name,
        surname: surname,
        dateOfBirth: dateOfBirth,
        login: login,
        password: bcrypt.hashSync(password, 7),
        roles: ["USER"]
    }
    allUsers.push(newUser)
    await promisify.writeFileAsync(path.join(__dirname, '..','db','users.json'), JSON.stringify(allUsers))
    res.status(200).json({message:"Регистрация нового пользователя прошла успешно",newUser})
})


module.exports = router