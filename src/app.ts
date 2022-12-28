import {Request, Response} from "express";
import path from "path";
import express from 'express'
import cors from 'cors'

const app = express(), port = 3000



app.use(cors({
    origin: 'http://localhost:3001'
}))
app.use(express.urlencoded({extended:false}))//позволяет получать body запроса
app.use(express.json())//позволяет получать json запроса
app.use('/images', express.static( path.join(__dirname,'public','images')));

app.use('/auth', require('./routes/auth'))
app.use('/categories', require('./routes/categories'))
app.use('/products', require('./routes/products'))
app.use('/orders', require('./routes/orders'))
app.use('/clients', require('./routes/clients'))





app.get('/',(req: Request,res:Response) => {
    res.send('ok')
})

app.listen(port, () => {
    console.log(`App started on ${port} port`)
})