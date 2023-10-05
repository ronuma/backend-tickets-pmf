import {Router} from "express";
import {
   getTickets,
   getTicketById,
   createTicket,
   updateTicket,
   deleteTicket,
} from "../helpers/tickets.js";
import {validatePost, validatePut} from "../middlewares/tickets.js";

const router = Router();

router.get("/", async (_req, res) => {
   try {
      const data = await getTickets();
      res.setHeader("Content-Range", `tickets 0-${data.length}/${data.length}`);
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
   // if (req.user.role !== "Aula") {
   //    return res.status(401).json({
   //       msg: "No tienes permisos para actualizar tickets",
   //    });
   // }
   try {
      const {id} = req.params;
      delete req.body._id;
      const result = await updateTicket(id, req.body);
      res.header('Access-Control-Allow-Origin', '*');
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
   if (req.user.role !== "Aula") {
      return res.status(401).json({
         msg: "No tienes permisos para actualizar tickets",
      });
   }
   try {
      const {id} = req.params;
      const result = await deleteTicket(id);
      res.json(result);
   } catch (error) {
      console.log("DELETE TICKET ERROR: ", error);
      res.status(500).json({
         msg: "Error al eliminar el ticket",
         error,
      });
   }
});

export {router as ticketsRouter};
