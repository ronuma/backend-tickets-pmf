import {db} from "../db.js";

export async function getCategories() {
   const data = await db.collection("categories").find({}).project({_id: 0}).toArray();
   return data;
}
