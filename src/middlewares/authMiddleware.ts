import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// bout de code qui me permet de changer type string en number du userId 
interface TokenPayload extends JwtPayload {
    userId: number;
    email : string,
    role : number
}

const auth = async (req: any, res: any, next: NextFunction) => {
    try {
        const token = req.headers.authorization;
        if (!token || !token.startsWith('Bearer ')) return res.status(401).json({ message: ' Headers Authorization introuvable ou invalide' });
        const tokenValue = token.split(' ')[1];
        const decodedToken = jwt.verify(tokenValue, process.env.TOKEN_AKWABA_V2!) as TokenPayload;
        const user = await prisma.user.findUnique({
            where : { id : decodedToken.userId , role_id : decodedToken.role_id }
        })
        if(!user) return res.status(401).json({message : "Accès non-autorisé"});
        req.user = user;
        console.log(user);
        console.log("role user : ", req.user.role_id)
        next();
    } catch (error : any) {
        return res.status(401).json({ message: 'Une erreur est survenue au niveau du token', error: error.message });
    }
}

export default auth;


