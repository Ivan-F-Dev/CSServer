import {CategoriesNameEnum} from "./Enums";

export type UserEntity = {
    id: number
    name: string
    surname: string
    dateOfBirth: string
    phoneNumber: string
    email: string
    login: string
    password: string
    roles: Array<string>
}
export type CategoryEntity = {
    title: string
    img: string
    categoryName: CategoriesNameEnum
    prefix: string
}

export type OrderEntity = {
    id: number
    clientId: number
    prods: Array<OrderItem>
    date: string
}
export type OrderItem = {
    id: string
    buyCount: number
}

export type ProductEntity = {
    id: string
    category: CategoriesNameEnum
    producer: string
    model: string
    price: string
    img: string
    count: number
    color: string
    rom?: string
    ram?: string
    displayType?: string
    displaySize?: string
    CPU?: string
    GPU?: string
    mainCam?: string
    frontCam?: string
    interfaces?: string
    weight?: string
    screenResolution?: string
    aspectRatio?: string
    matrixType?: string
    videoRecordingQuality?: string
    frameRate?: string
}