import express from 'express';
import AppLoger from './App Loger/app_loger';
import Database from './config/database';
import UserRouter from './Routing/Routing';
import FirebaseConfig from './config/firebase-config';

const app: express.Application = express();

app.use(express.json());

app.use(AppLoger);

app.use('/v1/api', UserRouter);



const port = parseInt(process.env.PORT as string, 10) || 5000;
app.listen(port,"localhost", async () => {
  await Database.connectToDatabase();
  await FirebaseConfig.initializeFirebaseApp();
  console.log(`Server is running on port https://localhost:${port}/v1/api`);

});

export default app;