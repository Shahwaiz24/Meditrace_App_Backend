import { Db, MongoClient, MongoClientOptions } from "mongodb";
let database: Db;
let url = "mongodb+srv://shahwaizafzal90:shahwaizafzal1122@music-backend.wb8uu.mongodb.net/?retryWrites=true&w=majority&appName=music-backend";

const options: MongoClientOptions = {
    tls: true,
    tlsAllowInvalidCertificates: true,
    connectTimeoutMS: 20000, // Increased to 20 seconds
    socketTimeoutMS: 60000, // Increased to 60 seconds
    serverSelectionTimeoutMS: 10000, // Increased to 10 seconds
    maxPoolSize: 10, // Maintain up to 10 socket connections
};



class Database {
    static async connectToDatabase() {

        // console.log('Database Not Defined');
        if (database != null && database != undefined) {
            console.log(`Database Already Connected`);
            console.log(`Database Name ${database.databaseName}`)
        }
        else {
            try {

                const client = new MongoClient(url, options);
                await client.connect();
                database = client.db("Meditrace_App_Data");// Assign the connected 
                console.log("Database Connected Successfully");
                console.log(`Database Name ${database.databaseName}`)
            } catch (error) {
                console.error(`An error occurred while connecting to the database: ${error}`);


            }
        }



    }
    static async getDatabase() {
        // console.log(`Database : ${database.databaseName}`);
        // return database;
       if (database == undefined) {
           await Database.connectToDatabase()
           return database;
       }
       else {
           return database;
       }
    }
}

export default Database;