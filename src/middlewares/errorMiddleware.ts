import { ApiError } from "../utils/apiError"


const sendErrorForDev = (err : any , _req : any , res : any) =>{
    return res.status(err.statusCode).json({
        status : err.satus,
        error : err,
        message : err.message,
        stack : err.stack
    })
}

const sendErrorForProd = (err : any , _req : any , res : any ) =>{
    return res.status(err.statusCode).json({
        status : err.status,
        message : err.message,
    })
}

const handleJwtInvalidSignature = () =>{
    new ApiError("Invalid token , please login again..", 401)
}

const handleJwtExpired = () =>{
    new ApiError('Expired token , please login again..', 401)
}

export const globalError = (err: any , req: any , res : any, next : any) =>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if(process.env.NODE_ENV === 'developpement'){
        sendErrorForDev(err, req, next);
    }else{
        if(err.name  === 'Jsonwebtoken') err = handleJwtInvalidSignature();
        if(err.name === 'TokenExpiredError') err = handleJwtExpired();
        sendErrorForProd(err ,req , res);
    }
}