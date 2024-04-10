import { Request, Response } from "express"
import { client } from "../database/models/connection";
import { EventType } from '../types'

interface ApiRequest {
    (req: Request, res: Response): void;
}

export const login: ApiRequest = async (req, res) => {
    const { name, email, password } = req.body;
}

export const getAllEvents: ApiRequest = async (req, res) => {

    try {
        const response: any = []
        const events = (await client.query('SELECT * FROM events')).rows;

        for (const event of events) {
            const eventId = event.pk_eventid;
            const users = (await client.query("SELECT * FROM user_events WHERE fk_eventid = $1", [eventId])).rows;
            const parameters = (await client.query("SELECT * FROM event_parameters WHERE fk_eventid = $1", [eventId])).rows;
            response.push({ event, users, parameters });
        }

        res.status(200).json({ response });
    } catch (error) {
        res.status(500).send(error);
    }
}

export const addEvent: ApiRequest = async (req, res) => {
    const { name, parameters, starting_date, ending_date } = req.body;
    try {
        const response = await client.query('INSERT INTO events (name, starting_date,ending_date) VALUES ($1, $2, $3) RETURNING *', [name, starting_date, ending_date]);
        const id = response?.rows[0]?.pk_eventid;
        parameters.forEach(async (parameter: any) => {
            await client.query('INSERT INTO event_parameters (fk_eventid, name, full_marks) VALUES ($1, $2, $3)', [id, parameter.name, parameter.marks]);
        });

        res.status(201).json(response.rows[0]);
    } catch (error) {
        console.log('error', error)
        res.status(500).send(error);
    }
}

export const addTeam: ApiRequest = async (req, res) => {
    const { email, name, event_id } = req.body;
    try {
        const response = await client.query('INSERT INTO teams (email,name) VALUES ($1, $2) RETURNING *', [email, name]);

        const teamId = response?.rows[0]?.pk_teamid;
        await client.query("INSERT INTO user_events (fk_eventid, fk_teamid) VALUES ($1, $2)", [event_id, teamId]);
        res.status(201).json(response.rows[0]);
    } catch (error) {
        res.status(500).send(error);
    }
}

export const getEventTeams: ApiRequest = async (req, res) => {
    const { id } = req.params;

    try {
        const response = (await client.query("SELECT t.name, t.pk_teamid, t.email from user_events ue INNER JOIN teams t ON ue.fk_teamid = t.pk_teamid WHERE ue.fk_teamid = $1", [id])).rows;
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }

}

export const addJudge: ApiRequest = async (req, res) => {
    const { email, name, event_id } = req.body;
    try {
        const response = await client.query('INSERT INTO judges (email,name) VALUES ($1, $2) RETURNING *', [email, name]);

        const judgeId = response?.rows[0]?.pk_judgeid;
        await client.query("INSERT INTO judge_events (fk_eventid, fk_judgeid) VALUES ($1, $2)", [event_id, judgeId]);
        res.status(201).json(response.rows[0]);
    } catch (error) {
        res.status(500).send(error);
    }
}

export const getEventJudge: ApiRequest = async (req, res) => {
    const { id } = req.params
    console.log("id", id)
    if (!id) {
        return res.status(401).json({
            message: "Please send a id"
        })
    }
    try {
        const response = (await client.query("SELECT jd.email,jd.name from judge_events je INNER JOIN judges jd ON je.fk_judgeid = jd.pk_judgeid WHERE fk_eventid = $1", [id])).rows;
        res.status(200).json(response)
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
}

export const getScoreByJudge: ApiRequest = async (req, res) => {
    const { id } = req.params;
    try {
        const response = (await client.query(`SELECT 
        e.pk_eventId AS event_id,
        e.name AS event_name,
        e.starting_date,
        e.ending_date,
        e.created_at AS event_created_at,
        t.pk_teamid AS team_id,
        t.email AS team_email,
        t.name AS team_name,
        j.pk_judgeid AS judge_id,
        j.email AS judge_email,
        j.name AS judge_name,
        json_agg(json_build_object('param_id', p.pk_paramid, 'score', js.score)) AS scores
    FROM 
        judge_scores js
    INNER JOIN 
        events e ON js.fk_eventid = e.pk_eventId
    INNER JOIN 
        teams t ON js.fk_teamid = t.pk_teamid
    INNER JOIN 
        event_parameters p ON js.fk_paramid = p.pk_paramid
    INNER JOIN 
        judges j ON js.fk_judgeid = j.pk_judgeid
    WHERE 
        js.fk_judgeid = $1
    GROUP BY 
        e.pk_eventId, t.pk_teamid, j.pk_judgeid;    
    `, [id])).rows;
        res.status(200).json(response)

    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
}

export const getWinner: ApiRequest = async (req, res) => {
    const { id } = req.params;
    try {
        const response = (await client.query(`SELECT 
        e.pk_eventId AS event_id,
        e.name AS event_name,
        e.starting_date,
        e.ending_date,
        e.created_at AS event_created_at,
        t.pk_teamid AS team_id,
        t.email AS team_email,
        t.name AS team_name,
        SUM(js.score) AS scores
    FROM 
        judge_scores js
    INNER JOIN 
        events e ON js.fk_eventid = e.pk_eventId
    INNER JOIN 
        teams t ON js.fk_teamid = t.pk_teamid
    INNER JOIN 
        event_parameters p ON js.fk_paramid = p.pk_paramid
    INNER JOIN 
        judges j ON js.fk_judgeid = j.pk_judgeid
    WHERE 
        js.fk_eventid = $1
    GROUP BY 
        e.pk_eventId, t.pk_teamid, j.pk_judgeid
    ORDER BY
        scores desc;
    `, [id])).rows;
        res.status(200).json(response)

    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
}
