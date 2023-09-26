import express from "express";
import "dotenv/config";
import cors from "cors";
import {PORT} from "./constants.js";
import {ticketsRouter} from "./routes/tickets.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/tickets", ticketsRouter);

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}.`);
});
