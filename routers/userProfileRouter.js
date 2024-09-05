import express from 'express';
import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import bodyParser from 'body-parser';

const router = express.Router();

// Open database connection
const dbPromise = sqlite.open({
    filename: './data_plan.db',
    driver: sqlite3.Database
});

async function setupDatabase() {
    const db = await dbPromise;
    await db.migrate();
}

setupDatabase().catch(err => {
    console.error("Database migration failed:", err);
});

export default router;