import {MongoClient} from "mongodb";

export async function connectToDB() {
   const client = new MongoClient("mongodb://localhost:27017/db401test");
   await client.connect();
   console.log("Connected to MongoDB");
   return client.db();
}