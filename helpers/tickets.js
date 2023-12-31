import {db} from "../db.js";

// gets all tickets and returns them as an array
export async function getTickets() {
   const data = await db.collection("tickets").find().toArray();
   data.forEach(ticket => {
      delete ticket._id;
   });
   return data;
}

// gets an individual ticket by its id and returns it
export async function getTicketById(id) {
   const ticket = await db.collection("tickets").findOne({id: Number(id)});
   delete ticket?._id;
   return ticket;
}

// creates a ticket, and addas aditional info and returns the result
export async function createTicket(info) {
   const ticket = {...info};
   // insert created date and id
   ticket.createdAt = new Date();
   // get the last id and add 1
   const lastTicket = await db.collection("tickets").findOne({}, {sort: {id: -1}});
   ticket.id = lastTicket ? lastTicket.id + 1 : 1;
   const result = await db.collection("tickets").insertOne(ticket);
   if (result.acknowledged) {
      const newTicket = await getTicketById(ticket.id);
      return newTicket;
   }
   return undefined;
}

export async function updateTicket(id, ticket) {
   const prevTicket = await getTicketById(id);
   // insert closed date comparing with previous status
   if (prevTicket.status !== 2 && ticket.status === 2) {
      ticket.closedAt = new Date();
   }
   const result = await db.collection("tickets").updateOne({id: Number(id)}, {$set: ticket});
   if (result.acknowledged) {
      const ticket = await getTicketById(id);
      return ticket;
   }
   return undefined;
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
   const result = await db
      .collection("tickets")
      .aggregate([
         {
            $group: {
               _id: null,
               newTickets: {
                  $sum: {
                     $cond: {
                        if: {$gte: ["$createdAt", weekStart]},
                        then: 1,
                        else: 0,
                     },
                  },
               },
            },
         },
      ])
      .toArray();
   return result;
}

export async function getClosedTickets(weekStart, weekEnd) {
   const result = await db
      .collection("tickets")
      .aggregate([
         {
            $group: {
               _id: null,
               closedTickets: {
                  $sum: {
                     $cond: {
                        if: {$gte: ["$closedAt", weekStart]},
                        then: 1,
                        else: 0,
                     },
                  },
               },
            },
         },
      ])
      .toArray();
   return result;
}

export async function getMostTicketsClassroom(weekStart, weekEnd) {
   const result = await db
      .collection("tickets")
      .aggregate([
         {$match: {createdAt: {$gte: weekStart, $lte: weekEnd}}},
         {$group: {_id: "$classroomId", count: {$sum: 1}}},
         {$lookup: {from: "classrooms", localField: "_id", foreignField: "id", as: "classroom"}},
         {$group: {_id: {id: "$classroom.id", name: "$classroom.name"}, count: {$sum: 1}}},
         {$sort: {count: 1}},
         {$limit: 1},
      ])
      .toArray();
   return result;
}

export async function getLeastTicketsClassroom(weekStart, weekEnd) {
   const result = await db
      .collection("tickets")
      .aggregate([
         {$match: {createdAt: {$gte: weekStart, $lte: weekEnd}}},
         {$group: {_id: "$classroomId", count: {$sum: 1}}},
         {$lookup: {from: "classrooms", localField: "_id", foreignField: "id", as: "classroom"}},
         {$group: {_id: {id: "$classroom.id", name: "$classroom.name"}, count: {$sum: 1}}},
         {$sort: {count: -1}},
         {$limit: 1},
      ])
      .toArray();
   return result;
}

export async function getAverageClosureTime(weekStart, weekEnd) {
   const result = await db
      .collection("tickets")
      .aggregate([
         {$match: {createdAt: {$gte: weekStart, $lte: weekEnd}, closedAt: {$exists: true}}},
         {$addFields: {closureTime: {$subtract: ["$closedAt", "$createdAt"]}}},
         {$group: {_id: null, averageClosureTime: {$avg: "$closureTime"}}},
         {$addFields: {averageClosureTimeInMinutes: {$divide: ["$averageClosureTime", 1000 * 60]}}},
      ])
      .toArray();
   return result;
}

export async function deleteTickets(ids) {
   const deletedIds = [];
   for (let id of ids) {
      await deleteTicket(id);
      deletedIds.push(id);
   }
   return deletedIds;
}
