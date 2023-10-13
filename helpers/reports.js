import {
   getMostTicketsClassroom,
   getLeastTicketsClassroom,
   getActiveTickets,
   getNewTickets,
   getClosedTickets,
} from "./tickets.js";
import {db} from "../db.js";

export const getReports = async () => {
   const reports = await db.collection("reports").find({}).toArray();
   return reports;
};

export const createReport = async () => {
   const dt = new Date();
   const weekStart = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() - dt.getDay());
   const weekEnd = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + (6 - dt.getDay()));
   const weekStartStr = weekStart.toISOString().split("T")[0];
   const weekEndStr = weekEnd.toISOString().split("T")[0];

   const report = {
      name: `Reporte de la semana ${weekStartStr} al ${weekEndStr}`,
      mostTicketsClassroom: await getMostTicketsClassroom(weekStart, weekEnd),
      leastTicketsClassroom: await getLeastTicketsClassroom(weekStart, weekEnd),
      avgClosureTime: await computeAvgClosureTime(weekStart, weekEnd),
      activeTickets: await getActiveTickets(),
      newTickets: await getNewTickets(weekStart, weekEnd),
      closedTickets: await getClosedTickets(weekStart, weekEnd),
   };

   db.collection("reports").insertOne(report);
};

export const computeAvgClosureTime = async (weekStart, weekEnd) => {
   const tickets = await getClosedTickets(weekStart, weekEnd);
   const avg =
      tickets.reduce((acc, ticket) => {
         return acc + (ticket.closedAt - ticket.createdAt);
      }, 0) / tickets.length;
   return avg;
};
