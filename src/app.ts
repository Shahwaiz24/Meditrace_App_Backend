import express from 'express';
import AppLoger from './App Loger/app_loger';
import Database from './config/database';

const app: express.Application = express();

app.use(AppLoger);

const port = 5000;
const hostname = 'localhost'

app.listen(port, hostname, async () => {
    await Database.connectToDatabase();
    console.log(`http://${hostname}:${port}`);
    console.log(`Server is running on port ${port}`);


});