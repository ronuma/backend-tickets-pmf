import {
  getMostTicketsClassroom,
  getLeastTicketsClassroom,
  getActiveTickets,
  getNewTickets,
  getClosedTickets,
} from "./tickets.js";
import {db} from "../db.js";


export const createReport = async () => {
  const dt = new Date();
  const weekStart = dt.getDay();
  const weekEnd = dt.getDay() - 7;

  const report = {
    name: `Reporte de la semana ${weekStart} al ${weekEnd}`,
    mostTicketsClassroom: await getMostTicketsClassroom(weekStart, weekEnd),
    leastTicketsClassroom: await getLeastTicketsClassroom(weekStart, weekEnd),
    avgClosureTime: await computeAvgClosureTime(weekStart, weekEnd),
    activeTickets: await getActiveTickets(),
    newTickets: await getNewTickets(weekStart, weekEnd),
    closedTickets: await getClosedTickets(weekStart, weekEnd),
  }

  db.collection("reports").insertOne(report);
}

export const computeAvgClosureTime = async (weekStart, weekEnd) => {
  const tickets = await getClosedTickets(weekStart, weekEnd);
  const avg = tickets.reduce((acc, ticket) => {
    return acc + (ticket.closedAt - ticket.createdAt);
  }, 0) / tickets.length;
  return avg;
}
