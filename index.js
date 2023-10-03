import express from "express";
import "dotenv/config";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {MongoClient} from "mongodb";
import {PORT} from "./constants.js";
import {ticketsRouter} from "./routes/tickets.js";
import {categoriesRouter} from "./routes/categories.js";

const app = express();
const SECRET_KEY = process.env.JWT_SECRET; // env file

let db;

// Middleware
app.use(express.json());
app.use(cors());

function verifyJWT(req, res, next) {
   const token = req.get("Authorization");
   jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
         return res.sendStatus(403);
      }
      req.user = user;
      next();
   });
}

app.use("/tickets", verifyJWT, ticketsRouter);

app.post("/registrarse", async (req, res) => {
   //... Registration logic (keep as in your original snippet or refactor as needed)
});

app.post("/login", async (req, res) => {
   //... Login logic (keep as in your original snippet or refactor as needed)
   const {username, password} = req.body;
   const user = await db.collection("usuarios").findOne({usuario: username});
   if (!user) {
      return res.status(401).send("Usuario no encontrado");
   }
   const passwordMatches = await bcrypt.compare(password, user.password);
   if (!passwordMatches) {
      return res.status(401).send("Credenciales inválidas");
   }
   const token = jwt.sign({username: user.username}, SECRET_KEY, {expiresIn: "1h"});
   res.json({token, username: user.username});
});

async function connectDB() {
   const client = new MongoClient(process.env.LOCAL_MONGO_URL);
   await client.connect();
   db = client.db();
   console.log("Connected to the database:", db.databaseName);
}

async function log(sujeto, accion, objeto) {
   const toLog = {
      timestamp: new Date(),
      sujeto,
      accion,
      objeto,
   };
   await db.collection("log").insertOne(toLog);
}

const authenticateToken = (req, res, next) => {
   const authHeader = req.headers["authorization"];
   const token = authHeader && authHeader.split(" ")[1];

   if (!token) return res.sendStatus(401);

   jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
   });
};

app.get("/protected", authenticateToken, (req, res) => {
   res.json({message: "This is protected frfr", user: req.user});
});

app.get("/", (_req, res) => {
   res.json({
      msg: "API de tickets PMF",
   });
});

app.use("/tickets", ticketsRouter);
app.use("/categories", categoriesRouter);

app.listen(PORT, () => {
   connectDB();
   console.log(`Server is running on port ${PORT}.`);
});

// -------------------------------------------------------------
