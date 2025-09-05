import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
configDotenv();

export const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); //invalid token
    req.user = decoded.email;
    next();
  });
};
