import {Router} from "express";
import {sampleTickets} from "../constants.js";

const router = Router();

router.get("/", async (_req, res) => {
   try {
      res.setHeader("Content-Range", `tickets 0-${sampleTickets.length}/${sampleTickets.length}`);
      res.json({
         msg: "Tickets obtenidos correctamente",
         data: sampleTickets,
      });
   } catch (error) {
      console.log("GET ERROR: ", error);
      res.status(500).json({
         msg: "Error al obtener los datos",
         error,
      });
   }
});

router.get("/:id", async (req, res) => {
   try {
      const {id} = req.params;
      const ticket = sampleTickets.find(ticket => ticket.id === Number(id));
      if (!ticket) {
         res.status(404).json({
            msg: "Ticket no encontrado",
         });
      }
      res.json({
         msg: "Ticket obtenido correctamente",
         data: ticket,
      });
   } catch (error) {
      console.log("GET BY ID ERROR: ", error);
      res.status(500).json({
         msg: "Error al obtener el ticket",
         error,
      });
   }
});

export {router as ticketsRouter};
