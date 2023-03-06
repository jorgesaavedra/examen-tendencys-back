const {MongoClient} = require('mongodb');

let db = null;
const uri = process.env.MONGO_URI;
class DataBase {
    constructor(){
        this.initDB();
    }
    async initDB(){
    
        const client = new MongoClient(uri);
     
        let conn;
        try {
           
            conn = await client.connect();
            db = await conn.db("testone");
            console.log("mongo started");

            return db;
     
        } catch (e) {
            console.error(e);
        } finally {
            //await client.close();
        }
        
    };

    async getDB(){
        if (this.db) {
            console.log('return db');
            return db;
        } else {
            console.log('no db' + this.db);
            return this.initDB();
        }
    }
};
module.exports = new DataBase();