import {superAdminAuthorization} from "../utils/admin";
import db from "../utils/prisma.config";

export const CandidatService = {
    createCandidat : async (req : any , res : any , next : any) => {
        try {
            const user_auth = req.user.role_id;
            console.log(`l'utilisateur connecté : ${user_auth}`);
            if(!user_auth)return res.status(401).json({message : "Please log in"});
            const isSuperAdmin = await superAdminAuthorization(user_auth);
            if(!isSuperAdmin)return res.status(401).json({message : "Not authorized"});

            const { name , last_name , phone , birth_date , email , bio } = req.body;

            const election_id = req.query.id;

            const birth_day = new Date(birth_date);

            if(isNaN(birth_day.getTime()))return res.status(400).json({message : "Format time is not valid"});

            const birth_day_iso = birth_day.toISOString()

            if(!election_id)return res.status(400).json({message : " Add election id in query"});
            const isElection = await  db.election.findUnique({
                where : {
                    id : Number(election_id),
                    is_active : true
                }
            })
            if(!isElection)return res.status(404).json({message : "Election not found"});

            const newCandidat = await db.candidat.create({
                data : {
                    name,
                    last_name,
                    phone,
                    birth_date : birth_day_iso,
                    email,
                    bio,
                    election_id : isElection.id
                }
            })
            return res.status(201).json({message : "Created" , status : true})
        } catch (error : any) {
            console.log(`Error : ${error.message}`);
            return res.status(500).json({message :"Internal Server Error" , error : error.message})
        }
    },
    getAllCandidat: async (req: any, res: any, next: any) => {
        try {
            const election_id = req.query.id;
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 10;
            const skip = (page - 1) * pageSize;
    
            
            let filter = {};
            let message = "All candidates list";
    
            if (election_id) {
                const isElection = await db.election.findUnique({
                    where: { id: Number(election_id) }
                });
                if (!isElection) {
                    return res.status(404).json({ message: "Election not found" });
                }
    
            
                filter = { election_id: Number(election_id) , is_active : true };
                message = `Candidates list for election ${isElection.title}`;
            }
    
            
            const all_candidat = await db.candidat.findMany({
                where: filter,
                skip: skip,
                take: pageSize
            });
    
            
            const total_candidat = await db.candidat.count({ where: filter });
            const totalPages = Math.ceil(total_candidat / pageSize);
    
            return res.status(200).json({
                message: message,
                data: all_candidat,
                total_candidat: total_candidat,
                page: page,
                totalPages: totalPages
            });
        } catch (error: any) {
            console.log(`Error: ${error.message}`);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },
    getCandidat : async (req : any , res : any , next : any) => {
        try {
            const candidatID = Number(req.query.id);
            if(!candidatID)return res.status(400).json({message : "Add candidat id in query"});
            const isCandidat = await db.candidat.findUnique({
                where : {
                    id : candidatID,
                    is_active : true
                }
            });
            if(!isCandidat)return res.status(404).json({message : "Not found"});
            return res.status(200).json({message : "candidat found" , data : isCandidat});
        } catch (error : any) {
            console.log(`Error : ${error.message}`);
            return res.status(500).json({message : "Internal  Server Error"})
        }
    },
    editCandidat : async (req: any , res : any , next : any) => {
        try {
            const user_auth = req.user.role_id;
            console.log(`l'utilisateur connecté : ${user_auth}`);
            if(!user_auth)return res.status(401).json({message : "Please log in"});
            const isSuperAdmin = await superAdminAuthorization(user_auth);
            if(!isSuperAdmin)return res.status(401).json({message : "Not authorized"});
             
            const candidatID = Number(req.query.id);
            if(!candidatID)return res.status(400).json({message : "Add candidat id in query"});
            const isCandidat = await db.candidat.findUnique({
                where : {
                    id : candidatID,
                    is_active : true
                }
            });
            if(!isCandidat)return res.status(404).json({message : "Not found"});

            const { name , last_name , phone , birth_date , email , bio } = req.body;
            const emailExit = await db.candidat.findUnique({
                where : {email , is_active : true}
            })
            const numeroExist = await db.candidat.findFirst({
                where : {phone , is_active : true}
            })
            if(emailExit || numeroExist) return res.status(400).json({message : "Email or number phone are already used"})
            const birth_day = new Date(birth_date);
            if(isNaN(birth_day.getTime()))return res.status(400).json({message : "Format time is not valid"});
            const birth_day_iso = birth_day.toISOString()
            const updateCandidat = await db.candidat.update({
                where : { id : candidatID , is_active : true},
                data : {
                    name : name ? name : isCandidat.name,
                    last_name : last_name ? last_name : isCandidat.last_name,
                    phone : phone ? phone : isCandidat.phone,
                    birth_date : birth_day_iso ? birth_day_iso : isCandidat.birth_date,
                    email : email ? email : isCandidat.email,
                    bio : bio ? bio : isCandidat.bio
                }
            })
            return res.status(200).json({message : "candidat updated"})
        } catch (error : any) {
            console.log(`Error : ${error.message}`);
            return res.status(500).json({message : "Internal Server Error"})
        }
    },
    deleteCandidat : async (req : any , res : any , next : any) => {
        try {
            const user_auth = req.user.role_id;
            console.log(`l'utilisateur connecté : ${user_auth}`);
            if(!user_auth)return res.status(401).json({message : "Please log in"});
            const isSuperAdmin = await superAdminAuthorization(user_auth);
            if(!isSuperAdmin)return res.status(401).json({message : "Not authorized"});
             
            const candidatID = Number(req.query.id);
            if(!candidatID)return res.status(400).json({message : "Add candidat id in query"});
            const isCandidat = await db.candidat.findUnique({
                where : {
                    id : candidatID,
                    is_active : true
                }
            });
            if(!isCandidat)return res.status(404).json({message : "Not found"});

            const deleteCandidat = await db.candidat.update({
                where :{id : candidatID , is_active : true},
                data : {
                    is_active : false
                }
            })
            return res.status(200).json({message : "Candidat deleted success"})
        } catch (error : any) {
            console.log(`Error : ${error.message}`);
            return res.status(500).json({message : "Internal Server Error"})
        }
    }
    
}