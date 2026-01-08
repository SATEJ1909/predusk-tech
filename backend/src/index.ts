import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose';
import router from './routes/routes.js';

const app = express();
app.use(express.json());
app.use(cors())


app.use("/api" , router)

const PORT = process.env.PORT || 3000 ;

async function main(){
    await mongoose.connect(process.env.DATABASE_URL as string);
    app.listen(PORT , ()=>{
        console.log("Server Running on Port : " ,PORT)
    })
}

main();