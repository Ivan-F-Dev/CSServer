import jwt from "jsonwebtoken";

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
export type bodyWithOrder = {
    id: string
    buyCount: string
    token?: string|jwt.JwtPayload
}


