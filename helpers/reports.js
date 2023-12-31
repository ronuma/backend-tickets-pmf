import {
   getMostTicketsClassroom,
   getLeastTicketsClassroom,
   getActiveTickets,
   getNewTickets,
   getClosedTickets,
  getAverageClosureTime,
} from "./tickets.js";
import {db} from "../db.js";

export const getReports = async () => {
   const reports = await db.collection("reports").find({}).toArray();
   reports.forEach(report => {
      delete report._id;
   });
   return reports;
};

export const getReportById = async id => {
  const report = await db.collection("reports").findOne({id});
  console.log("report: ", report);
  delete report._id;
  return report;
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
      avgClosureTime: await getAverageClosureTime(weekStart, weekEnd),
      // avgClosureTime: await computeAvgClosureTime(weekStart, weekEnd),
      activeTickets: await getActiveTickets(),
      newTickets: await getNewTickets(weekStart, weekEnd),
      closedTickets: await getClosedTickets(weekStart, weekEnd),
      updated: new Date(),
   };

   // check if there is a report for this week
   const lastReport = await db.collection("reports").findOne({name: report.name});
   // if there is a report for this week, update it only
   if (lastReport !== null) {
      await db.collection("reports").updateOne({id: lastReport.id}, {$set: report});
      return;
      // if there is no report for this week, create a new one
   } else {
      // get the last report's id and add 1 to it
      const lastReportForId = await db.collection("reports").findOne({}, {sort: {id: -1}});
      report.id = lastReportForId ? lastReportForId.id + 1 : 1;
      db.collection("reports").insertOne(report);
   }
};

export const computeAvgClosureTime = async (weekStart, weekEnd) => {
   const tickets = await getClosedTickets(weekStart, weekEnd);
   const avg =
      tickets.reduce((acc, ticket) => {
         return acc + (ticket.closedAt - ticket.createdAt);
      }, 0) / tickets.length;
   return avg;
};
