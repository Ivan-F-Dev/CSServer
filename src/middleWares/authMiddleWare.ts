import {NextFunction, Request, Response} from "express";
import {RequestWithBody} from "../types/Response&Request"
import jwt, {JwtPayload} from 'jsonwebtoken'
import {RolesEnum} from "../types/Enums";
const config = require('../config')


interface Payload extends JwtPayload {
    id:number
    roles:Array<RolesEnum>
}

const authMiddleWare = function (req: RequestWithBody<{token: string | Payload}>,res: Response,next:NextFunction) {

    if (req.method === "OPTIONS") next()

    try {

        if (!req.headers.authorization) return res.status(403).json({message: "Пользователь не авторизован", description: "no authorization header"})

        const token:string = req.headers.authorization.split(' ')[1]

        if (!token) return res.status(403).json({message: "Пользователь не авторизован", description: "no token in authorization header"})

        req.body.token = jwt.verify(token, config.secretKey) as Payload

        if (!req.body.token.roles.includes(RolesEnum.USER)) res.status(403).json({message: "Недостаточно прав", description: ""})

        next()

    } catch (e) {
        console.log(e)
        return res.status(403).json({message: "Пользователь не авторизован", error:e})
    }
}

export default authMiddleWare