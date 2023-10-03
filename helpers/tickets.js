import {db} from "../db.js";

export async function getTickets() {
   const data = await db.collection("tickets").find({}).project({_id: 0}).toArray();
   return data;
}

export async function getTicketById(id) {
   const ticket = await db.collection("tickets").findOne({_id: id});
   return ticket;
}

export async function createTicket(info) {
   const ticket = {...info};
   // {
   //    title, // required
   //    categoryId, // required
   //    subcategoryIndex, // required
   //    priority, // required
   //    intermediaries,
   //    closingComment,
   //    description,
   //    classroomId,
   //    status, // required
   //    createdAt, // required
   //    closedAt,
   // }
   ticket.closingComment = null;
   ticket.closedAt = null;
   ticket.createdAt = new Date();
   const result = await db.collection("tickets").insertOne(ticket);
   return result;
}

export async function updateTicket(id, ticket) {
   delete ticket._id; // borrando el id unico por el momento para que funcione
   const result = await db.collection("tickets").updateOne({id: Number(id)}, {$set: ticket});
   return result;
}

export async function deleteTicket(id) {
   const result = await db.collection("tickets").deleteOne({id: Number(id)});
   return result;
}
