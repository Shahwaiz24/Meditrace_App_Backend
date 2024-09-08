import express from 'express';
import Database from '../config/database';
import { Db } from 'mongodb';

let AppLoger = async (request: express.Request, response: express.Response, next: express.NextFunction) =>  {

    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();

    let url = request.url;
    let method = request.method;
    console.log(`${date} | ${time} | ${method} | ${url}`);

    let db: Db = await Database.getDatabase();
    let requestCollection = db.collection('requests_tracks');
    await requestCollection.insertOne({
        'Date': date,
        'Time': time,
        'Method': method.toString(),
        'url': url.toString()
    });

    next();

}

export default AppLoger;