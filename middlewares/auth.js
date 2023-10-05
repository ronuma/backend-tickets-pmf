import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export const isAula = (req, res) => {
   const token = req.get("Authorization");
   jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
         return res.sendStatus(403);
      }
      req.user = user;
     if (user.role != 'Aula') {
        return res.sendStatus(403);
     }
      next();
    });
}
export const isNacional = () => {
   const token = req.get("Authorization");
   jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
         return res.sendStatus(403);
      }
      req.user = user;
     if (user.role != 'Nacional') {
        return res.sendStatus(403);
     }
      next();
    });
}
export const isEjecutivo = () => {
   const token = req.get("Authorization");
   jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
         return res.sendStatus(403);
      }
      req.user = user;
     if (user.role != 'Ejecutivo') {
        return res.sendStatus(403);
     }
      next();
    });

}
