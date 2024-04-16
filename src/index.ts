
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import http from "http";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { adminRoutes } from "./routes/admin.routes";
import { JudgeRouter } from "./routes/judge.routes";
import cron from 'node-cron'
import request from "request"
dotenv.config();

const app: Express = express();
const server = http.createServer(app);

// Express Configuration
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('PORT', process.env.PORT || 3000);
app.set("BASE_URL", process.env.BASE_URL || "localhost");

if (process.env.NODE_ENV === 'dev') {
    app.use("/dev/api/admin", adminRoutes);
    app.use("/dev/api/judge", JudgeRouter)
}
else {
    app.get('/api/admin', adminRoutes);
    app.use("/dev/api/judge", JudgeRouter)

}

app.get('/ping', (req: Request, res: Response) => {
    res.send('pong');
});


const startServer = async () => {
    try {

        // console.log("Db connected");

        const port: Number = app.get('PORT');
        const baseURL: String = app.get("BASE_URL");
        server.listen(port, (): void => {
            console.log("Server is listening", port);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

startServer();



export default server;
