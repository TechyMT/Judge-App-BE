import { Request, Response } from "express"
import { client } from "../database/models/connection";
import { EventType } from '../types'

interface ApiRequest {
    (req: Request, res: Response): void;
}

export const login: ApiRequest = async (req, res) => {

}

export const getEvents: ApiRequest = async (req, res) => {
    const { id } = req.params;
    try {
        const response = (await client.query("SELECT * FROM judge_events je INNER JOIN events e ON je.fk_eventid = e.pk_eventid WHERE je.fk_judgeid = $1", [id])).rows;
        res.status(200).json(response);

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

export const addScore: ApiRequest = async (req, res) => {
    const { judge_id, event_id, team_id, scores } = req.body;
    try {
        for (const score of scores) {
            const param_id = score.param_id;
            const marks = score.marks;
            const response = await client.query("INSERT INTO judge_scores(fk_eventid,fk_teamid, fk_judgeid, fk_paramid, score) VALUES($1, $2, $3, $4, $5)", [event_id, team_id, judge_id, param_id, marks])
        }
        res.status(201).json({
            message: "Marks Entered Succesfully"
        })

    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
}
