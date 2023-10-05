// validacion de lo que debe contener la peticion al crear un ticket
// se deja creado pero no están en uso porque no son requerimientos todavia
export function validatePost(req, res, next) {
   const {
      title,
      categoryId,
      subcategoryIndex,
      priority,
      intermediaries,
      description,
      classroomId,
      status,
   } = req.body;
   const titleIsWrong = !title || title.length === 0 || title.length > 50;
   const descIsWrong = description && description.length > 250;
   const categoryIsWrong = !categoryId || categoryId.length > 50;
   const subcategoryIsMissing = !subcategoryIndex;
   const classroomIsWrong = classroomId && classroomId.length > 50;
   const priorityOutOfRange =
      typeof priority !== "number" || !priority || priority < 0 || priority > 2;
   const intermediariesIsWrong = intermediaries && intermediaries.length > 100;
   const statusOutOfRange = typeof priority !== "number" || !status || status < 0 || status > 2;
   if (titleIsWrong) {
      return res.status(400).json({
         msg: "El titulo es obligatorio y debe tener menos de 50 caracteres",
      });
   }
   if (descIsWrong) {
      return res.status(400).json({
         msg: "La descripcion debe tener menos de 250 caracteres",
      });
   }
   if (classroomIsWrong) {
      return res.status(400).json({
         msg: "El id de aula debe tener menos de 50 caracteres",
      });
   }
   if (categoryIsWrong) {
      return res.status(400).json({
         msg: "El id de categoria es obligatorio y debe tener menos de 50 caracteres",
      });
   }
   if (subcategoryIsMissing) {
      return res.status(400).json({
         msg: "El indice de subcategoria es obligatorio",
      });
   }
   if (priorityOutOfRange) {
      return res.status(400).json({
         msg: "La prioridad es obligatoria y debe ser un numero entre 0 y 2",
      });
   }
   if (intermediariesIsWrong) {
      return res.status(400).json({
         msg: "El campo intermediarios debe tener menos de 100 caracteres",
      });
   }
   if (statusOutOfRange) {
      return res.status(400).json({
         msg: "El estado es obligatorio y debe ser un numero entre 0 y 2",
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
