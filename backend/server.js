import mysql from "mysql2";
import express from 'express';
import cors from 'cors';



//const express = require("express");
//const cors = require("cors")
const app = express();


app.use(express.json())

app.use (cors()); 

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"crud",
    authPlugins: {
        mysql_clear_password: () => () => Buffer.from("")
    }
});


// Attempt to connect to MySql databse
db.connect((err) => {
    if (err) {
        console.error(" MySQL Connection Failed:", err.message);
        return;
    }
    console.log("Connected to MySQL Database!");
});


app.get("/", (req, res) => {
    const sql = "SELECT * FROM student";
    db.query(sql, (err,data) =>{
        if (err) return res.json("Error in server");
        return res.json(data);
    })
})

app.get('/student/:id', (req, res) => {
    const sql = "SELECT * FROM student WHERE ID = ?";
    const id = req.params.id;

    db.query(sql, [id], (err, data) => {
        if (err) return res.json('Error');
        return res.json(data[0]);  // Send only one student record
    });
});


app.post('/create', (req, res) => {
    const sql = "INSERT INTO student (ID, Name, Email, Registration_Number, Course, Phone_Number) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
        req.body.ID,
        req.body.Name,
        req.body.Email,
        req.body.Registration_Number,
        req.body.Course,
        req.body.Phone_Number
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error creating student:', err);
            return res.status(500).json({ error: 'Failed to create student' });
        }
        return res.status(200).json({ message: 'Student created successfully', id: result.insertId });
    });
});

app.put('/update/:id', (req,res) => {
    const sql = "UPDATE student SET Name = ?, Email = ?, Registration_Number = ?, Course = ?, Phone_Number = ? WHERE ID = ?";
    const values = [
        req.body.Name,
        req.body.Email,
        req.body.Registration_Number,
        req.body.Course,
        req.body.Phone_Number
    ]
    const id = req.params.id;

    db.query(sql, [...values, id], (err, data) => {
        if(err) {
            console.error(err);
            return res.json({ error: 'Error updating student' });
        }
        return res.json(data);
    })
})

app.delete('/student/:id',(req,res) =>{
    const sql = "DELETE FROM student WHERE ID= ? ";
    
    const ID = req.params.id;

    db.query(sql,[ID],(err,data)=>{
        if(err) return res.json('Error');
        return res.json(data);
    })
})


app.listen (8081, () => {
    console.log("Listening");
})