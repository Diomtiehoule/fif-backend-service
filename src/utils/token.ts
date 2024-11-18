
import  jwt  from "jsonwebtoken";

export const generatoken = (payload : number) =>{
    const tokenSecret = process.env.TOKEN_AKWABA_V2;
    if(!tokenSecret) throw new Error('token introuvable !!!')
    return jwt.sign({ userId : payload} , tokenSecret , {expiresIn : 24*3600})
}

export const verifyToken = (token : any) => {
const tokenSecret = process.env.TOKEN_AKWABA_V2;
if(!tokenSecret) throw new Error('token introuvable')
return jwt.verify(token , tokenSecret)
}