"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addScore = exports.getEvents = exports.login = void 0;
const connection_1 = require("../database/models/connection");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.login = login;
const getEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const response = (yield connection_1.client.query("SELECT * FROM judge_events je INNER JOIN events e ON je.fk_eventid = e.pk_eventid WHERE je.fk_judgeid = $1", [id])).rows;
        res.status(200).json(response);
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});
exports.getEvents = getEvents;
const addScore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { judge_id, event_id, team_id, scores } = req.body;
    try {
        for (const score of scores) {
            const param_id = score.param_id;
            const marks = score.marks;
            const response = yield connection_1.client.query("INSERT INTO judge_scores(fk_eventid,fk_teamid, fk_judgeid, fk_paramid, score) VALUES($1, $2, $3, $4, $5)", [event_id, team_id, judge_id, param_id, marks]);
        }
        res.status(201).json({
            message: "Marks Entered Succesfully"
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});
exports.addScore = addScore;
//# sourceMappingURL=judge.controller.js.map