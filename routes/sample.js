// ejemplo de estructura de un archivo de rutas
import {Router} from "express";
import {sampleHelper} from "../helpers/sample.js";

const router = Router();

router.get("/", async (_req, res) => {
   try {
      sampleHelper();
      res.json({
         msg: "GET",
      });
   } catch (error) {
      console.log("GET ERROR: ", error);
      res.status(500).json({
         msg: "Error al obtener los datos",
         error,
      });
   }
});

export {router as sampleRouter};
