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



//GET ALL CROPS IN INVENTORY
router.get('/Get_crops/:org', async (req, res) => {
    const {org} = req.params;
    try{
        const db = await dbPromise;
        const crops = await db.all('SELECT * FROM crop_inventory WHERE Organisation = ?', [org]);
        res.status(200).json(crops)
    } catch (err){
        res.status(500).json({error: err.message})
    }
})

//GET A SINGLE TYPE OF CROP
router.get('/Get_one_type/:org/:type', async (req, res) => {
    const {org, type} = req.params;

    try{
        const db = await dbPromise;
        const cropType = await db.get('SELECT * FROM crop_inventory WHERE Organisation = ? AND CROP = ?', [org, type]);

        if (cropType){
            res.json(cropType)
        } else{
            res.status(404).json({error: 'Crops not found'})
        }

    } catch (err){
        res.status(500).json({error: err.messasge})
    }
})

// ADD A NEW CROP RECORD
router.post('/Add_a_crop', async (req, res) =>{
    const {Organisation, Crop, Yield} = req.body;

    try{
        const db = await dbPromise
        const result = await db.run(
            'INSERT INTO crop_inventory (Organisation, Crop, Yield) VALUES (?, ?, ?)', 
            [Organisation, Crop, Yield]);
            res.status(200).json({message: 'Crops successfully added'})
    } catch (err) {
        res.status(500).json({error: err.messasge})
    }
})

//EDIT A CROP RECORD
router.put('/Update_crop/:id', async (req, res) => {
    const {id} = req.params;
    const {Crop, Yield} = req.body;

    try{
        const db = await dbPromise;
        const result = await db.run(
            'UPDATE crop_inventory SET Crop = ?, Yield = ? WHERE cropRecord_Id	= ?',
        [Crop, Yield, id]);
        
        if (result.changes > 0){
            res.status(200).json({message: 'Crop successfully updated'})
        } else {
            res.status(404).json({error: 'Crop not updated'})
        }

    } catch (err){
        res.status(500).json({error: err.messasge})
    }
})

//DELETE A CROP
router.delete('/Delete_crop/:id', async (req, res) => {
    const {id} = req.params;

    try{
        const db = await dbPromise;
        const result  = await db.run(
            'DELETE FROM crop_inventory WHERE cropRecord_Id = ?',
            [id]);
            
        if (result.changes > 0) {
            res.status(200).json({message: 'Successfully deleted'})
        } else {
            res.status(404).json({Error: 'Unable to delete'})
        }
    } catch (err) { 
        res.status(500).json({error: err.messasge})
    }
})

export default router;