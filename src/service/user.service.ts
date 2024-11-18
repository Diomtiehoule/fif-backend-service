import db from "../utils/prisma.config";
import { ROLE , ROLE_NAME} from "../types/enum";
import { generatoken } from "../utils/token";
import bcrypt from "bcrypt";


const UserService = {

    loginUser : async (req : any , res : any , next : any)  => {
        try {
            const { email , password } = req.body;
            const userExist = await db.user.findUnique({
                where : {email}
            })
            if(!userExist) return res.status(400).json({message : "email or password incorrect"})
            const isPasswordValid = await bcrypt.compare(password , userExist.password!)
            if(!isPasswordValid) return res.status(400).json({message : "email or password incorrect"})
            const token = generatoken(userExist.id)
            res.status(200).json({message : "login success" ,data : userExist , token})
        } catch (error : any) {
            console.log(`Error : ${error.message}`);
            return res.status(500).json({message : "Internal Server Error" , error : error.message});
        }
    },
    createUser : async (req: any, res: any, next: any) => {
        try {
            const { name , email, password } = req.body;
    
            
            const userExist = await db.user.findUnique({ where: { email } });
            if (userExist) {
                return res.status(400).json({ message: "user is already exist" });
            }
    
            
            const passwordHash = await bcrypt.hash(password, 10);
    
            
            const newUser = await db.user.create({
                data: {
                    name,
                    email,
                    role_id : ROLE.USER,
                    role_name : ROLE_NAME.USER,
                    password: passwordHash
                }
            });
    
            if (!newUser) {
                return res.status(400).json({ message: "echec register" });
            }
    
            return res.status(201).json({ message: "created", status: true });
        } catch (error: any) {
            console.log(`Erreur : ${error.message}`);
            return res.status(500).json({ message: "internal server error", err: error.message });
        }
    },
    getAllUser : async (req : any , res : any , next : any) => {
        try {
            const all_user = await db.user.findMany({
                where : {status : true , role_id : 1}
            });
            if(!all_user.length)return res.status(200).json({message : "Empty list" , data : []});
            return res.status(200).json({message : "users list" , data : all_user});
        } catch (error : any) {
            console.log(`Error : ${error.message }`);
            return res.status(200).json({message : "Internal Server Error"});
        }
    }
    
    
}

export default UserService;