import express from 'express';
import AppLoger from './App Loger/app_loger';
import Database from './config/database';
import UserRouter from './Routing/Routing';

const app: express.Application = express();

app.use(express.json());

app.use(AppLoger);

app.use('/v1/api', UserRouter);



const port = 5000;
const hostname = 'localhost'

app.listen(port, hostname, async () => {
    await Database.connectToDatabase();
    console.log(`http://${hostname}:${port}`);
    // console.log(`Server is running on port ${port}`);
});

export default app;