import { Router } from "express";
import {CandidatService} from "../service/candidat.service";
import auth from "../middlewares/authMiddleware";

export const candidatRouter = Router();

candidatRouter.post('/create-candidat' , auth , CandidatService.createCandidat);
candidatRouter.get('/get-all-candidat' , CandidatService.getAllCandidat);