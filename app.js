import bodyParser from "body-parser";
import dotenv from 'dotenv';
import express from "express";
import connectDatabase from "./config/database.js";
import applicationRoute from "./routes/applicationRoute.js";
import authRoute from './routes/authRoute.js';
import jobRoute from "./routes/jobRoute.js";

const PORT=8000;

dotenv.config();

const app=express();

connectDatabase();

app.use(bodyParser.json());

app.use('/jobPortal/auth',authRoute);
app.use('/jobPortal/job',jobRoute);
app.use('/jobPortal/application',applicationRoute);

app.get('/',(req,res)=>res.send('API is running'));

app.listen(PORT,()=>console.log(`Server started on port ${PORT}`));

