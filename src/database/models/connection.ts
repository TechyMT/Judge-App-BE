import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();


export const client = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to the database');

        // Perform database operations here

    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

connectToDatabase();


