export class ApiError extends Error {
    statusCode;
    status;
    isOperational;

    constructor(message : any , statusCode : any){
        super(message)
        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith("4") ? 'fail' : 'error';
        this.isOperational = true;
    }
}