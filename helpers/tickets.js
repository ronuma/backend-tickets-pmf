import {db} from "../db.js";

// gets all tickets and returns them as an array
export async function getTickets() {
   const data = await db.collection("tickets").find().toArray();
   return data;
}

// gets an individual ticket by its id and returns it
export async function getTicketById(id) {
   const ticket = await db.collection("tickets").findOne({id: Number(id)});
   return ticket;
}

// creates a ticket, and addas aditional info and returns the result
export async function createTicket(info) {
   const ticket = {...info};
   // insert created date and id
   ticket.createdAt = new Date();
   ticket.id = (await db.collection("tickets").countDocuments()) + 1;
   const result = await db.collection("tickets").insertOne(ticket);
   return result;
}

export async function updateTicket(id, ticket) {
   const prevTicket = await getTicketById(id);
   // insert closed date comparing with previous status
   if (prevTicket.status !== 2 && ticket.status === 2) {
      ticket.closedAt = new Date();
   }
   const result = await db.collection("tickets").updateOne({id: Number(id)}, {$set: ticket});
   return result;
}

export async function deleteTicket(id) {
   const result = await db.collection("tickets").deleteOne({id: Number(id)});
   return result;
}
