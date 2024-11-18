import {superAdminAuthorization} from "../utils/admin";
import db from "../utils/prisma.config";

export const ElectionService = {
    createElection : async (req : any , res : any , next : any) => {
        try {
            const user_auth = req.user.role_id;
            console.log(`l'utilisateur connecté : ${user_auth}`);
            if(!user_auth)return res.status(401).json({message : "Please log in"});
            const isSuperAdmin = await superAdminAuthorization(user_auth);
            if(!isSuperAdmin)return res.status(401).json({message : "Not authorized"});
             
            const {title , content , dateTimeStart , dateTimeEnd } = req.body;
            const type_id = req.query.id;
            if(!type_id)return res.status(400).json({message :  "add type id in query"})
            const isType = await db.type.findUnique({
            where : {id : Number(type_id)}
            })
            if(!isType)return res.status(404).json({message : "Type not found"});
            
            
            const dateDebutParsed = new Date(Date.parse(`${dateTimeStart.replace(" ", "T")}:00`));
            const dateFinParsed = new Date(Date.parse(`${dateTimeEnd.replace(" ", "T")}:00`));
    
            const dateDebutISO = dateDebutParsed.toISOString();
            const dateFinISO = dateFinParsed.toISOString();

            const newElection = await db.election.create({
                data : {
                    title,
                    content,
                    type_id : Number(type_id),
                    type : isType.name,
                    date_time_start : dateDebutISO,
                    date_time_end : dateFinISO
                }
            })
            return res.status(201).json({message :  "Created" , status : true})

        } catch (error : any) {
            console.log(`Error ${error.message}`);
            return res.status(500).json({message : "Interal Server Error"});
        }
    },
    getAllElection: async (req: any, res: any, next: any) => {
        try {
            const type = req.query.type as string;
            const page = parseInt(req.query.page as string) || 1;       
            const pageSize = parseInt(req.query.pageSize as string) || 10; 
            const skip = (page - 1) * pageSize;
    
            
            const totalElections = type 
                ? await db.election.count({ where: { type: type } })
                : await db.election.count();
    
          
            const totalPages = Math.ceil(totalElections / pageSize);
    
            
            const all_election = await db.election.findMany({
                where: type ? { type: type } : undefined,
                skip: skip,
                take: pageSize
            });
    
            if (!all_election.length) {
                return res.status(200).json({
                    message: "Empty list",
                    data: []
                });
            }
    
            return res.status(200).json({
                message: "Election list",
                data: all_election,
                totalElections: totalElections,
                page: page,
                totalPages: totalPages
            });
        } catch (error: any) {
            console.log(`Error: ${error.message}`);
            return res.status(500).json({ message: "Internal Server Error", error : error.message });
        }
    }
    
}