import express from 'express';

let AppLoger = async (request: express.Request, response: express.Response, next: express.NextFunction) =>  {

    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();

    let url = request.url;
    let method = request.method;
    console.log(`${date} | ${time} | ${method} | ${url}`);

}

export default AppLoger;