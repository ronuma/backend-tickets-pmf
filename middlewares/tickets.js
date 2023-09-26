export function validatePost(req, res, next) {
   const {id, title} = req.body;
   if (id === "" || title === "") {
      return res.status(400).json({
         msg: "Faltan campos obligatorios",
      });
   }
   next();
}

export function validatePut(req, res, next) {
   const {id, title} = req.body;
   if (id === "" || title === "") {
      return res.status(400).json({
         msg: "Faltan campos obligatorios",
      });
   }
   next();
}
