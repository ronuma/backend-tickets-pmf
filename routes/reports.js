import {Router} from 'express';
import {createReport} from '../helpers/reports.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
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

router.get("/", (req, res) => {
  res.send("Reports");
})

export const reportsRouter = router;
