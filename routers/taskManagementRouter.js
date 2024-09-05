import express from 'express';
import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import bodyParser from 'body-parser';
import { readFile } from 'fs/promises';

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


// ONLY REMOVE COMMENTS TO EDIT DATABASE STRUCTURE CONSULT BEFORE ATTEMPTING
/* async function runSQLFile(filePath) {
    const db = await dbPromise;
    const sql = await readFile(filePath, 'utf8');
    await db.exec(sql);
}



async function initializeDatabase() {
    try {
        console.log('Running schema update...');
        await runSQLFile('./migrations/003-create-task_sheduler.sql'); // Path to your schema update file
        console.log('Schema updated.');

        console.log('Inserting data...');
        await runSQLFile('./migrations/004-create-task_sheduler-data.sql'); // Path to your insert data file
        console.log('Data inserted.');
    } catch (err) {
        console.error('Error during database initialization:', err);
    }
}

// Call the initialization function when starting the application
initializeDatabase().catch(err => {
    console.error('Failed to initialize database:', err);
});
 */


//RETRIEVE ALL TASKS 
router.get('/retrieve_tasks/:org', async (req, res) => {
    const {org} = req.params;
    try {
        const db = await dbPromise;
        const tasks = await db.all('SELECT * FROM task_sheduler WHERE Organisation = ?', [org])
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})


//RETRIEVE ONE TASK
router.get('/Retrieve_one_task/:org/:taskName', async (req, res) => {
    const { org } = req.params;
    const { taskName } = req.params;

    try {
        const db = await dbPromise;
        const task = await db.get('SELECT * FROM task_sheduler WHERE Organisation = ? AND Task = ?',
            [org, taskName]);

        if (task) {
            res.json(task)
        } else {
            res.status(404).json({ error: 'Could not find task' })
        }
    } catch (err) {
        res.status(500).json({ error: err.message })
    }

});


//ADD A TASK
router.post('/add_new_task/:org', async (req, res) => {
    const { Organisation, Task, Assigner, Assignee, Status, Description, Dead_line } = req.body;
    const { org } = req.params;

    try {
        const db = await dbPromise;
        const existingTask = await db.get('SELECT * FROM task_sheduler WHERE Organisation = ? AND Task = ?', [org, Task])

        if (existingTask) {
            res.status(404).json({ error: 'Task name already exists!' })
        } else {
            const result = db.run(
                'INSERT INTO task_sheduler (Organisation, Task, Assigner, Assignee, Status, Description, Dead_line) VALUES (?, ?, ?, ?, ?, ?,?)',
                [Organisation, Task, Assigner, Assignee, Status, Description, Dead_line]);
            res.status(200).json({ message: 'Task successfully added' })
        }
    } catch (err) {
        res.status(500).json({ error: err.message })
    }

})

// EDIT A TASK
router.put('/Update_task/:org/:selectedTask', async (req, res) => {
    const { org, selectedTask } = req.params;
    const { Task, Assigner, Assignee, Status, Description, Dead_line } = req.body;

    try {
        const db = await dbPromise;

        // Check if the new task name already exists for the organization
        const existingTask = await db.get(
            'SELECT * FROM task_sheduler WHERE Organisation = ? AND Task = ?',
            [org, Task]
        );

        if (existingTask && existingTask.Task !== selectedTask) {
            return res.status(400).json({ error: 'Task name already exists' });
        }

        const result = await db.run(
            'UPDATE task_sheduler SET Task = ?, Assigner = ?, Assignee = ?, Status = ?, Description = ?, Dead_line = ? WHERE Organisation = ? AND Task = ?',
            [Task, Assigner, Assignee, Status, Description, Dead_line, org, selectedTask]
        );

        if (result.changes > 0) {
            res.json({ message: 'Task successfully updated' });
        } else {
            res.status(404).json({ error: 'Unable to update task' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.delete('/Delete_task/:org/:selectedTask', async (req, res) => {
    const { org, selectedTask } = req.params;

    try{
        const db = await dbPromise;
        const result = await db.run(
            'DELETE FROM task_sheduler WHERE Organisation = ? AND Task = ?', [ org, selectedTask] 
        );

        if (result.changes > 0){
            res.json({message: 'Account deleted'})
        } else {
            res.status(404).json({error: 'Failed to delete account'})
        }
    } catch (err){
        res.status(500).json({error: err.message})
    }
})




export default router;