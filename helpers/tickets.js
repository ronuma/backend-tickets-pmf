import {db} from "../db.js";

export async function getTickets() {
   const data = await db.collection("tickets").find({}).project({_id: 0}).toArray();
   return data;
}

export async function getTicketById(id) {
   const ticket = await db.collection("tickets").findOne({id: Number(id)});
   return ticket;
}

export async function createTicket(ticket) {
   const result = await db.collection("tickets").insertOne(ticket);
   return result;
}

export async function updateTicket(id, ticket) {
   const result = await db.collection("tickets").updateOne({id: Number(id)}, {$set: ticket});
   return result;
}

export async function deleteTicket(id) {
   const result = await db.collection("tickets").deleteOne({id: Number(id)});
   return result;
}
