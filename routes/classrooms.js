import {Router} from "express";
import {
   getClassrooms,
   getClassroomById,
   createClassroom,
   editClassroom,
   deleteClassroom,
   deleteClassrooms,
} from "../helpers/classrooms.js";
import {log} from "../index.js";

const router = Router();

router.get("/", async (req, res) => {
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
      log(req.user.username, "CREATE CLASSROOM", data.id);
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
      log(req.user.username, "UPDATE CLASSROOM", req.params.id);
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
      log(req.user.username, "DELETE CLASSROOM", req.params.id);
      res.json(data);
   } catch (error) {
      console.log("DELETE CLASSROOM ERROR: ", error);
      res.status(500).json({
         msg: "Error al eliminar la aula con id " + req.params.id,
         error,
      });
   }
});

router.delete("/", async (req, res) => {
   if (req.user.role === "Aula") {
      return res.status(403).json({
         msg: "No tienes permisos para eliminar aulas",
      });
   }
   try {
      const ids = JSON.parse(req.query.id || "[]");
      const results = await deleteClassrooms(ids);
      log(req.user.username, "DELETE MANY CLASSROOMS", ids);
      res.json({data: results});
   } catch (error) {
      console.log("DELETE MANY CLASSROOMS ERROR: ", error);
      res.status(500).json({
         msg: "Error al eliminar las aulas",
         error,
      });
   }
});

export {router as classroomsRouter};
