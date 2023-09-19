import express from "express";
import cors from "cors";
// import {connectToDB} from "./db.js";
import {PORT} from "./constants.js";
import {sampleRouter} from "./routes/sample.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/sample", sampleRouter);

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}.`);
});

// CODIGO QUE NOS HABIA DADO JORGE
//
// const db = await connectToDB();
//
// app.get("/test", async (req, res) => {
//    const data = await db.collection("test").find({}).project({_id: 0}).toArray();
//    res.header("Access-Control-Expose-Headers", "X-Total-Count");
//    res.header("X-Total-Count", data.length);
//    res.json(data);
// });

// app.post("/test", async (req, res) => {
//    const result = await db.collection("test").insertOne(req.body);
//    res.json(result);
// });

// app.delete("/test/:id", async (req, res) => {
//    const {id} = req.params;
//    const result = await db.collection("test").deleteOne(id);
//    res.json(result);
// });
