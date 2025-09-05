// app.js
import express from'express';
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import logbookRoutes from './routes/logbookRoutes.js';
import userRoutes from './routes/userRoutes.js';


const app = express();
const port = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
dotenv.config();


app.use('/api', logbookRoutes);
app.use('/users', userRoutes);

// Define a route for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
    
});

// Start the server
app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});

// postgresql://postgres:[YOUR-PASSWORD]@db.czpzckjomvadpnczhirx.supabase.co:5432/postgres