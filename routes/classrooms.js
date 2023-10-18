import {Router} from "express";
import {
   getClassrooms,
   getClassroomById,
   createClassroom,
   editClassroom,
   deleteClassroom,
} from "../helpers/classrooms.js";

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

router.get("/:id", async (req, res) => {
   try {
      const data = await getClassroomById(req.params.id);
      res.json(data);
   } catch (error) {
      console.log("GET CLASSROOM BY ID ERROR: ", error);
      res.status(500).json({
         msg: "Error al obtener la aula con id " + req.params.id,
         error,
      });
   }
});

router.post("/", async (req, res) => {
   if (req.user.role === "Aula") {
      return res.status(403).json({
         msg: "No tienes permisos para crear aulas",
      });
   }
   try {
      const data = await createClassroom(req.body);
      res.json(data);
   } catch (error) {
      console.log("CREATE CLASSROOM ERROR: ", error);
      res.status(500).json({
         msg: "Error al crear la aula",
         error,
      });
   }
});

router.put("/:id", async (req, res) => {
   if (req.user.role === "Aula") {
      return res.status(403).json({
         msg: "No tienes permisos para editar aulas",
      });
   }
   try {
      const data = await editClassroom(req.params.id, req.body);
      res.json(data);
   } catch (error) {
      console.log("UPDATE CLASSROOM ERROR: ", error);
      res.status(500).json({
         msg: "Error al editar la aula con id " + req.params.id,
         error,
      });
   }
});

router.delete("/:id", async (req, res) => {
   if (req.user.role === "Aula") {
      return res.status(403).json({
         msg: "No tienes permisos para eliminar aulas",
      });
   }
   try {
      const data = await deleteClassroom(req.params.id);
      res.json(data);
   } catch (error) {
      console.log("DELETE CLASSROOM ERROR: ", error);
      res.status(500).json({
         msg: "Error al eliminar la aula con id " + req.params.id,
         error,
      });
   }
});

export {router as classroomsRouter};
