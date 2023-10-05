import express from "express";
import "dotenv/config";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {MongoClient} from "mongodb";
import {PORT} from "./constants.js";
import {ticketsRouter} from "./routes/tickets.js";
import {categoriesRouter} from "./routes/categories.js";
import {reportsRouter} from "./routes/reports.js";

const app = express();
const SECRET_KEY = process.env.JWT_SECRET; // env file

let db;

// Middleware
app.use(express.json());
app.use(cors());

function verifyJWT(req, res, next) {
  const authHeader = req.headers["authorization"];
   const token = authHeader && authHeader.split(" ")[1];
   jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
         return res.sendStatus(403);
      }
      req.user = user;
      next();
   });
}


// app.use("/tickets", verifyJWT, ticketsRouter);
app.use("/reportes", verifyJWT, reportsRouter);

app.post("/registrarse", async (request, response) => {
   let user = request.body.username;
   let pass = request.body.password;
   let fname = request.body.fullName;
   let role = request.body.role;

   const validRoles = ["Aula", "Nacional", "Ejecutivo"];
   if (!validRoles.includes(role)) {
      return response.status(400).send("Rol inválido");
   }

   let existingUser = await db.collection("usuarios").findOne({usuario: user});

   if (existingUser == null) {
      try {
         bcrypt.genSalt(10, (error, salt) => {
            if (error) throw error;
            bcrypt.hash(pass, salt, async (error, hash) => {
               if (error) throw error;
               let newUser = {usuario: user, password: hash, fullName: fname, role: role};
               await db.collection("usuarios").insertOne(newUser);
               response.sendStatus(201); // Created
            });
         });
      } catch (error) {
         response.sendStatus(500);
      }
   } else {
      response.sendStatus(409); // user exists
   }
});

app.post("/login", async (req, res) => {
   const {username, password} = req.body;
   const user = await db.collection("usuarios").findOne({usuario: username});
   if (!user) {
      return res.status(401).send("Usuario no encontrado");
   }
   const passwordMatches = await bcrypt.compare(password, user.password);
   if (!passwordMatches) {
      return res.status(401).send("Credenciales inválidas");
   }
   const token = jwt.sign({username: user.usuario, role: user.role}, SECRET_KEY, {
      expiresIn: "1h",
   });

   res.json({token, username: user.usuario});
});

async function connectDB() {
   const client = new MongoClient(process.env.MONGO_URL);
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
app.use("/reports", reportsRouter);

app.listen(PORT, () => {
   connectDB();
   console.log(`Server is running on port ${PORT}.`);
});

// -------------------------------------------------------------
