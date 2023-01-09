import jwt from "jsonwebtoken";
import {OrderEntity} from "./Entities";

export type bodyForReg = {
    name: string
    surname: string
    dateOfBirth: string
    login: string
    password: string
}
export type bodyForLog = {
    login: string
    password: string
}
export type bodyWithToken = {
    token: string|jwt.JwtPayload
}
// export interface bodyWithOrder extends OrderEntity {
//     token?: string|jwt.JwtPayload
// }



