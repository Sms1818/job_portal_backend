import bodyParser from "body-parser";
import dotenv from 'dotenv';
import express from "express";
import connectDatabase from "./config/database.js";

const PORT=8000;

dotenv.config();

const app=express();

connectDatabase();

app.use(bodyParser.json());

app.get('/',(req,res)=>res.send('API is running'));

app.listen(PORT,()=>console.log(`Server started on port ${PORT}`));

