import {MongoClient} from "mongodb";

async function connectToDB() {
   const client = new MongoClient(process.env.MONGO_URL);
   await client.connect();
   console.log("Connected to MongoDB");
   return client.db();
}

export const db = await connectToDB();
