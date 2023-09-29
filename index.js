import express from "express";
import "dotenv/config";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {MongoClient} from "mongodb";
import {PORT} from "./constants.js";
import {ticketsRouter} from "./routes/tickets.js";

const app = express();
const SECRET_KEY = process.env.JWT_SECRET; // env file

let db;

// Connect to MongoDB
async function connectDB() {
   const client = new MongoClient(process.env.MONGO_URL); // env file
   await client.connect();
   db = client.db();
   console.log("Conectado a la base de datos");
}

// Middleware
app.use(express.json());
app.use(cors());

app.use("/tickets", ticketsRouter);

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

// Endpoint de inicio de sesión
app.post("/login", async (request, response) => {
   const {username, password} = request.body;

   let user;
   try {
      user = await db.collection("usuarios").findOne({username}); // Usando "usuarios" por consistencia
   } catch (error) {
      return response.status(500).send("Error interno del servidor"); // Manejar errores de base de datos
   }

   if (!user) {
      return response.status(401).send("Usuario no encontrado");
   }

   const passwordMatches = await bcrypt.compare(password, user.password);

   if (!passwordMatches) {
      return response.status(401).send("Credenciales inválidas");
   }

   const token = jwt.sign({username: user.username}, SECRET_KEY, {expiresIn: "1h"});

   response.json({
      token,
      username: user.username,
   });
});

app.listen(PORT, () => {
   connectDB();
   console.log(`El servidor está corriendo en el puerto ${PORT}.`);
});
