import {db} from "../db.js";

export async function getTickets() {
   const data = await db.collection("tickets").find().toArray();
   data.forEach(ticket => {
      ticket.id = ticket._id;
      delete ticket._id;
   });
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

export async function getActiveTickets() {
  const result = await db.collection("tickets").find({status: 1}).toArray();
  return result;
}

export async function getNewTickets(weekStart, weekEnd) {
  const result = await db.collection("tickets").aggregate([
    {$match: {createdAt: {$gte: weekStart, $lte: weekEnd}}},
    {$group: {_id: "$status", count: {$sum: 1}}}
  ]).toArray();
  return result;
}

export async function getClosedTickets(weekStart, weekEnd) {
  const result = await db.collection("tickets").aggregate([
    {$match: {closedAt: {$gte: weekStart, $lte: weekEnd}}},
    {$group: {_id: "$status", count: {$sum: 1}}}
  ]).toArray();
  return result;
}

export async function getMostTicketsClassroom(weekStart, weekEnd) {
  const result = await db.collection("tickets").aggregate([
    {$match: {createdAt: {$gte: weekStart, $lte: weekEnd}}},
    {$group: {_id: "$classroom", count: {$sum: 1}}},
    {$sort: {count: -1}},
    {$limit: 1}
  ]);
  return result;
}

export async function getLeastTicketsClassroom(weekStart, weekEnd) {
  const result = await db.collection("tickets").aggregate([
    {$match: {createdAt: {$gte: weekStart, $lte: weekEnd}}},
    {$group: {_id: "$classroom", count: {$sum: 1}}},
    {$sort: {count: 1}},
    {$limit: 1}
  ]);
  return result;
}
