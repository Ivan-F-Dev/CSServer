import ErrnoException = NodeJS.ErrnoException;

const fs = require('fs')

const promisify = {
    readFileAsync (path:String):Promise<any> {
        return new Promise( (resolve, reject) => {

            fs.readFile(path, (err:ErrnoException,data:Buffer) => {
                if (err) {
                    console.log(`Ошибка в fs.readFile по пути: ${__dirname + '\\' + path}`)
                    resolve(false)
                    throw err
                }
                resolve(data)
            })
        } )
    },
    writeFileAsync (path:String, writeData:String):Promise<boolean>  {
        return new Promise( (resolve, reject) => {

            fs.writeFile(path, writeData, (err:ErrnoException) => {
                if (err) {
                    console.log(`Ошибка в fs.writeFile\n путь: ${__dirname + '\\' + path} \n данные: ${writeData}`)
                    resolve(false)
                    throw err
                }
                resolve(true)
            })
        } )
    }
}

export default promisify