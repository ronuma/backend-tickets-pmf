import {db} from "../db.js";

// gets all classrooms and returns them as an array
export async function getClassrooms() {
   const data = await db.collection("classrooms").find().toArray();
   data.forEach(classroom => {
      delete classroom._id;
   });
   return data;
}
