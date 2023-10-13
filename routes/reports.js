import {Router} from "express";
import {createReport, getReports} from "../helpers/reports.js";

const router = Router();

router.get("/", async (req, res) => {
   if (req.user.role === "Aula") {
      return res.status(401).json({
         msg: "No tienes permisos para ver reportes",
      });
   }
   try {
      const reports = await getReports();
      res.status(200).json(reports);
   } catch (error) {
      console.log("GET REPORTS ERROR: ", error);
      res.status(500).json({
         msg: "Error al obtener los reportes",
         error,
      });
   }
});

router.post("/", async (req, res) => {
   if (req.user.role === "Aula") {
      return res.status(401).json({
         msg: "No tienes permisos para crear reportes",
      });
   }
   try {
      // Get token
      const token = req.headers.authorization.split(" ")[1];

      const report = await createReport();
      res.status(201).json({
         msg: "Reporte creado",
         report,
      });
   } catch (error) {
      console.log("POST REPORT ERROR: ", error);
      res.status(500).json({
         msg: "Error al crear el reporte",
         error,
      });
   }
});

export const reportsRouter = router;
