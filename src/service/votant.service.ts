import { superAdminAuthorization } from "../utils/admin";
import db from "../utils/prisma.config";

export const VotantService = {
    createVotant : async (req : any , res : any , next : any) => {
        try {
            const user_auth = req.user.role_id;
            console.log(`l'utilisateur connecté : ${user_auth}`);
            if(!user_auth)return res.status(401).json({message : "Please log in"});
            const isSuperAdmin = await superAdminAuthorization(user_auth);
            if(!isSuperAdmin)return res.status(401).json({message : "Not authorized"});

            const { name , last_name , phone , email , categorie } = req.body

            const emailExist = await db.votant.findUnique({
                where : {email}
            })
            const phoneExist = await db.votant.findFirst({
                where : {phone}
            })
            if(emailExist || phoneExist)return res.status(400).json({message : "Email or number phone already used"});
            const categorieExist = await db.categorie.findFirst({
                where : {title : categorie}
            })
            if(!categorieExist)return res.status(404).json({message : "Category not found"});
            const newVotant = await db.votant.create({
                data : {
                    name,
                    last_name,
                    phone,
                    email,
                    categorie_id : categorieExist.id
                }
            })
            return res.status(201).json({message : "Created" , status : true})
        } catch (error : any) {
            console.log(`Error : ${error.message}`);
            return res.status(500).json({message : "Internal Server Error" , error : error.message})
        }
    },
    getAllVotant: async (req: any, res: any, next: any) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 10;
            const skip = (page - 1) * pageSize;
    
            
            let filter = {};
            let message = "All votants list";
    
            filter = {is_active : true };
            const all_votant = await db.votant.findMany({
                where: filter,
                skip: skip,
                take: pageSize
            });
    
            
            const total_votant = await db.votant.count({ where: filter });
            const totalPages = Math.ceil(total_votant / pageSize);
    
            return res.status(200).json({
                message: message,
                data: all_votant,
                total_votant: total_votant,
                page: page,
                totalPages: totalPages
            });
        } catch (error: any) {
            console.log(`Error: ${error.message}`);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },
    getVotant : async (req : any , res : any , next : any) => {
        try {
            const votantID = Number(req.query.id);
            if(!votantID)return res.status(400).json({message : "Add votant id in query"});
            const isVotant = await db.votant.findUnique({
                where : {
                    id : votantID,
                    is_active : true
                }
            });
            if(!isVotant)return res.status(404).json({message : "Not found"});
            return res.status(200).json({message : "votant found" , data : isVotant});
        } catch (error : any) {
            console.log(`Error : ${error.message}`);
            return res.status(500).json({message : "Internal  Server Error"})
        }
    },
    editVotant : async (req: any , res : any , next : any) => {
        try {
            const user_auth = req.user.role_id;
            console.log(`l'utilisateur connecté : ${user_auth}`);
            if(!user_auth)return res.status(401).json({message : "Please log in"});
            const isSuperAdmin = await superAdminAuthorization(user_auth);
            if(!isSuperAdmin)return res.status(401).json({message : "Not authorized"});
             
            const votantID = Number(req.query.id);
            if(!votantID)return res.status(400).json({message : "Add votant id in query"});
            const isVotant = await db.votant.findUnique({
                where : {
                    id : votantID,
                    is_active : true
                }
            });
            if(!isVotant)return res.status(404).json({message : "Not found"});

            const { name , last_name , phone , email , categorie } = req.body;
            const emailExit = await db.votant.findUnique({
                where : {email , is_active : true}
            })
            const numeroExist = await db.votant.findFirst({
                where : {phone , is_active : true}
            })
            if(emailExit || numeroExist) return res.status(400).json({message : "Email or number phone are already used"});

            const isCategorie = await db.categorie.findFirst({
                where : {title : categorie}
            })
            if(!isCategorie)return res.status(404).json({message : "Category not found"})
            const updateCandidat = await db.votant.update({
                where : { id : votantID , is_active : true},
                data : {
                    name : name ? name : isVotant.name,
                    last_name : last_name ? last_name : isVotant.last_name,
                    phone : phone ? phone : isVotant.phone,
                    email : email ? email : isVotant.email,
                    categorie_id : categorie ? isCategorie.id : isVotant.categorie_id
                }
            })
            return res.status(200).json({message : "candidat updated"})
        } catch (error : any) {
            console.log(`Error : ${error.message}`);
            return res.status(500).json({message : "Internal Server Error"})
        }
    },
    deleteVotant : async (req : any , res : any , next : any) => {
        try {
            const user_auth = req.user.role_id;
            console.log(`l'utilisateur connecté : ${user_auth}`);
            if(!user_auth)return res.status(401).json({message : "Please log in"});
            const isSuperAdmin = await superAdminAuthorization(user_auth);
            if(!isSuperAdmin)return res.status(401).json({message : "Not authorized"});
             
            const votantId = Number(req.query.id);
            if(!votantId)return res.status(400).json({message : "Add votant id in query"});
            const isvotant = await db.votant.findUnique({
                where : {
                    id : votantId,
                    is_active : true
                }
            });
            if(!isvotant)return res.status(404).json({message : "Not found"});

            const deleteVotant = await db.votant.update({
                where :{id : votantId , is_active : true},
                data : {
                    is_active : false
                }
            })
            return res.status(200).json({message : "Votant deleted success"})
        } catch (error : any) {
            console.log(`Error : ${error.message}`);
            return res.status(500).json({message : "Internal Server Error"})
        }
    }
}