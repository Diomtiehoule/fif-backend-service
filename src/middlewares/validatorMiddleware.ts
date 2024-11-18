import { Request , Response , NextFunction } from "express";
import { ZodSchema } from "zod";

function validateSchema(schema : ZodSchema){
    return (req : Request , res : Response , next : NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error : any) {
            res.status(400).json({errors : error.errors})
        }
    }
}

export default validateSchema;