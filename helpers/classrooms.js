import {db} from "../db.js";
import {getTicketById} from "./tickets.js";

// gets all classrooms and returns them as an array
export async function getClassrooms() {
   const data = await db.collection("classrooms").find().toArray();
   for (const classroom of data) {
      const ticketObjs = [];
      delete classroom._id;
    if (classroom.tickets) {
      for (const ticket of classroom.tickets) {
        let ticketObj = await getTicketById(ticket);
        if (ticketObj) {
          ticketObjs.push(ticketObj);
        }
      }
      classroom.tickets = ticketObjs;
    }
   }

   return data;
}

// gets an individual classroom by its id and returns it
export async function getClassroomById(id) {
   const classroom = await db.collection("classrooms").findOne({id: Number(id)});
   delete classroom._id;
   const ticketObjs = [];
   for (const ticket of classroom.tickets) {
      ticketObjs.push(await getTicketById(ticket));
   }
   classroom.tickets = ticketObjs;
   return classroom;
}

export async function createClassroom(info) {
   const classroom = {...info};
   // get the last id and add 1
   const lastClassroom = await db.collection("classrooms").findOne({}, {sort: {id: -1}});
   classroom.id = lastClassroom ? lastClassroom.id + 1 : 1;
   const result = await db.collection("classrooms").insertOne(classroom);
   return result;
}

export async function editClassroom(info) {
   const classroom = {...info};
   const result = await db
      .collection("classrooms")
      .updateOne({id: Number(classroom.id)}, {$set: classroom});
   return result;
}

export async function deleteClassroom(id) {
   const result = await db.collection("classrooms").deleteOne({id: Number(id)});
   return result;
}
