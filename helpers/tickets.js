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
   delete ticket._id; // borrando el id unico por el momento para que funcione
   const result = await db.collection("tickets").updateOne({id: Number(id)}, {$set: ticket});
   return result;
}

export async function deleteTicket(id) {
   const result = await db.collection("tickets").deleteOne({id: Number(id)});
   return result;
}

export async function getActiveTickets() {
  const result = await db.collection("tickets").find({status: 1}).toArray();
  return result;
}

export async function getNewTickets(weekStart, weekEnd) {
  const result = await db.collection("tickets").find({createdAt: {$gte: weekStart, $lte: weekEnd}}).toArray();
  return result;
}

export async function getClosedTickets(weekStart, weekEnd) {
  const result = await db.collection("tickets").find({closedAt: {$gte: weekStart, $lte: weekEnd}}).toArray();
  return result;
}

export async function getMostTicketsClassroom(weekStart, weekEnd) {
  const result = await db.collection("tickets").find({createdAt: {$gte: weekStart, $lte: weekEnd}}).sort({classroom: 1}).limit(1);
  return result;
}

export async function getLeastTicketsClassroom(weekStart, weekEnd) {
  const result = await db.collection("tickets").find({createdAt: {$gte: weekStart, $lte: weekEnd}}).sort({classroom: -1}).limit(1);
  return result;
}
