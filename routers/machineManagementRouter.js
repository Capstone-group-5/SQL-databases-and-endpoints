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

//GET ALL MACHINES
router.get('/retrieve_all_machines/:org', async (req, res) => {
    const { org } = req.params;

    try {
        const db = await dbPromise;
        const machines = await db.all('SELECT * FROM machinery_inventory WHERE Organisation = ?', [org])
        res.status(200).json(machines);

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

//GET ONE MACHINE
router.get('/retrieve_one_machine/:org/:regNumber', async (req, res) => {
    const { org, regNumber } = req.params;

    try {
        const db = await dbPromise;
        const machines = await db.get('SELECT * FROM machinery_inventory WHERE Organisation = ? AND reg_number = ? ', [org, regNumber])

        if (machines) {
            res.json(machines);
        } else {
            res.status(404).json({ error: "Could'nt find machine" })
        }

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

//ADD A NEW MACHINE
router.post('/Add_machine/:org/:regNumber', async (req, res) => {
    const { org, regNumber } = req.params;
    const { Organisation, Machinery, reg_number, Condition, Issue } = req.body;

    try {
        const db = await dbPromise;
        const existingMachine = await db.get('SELECT * FROM machinery_inventory WHERE Organisation = ? AND reg_number = ?', [org, regNumber]);

        if (existingMachine){
            res.status(404).json({ error: 'Machine registration already exists!' })
        } else{
            db.run(
                'INSERT INTO machinery_inventory (Organisation, Machinery, reg_number, Condition, Issue) VALUES (?, ?, ?, ?, ?)', 
                [ Organisation, Machinery, reg_number, Condition, Issue]
            );
            res.status(200).json({ message: 'Machine successfully added' })
        }
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

//EDIT A MACHINE
router.put('/Update_machine/:org/:regNumber', async (req, res) => {
    const {org, regNumber} = req.params;
    const { Machinery, reg_number, Condition, Issue } = req.body;

    try{
        const db = await dbPromise;
        const result = await db.run(
            'UPDATE machinery_inventory SET  Machinery = ?, reg_number = ?, Condition = ?, Issue = ? WHERE Organisation = ? AND reg_number = ?', 
            [Machinery, reg_number, Condition, Issue, org, regNumber]
        );
        
        if (result.changes > 0) {
            res.json({ message: 'Machine successfully updated' });
        } else {
            res.status(404).json({ error: 'Unable to update machine' });
        }
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

//DELETE A MACHINE
router.delete('/Delete_machine/:org/:regNumber', async (req, res) => {
    const { org, regNumber } = req.params;

    try{
        const db = await dbPromise;
        const result = await db.run(
            'DELETE FROM machinery_inventory WHERE Organisation = ? AND reg_number = ?', [ org, regNumber] 
        );

        if (result.changes > 0){
            res.json({message: 'Machine deleted'})
        } else {
            res.status(404).json({error: 'Failed to delete machine'})
        }
    } catch (err){
        res.status(500).json({error: err.message})
    }
})


export default router;