/**
 * @author Yashika Tanwar
 */

 import  express, { Request, Response, urlencoded } from 'express';
 import  path  from 'path';
 
 import { SERVER_PORT } from './config';
 import apiRoutes from './routes/api';

 const app=express();
 app.use(express.json());
 app.use(express.urlencoded({extended:true}));

 app.use('/',apiRoutes);

 app.use((req:Request,res:Response)=>{
     res.status(404).send('Not Found');
 });

 app.listen(SERVER_PORT,()=>{
     console.log("Server is running at http://localhost:8000");
     
 });