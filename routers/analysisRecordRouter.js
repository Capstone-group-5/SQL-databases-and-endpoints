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


//GET ALL ANALYSIS RECORDS
router.get('/Get_all_analysis/:org', async (req, res) => {
    const {org} = req.params;
    try{
        const db = await dbPromise;
        const analysis = await db.all(
            'SELECT * FROM analysis_record WHERE Organisation = ?',
            [org]);
            res.json(analysis)
    } catch (err){
        res.status(500).json({error: err.message})
    }
})

//ADD A ANALYSIS RECORD
router.post('/Add_record', async (req, res) =>{
    const {Organisation, CropType, Temperature, Humidity, Rainfall, Nitrogen, Potassium,  Phosphorus, pH_Level} = req.body;

    try{
        const db = await dbPromise;
        const result = await db.run(
            'INSERT INTO analysis_record (Organisation, CropType, Temperature, Humidity, Rainfall, Nitrogen, Potassium,  Phosphorus, pH_Level) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [Organisation, CropType, Temperature, Humidity, Rainfall, Nitrogen, Potassium,  Phosphorus, pH_Level]);
        
        if (result.changes > 0){
            res.status(200).json({message: 'Successfully added'})
        } else {
            res.status(404).json({error: 'Not added'})
        }
        
    } catch (err){
        res.status(500).json({error: err.message})
    }
})

//DELETE A RECORD
router.delete('/Delete_record/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const db = await dbPromise;
        const result = await db.run(
            'DELETE FROM analysis_record WHERE analysis_Id = ?',
        [id]);

        if (result.changes > 0){
            res.status(200).json({message: 'Successfully deleted'})
        } else {
            res.status(404).json({error: 'Not deleted'})
        }
    } catch (err) {
        
    }
})

export default router;