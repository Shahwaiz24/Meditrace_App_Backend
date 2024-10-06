"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
let AppLoger = async (request, response, next) => {
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let url = request.url;
    let method = request.method;
    console.log(`${date} | ${time} | ${method} | ${url}`);
    let db = await database_1.default.getDatabase();
    let requestCollection = db.collection('requests_tracks');
    await requestCollection.insertOne({
        'Date': date,
        'Time': time,
        'Method': method.toString(),
        'url': url.toString()
    });
    next();
};
exports.default = AppLoger;
