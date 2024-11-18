import { Router } from "express";
import { VotantService } from "../service/votant.service";
import auth from "../middlewares/authMiddleware";

export const votantRouter = Router();

votantRouter.post('/create-votant' , auth , VotantService.createVotant);
votantRouter.get('/get-all-votant' , VotantService.getAllVotant);
votantRouter.get('/get-votant' , VotantService.getVotant);
votantRouter.put('/edit-votant' , auth , VotantService.editVotant);
votantRouter.delete('/delete-votant' , auth , VotantService.deleteVotant);