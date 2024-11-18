import { Router } from "express";
import {ElectionService} from "../service/election.service";
import auth from "../middlewares/authMiddleware";

export const electionRouter = Router();

electionRouter.post('/create-election' , auth , ElectionService.createElection);
electionRouter.get('/get-all-election' , ElectionService.getAllElection);