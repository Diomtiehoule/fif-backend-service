import express , { response , request , application , NextFunction, Application} from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import {db} from './utils/db';
import { globalError } from "./middlewares/errorMiddleware";
import { ApiError } from "./utils/apiError";
import {createDefaultRole , createDefaultType} from "./utils/role";
import {createDefaultAdmin} from "./utils/admin";
import {userRouter} from "./controllers/user.controller"
import {electionRouter} from "./controllers/election.controller";
import {candidatRouter} from "./controllers/candidat.controller";


dotenv.config({
    path: '.env'
})

const PORT = process.env.PORT || 9000

const app: Application = express();

// cors settings. Allow GET, POST, DELETE and POST method
app.use(cors({
    origin: '*',
    methods: ["GET" , "POST" , "PUT" , "DELETE"]
}))

// default middleware 

app.use(express.json())
app.use(express.urlencoded({extended: true}))
if(process.env.NODE_ENV === 'developpement') app.use(morgan("dev"));

// router
app.use('/user' , userRouter);
app.use('/election' , electionRouter);
app.use('/candidat' , candidatRouter);
app.all('*' , (req , _res , next) => {
    next(new ApiError(`can't find this route : ${req.originalUrl}`, 404))
})

// global error handing middleware 
app.use(globalError);



//start server
const server = app.listen(PORT , async() =>{
    try{
        console.log(`🚀 server  running on port ${PORT}`)
        db.$connect().then(async () => {
            console.log('Database connection etablished');
            await Promise.all([createDefaultRole(), createDefaultAdmin() , createDefaultType()]);
          });
        
    }catch(err){
        console.error(err)
        db.$disconnect();
        process.exit(1)
    }
    
})

// handle rejection outside express 
process.on('unhandledRejection' , (err) =>{
    console.log(`unhandledRejection Error ${err}`)
    server.close(()=>{
        console.log(`server down...`)
        process.exit(1)
    })
});
