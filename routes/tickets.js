import {Router} from "express";
import {
   getTickets,
   getTicketById,
   createTicket,
   updateTicket,
   deleteTicket,
   deleteTickets,
} from "../helpers/tickets.js";
import {log} from "../index.js";

const router = Router();

router.get("/", async (req, res) => {
   try {
      const allData = await getTickets();
      const q = req.query.q;
      let data = allData;
      if (q) {
         data = data.filter(
            ticket => ticket.title.includes(q) // Replace with the actual fields and conditions // you want to search on.
         );
      }
      res.setHeader("Content-Range", `tickets 0-${data.length}/${data.length}`);
      log(req.user.username, "GET TICKETS", "OK");
      res.json(data);
   } catch (error) {
      console.log("GET TICKETS ERROR: ", error);
      res.status(500).json({
         msg: "Error al obtener los tickets",
         error,
      });
   }
});

router.get("/:id", async (req, res) => {
   try {
      const {id} = req.params;
      const ticket = await getTicketById(id);
      if (!ticket) {
         return res.status(404).json({
            msg: "Ticket no encontrado",
         });
      }
      log(req.user.username, "GET TICKET BY ID", id);
      res.json(ticket);
   } catch (error) {
      console.log("GET TICKET BY ID ERROR: ", error);
      res.status(500).json({
         msg: "Error al obtener el ticket",
         error,
      });
   }
});

router.post("/", async (req, res) => {
   try {
      const result = await createTicket(req.body);
      log(req.user.username, "CREATE TICKET", result.id);
      res.json(result);
   } catch (error) {
      console.log("POST TICKET ERROR: ", error);
      res.status(500).json({
         msg: "Error al crear el ticket",
         error,
      });
   }
});

router.put("/:id", async (req, res) => {
   if (req.user.role == "Aula") {
      return res.status(401).json({
         msg: "No tienes permisos para actualizar tickets",
      });
   }
   try {
      const {id} = req.params;
      delete req.body._id;
      const result = await updateTicket(id, req.body);
      log(req.user.username, "UPDATE TICKET", id);
      res.header("Access-Control-Allow-Origin", "*");
      res.json({
         msg: "Ticket actualizado correctamente",
         data: result,
      });
   } catch (error) {
      console.log("PUT TICKET ERROR: ", error);
      res.status(500).json({
         msg: "Error al actualizar el ticket",
         error,
      });
   }
});

router.delete("/:id", async (req, res) => {
   if (req.user.role == "Aula") {
      return res.status(401).json({
         msg: "No tienes permisos para actualizar tickets",
      });
   }
   try {
      const {id} = req.params;
      const result = await deleteTicket(id);
      log(req.user.username, "DELETE TICKET", id);
      res.json(result);
   } catch (error) {
      console.log("DELETE TICKET ERROR: ", error);
      res.status(500).json({
         msg: "Error al eliminar el ticket",
         error,
      });
   }
});

router.delete("/", async (req, res) => {
   if (req.user.role == "Aula") {
      return res.status(401).json({
         msg: "No tienes permisos para eliminar tickets",
      });
   }
   try {
      const ids = JSON.parse(req.query.id || "[]");
      const results = await deleteTickets(ids);
      log(req.user.username, "DELETE MANY TICKETS", ids);
      res.json({data: results});
   } catch (error) {
      console.log("DELETE MANY TICKETS ERROR: ", error);
      res.status(500).json({
         msg: "Error al eliminar los tickets",
         error,
      });
   }
});

export {router as ticketsRouter};
