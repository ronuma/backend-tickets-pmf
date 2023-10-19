import {Router} from "express";
import {getCategories} from "../helpers/categories.js";
import {log} from "../index.js";

const router = Router();

router.get("/", async (req, res) => {
   try {
      const data = await getCategories();
      res.setHeader("Content-Range", `categories 0-${data.length}/${data.length}`);
      res.json(data);
   } catch (error) {
      console.log("GET CATEGORIES ERROR: ", error);
      res.status(500).json({
         msg: "Error al obtener las categorias",
         error,
      });
   }
});

export {router as categoriesRouter};
