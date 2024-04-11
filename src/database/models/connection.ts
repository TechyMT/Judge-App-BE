import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

export const client = new Pool({
    connectionString: process.env.POSTGRES_URL
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


