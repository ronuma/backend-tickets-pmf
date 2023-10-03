import express from "express";
import "dotenv/config";
import cors from "cors";
import {PORT} from "./constants.js";
import {ticketsRouter} from "./routes/tickets.js";
import {categoriesRouter} from "./routes/categories.js";
import {reportsRouter} from "./routes/reports.js";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (_req, res) => {
   res.json({
      msg: "API de tickets PMF",
   });
});

app.use("/tickets", ticketsRouter);
app.use("/categories", categoriesRouter);
app.use("/reports", reportsRouter);

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}.`);
});
