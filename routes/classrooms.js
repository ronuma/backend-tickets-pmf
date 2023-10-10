import {Router} from "express";
import {getClassrooms} from "../helpers/classrooms.js";

const router = Router();

router.get("/", async (_req, res) => {
   try {
      const data = await getClassrooms();
      res.setHeader("Content-Range", `classrooms 0-${data.length}/${data.length}`);
      res.json(data);
   } catch (error) {
      console.log("GET CLASSROOMS ERROR: ", error);
      res.status(500).json({
         msg: "Error al obtener las aulas",
         error,
      });
   }
});

export {router as classroomsRouter};
