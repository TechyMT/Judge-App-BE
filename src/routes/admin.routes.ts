import express from "express";
import {
    login,
    getAllEvents,
    addEvent,
    addJudge,
    addTeam,
    getEventJudge,
    getEventTeams,
    getScoreByJudge,
    getWinner,

} from "../controllers/admin.controller"
export const adminRoutes = express.Router()

adminRoutes.post('/login', login);
adminRoutes.get('/events', getAllEvents);
adminRoutes.post('/events', addEvent);
adminRoutes.post('/team', addTeam);
adminRoutes.get('/team/:id', getEventTeams)
adminRoutes.post('/judge', addJudge);
adminRoutes.get("/judge/:id", getEventJudge);
adminRoutes.get("/score/:id", getScoreByJudge);
adminRoutes.get('/winner/:id', getWinner)



