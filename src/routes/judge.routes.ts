import express from "express"
import { getEvents, addScore } from "../controllers/judge.controller";
export const JudgeRouter = express.Router();

JudgeRouter.post("/score", addScore);
JudgeRouter.get('/events/:id', getEvents);

