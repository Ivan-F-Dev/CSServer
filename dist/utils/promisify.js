"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const promisify = {
    readFileAsync(path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (err, data) => {
                if (err) {
                    console.log(`Ошибка в fs.readFile по пути: ${__dirname + '\\' + path}`);
                    resolve(false);
                    throw err;
                }
                resolve(data);
            });
        });
    },
    writeFileAsync(path, writeData) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, writeData, (err) => {
                if (err) {
                    console.log(`Ошибка в fs.writeFile\n путь: ${__dirname + '\\' + path} \n данные: ${writeData}`);
                    resolve(false);
                    throw err;
                }
                resolve(true);
            });
        });
    }
};
exports.default = promisify;
