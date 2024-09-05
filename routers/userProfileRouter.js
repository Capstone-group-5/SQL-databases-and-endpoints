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

// GET ALL USER PROFILES
router.get('/get_all_profiles/:org', async (req, res) => {
    const {org} = req.params;
    try {
        const db = await dbPromise;
        const profiles = await db.all('SELECT * FROM user_profile WHERE Organisation = ?', [org])
        res.status(200).json(profiles);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// GET ONE USER PROFILES
router.get('/get_one_profile/:eMail', async (req, res) => {
    const { eMail } = req.params
    try {
        const db = await dbPromise;
        const profile = await db.get('SELECT * FROM user_profile WHERE E_mail = ?', [eMail])
      
      if (profile){
        res.json(profile);
      } else {
        res.status(404),json({error:"Profile does'nt exist"})
      }
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})




//NEW USER PROFILE
router.post('/add_new_user', async (req, res) => {
    const { Organisation, UserName, Surname, E_mail, User_Password, User_Role } = req.body;

    try {
        const db = await dbPromise;
        const existingUser = await db.get('SELECT * FROM user_profile WHERE E_mail = ?', [E_mail])

        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' })
        } else {
            const result = await db.run(
                'INSERT INTO user_profile (Organisation, UserName, Surname, E_mail, User_Password, User_Role) VALUES (?, ?, ?, ?, ?, ?)',
                [Organisation, UserName, Surname, E_mail, User_Password, User_Role]
            );
            res.status(201).json({ id: result.lastID });
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

//EDIT USER PROFILE
router.put('/Update/user_profile/:eMail', async (req, res) => {
    const { eMail } = req.params;
    const { Organisation, UserName, Surname, E_mail, User_Password, User_Role } = req.body;

    try {
        const db = await dbPromise;
        const result = await db.run(
            'UPDATE user_profile SET Organisation = ?, UserName = ?, Surname = ?, E_mail = ?, User_Password = ?, User_Role = ? WHERE E_MAIL = ?',
            [Organisation, UserName, Surname, E_mail, User_Password, User_Role, eMail]
        );

        if (result.changes > 0) {
            res.json({ message: 'Profile updated successfully' });
        } else {
            res.status(404).json({ error: 'Profile not updated' })
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})


//DELETE A PROFILE
router.delete('/Delete/user_profile/:id', async (req, res) => {
    const { id } = req.params;
    
    try{
        const db = await dbPromise;
        const result = await db.run(
            'DELETE FROM user_profile WHERE id = ? && Organisation = ?', [id] 
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