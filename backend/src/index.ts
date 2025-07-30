import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
import complaintRoutes from "./routes/complaintRoutes.js"
import cors from 'cors';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:8080' , 'https://resolveit-coral.vercel.app/'],
  credentials: true,
}));

app.use('/user', userRoutes);
app.use('/complaint', complaintRoutes);

const PORT = process.env.PORT || 5000;

console.log(process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
