const express = require('express');
const mysql2 = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config()
const app = express()
const port = process.env.PORT || 3001


app.use(cors({
    origin: [process.env.ORIGIN],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Custom-Header',
}));
// app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

const hashPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};


app.post("/register", async (req, res) => {
    const { name, email, password, role } = req.body;

    let hashedpassword = await hashPassword(password);

    try {

        pool.query(`SELECT * FROM user WHERE email = ?`, [email], (err, result, fields) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Mysql email search error" });
            }
            if (result.length > 0) {
                return res.status(409).json({ success: false, message: "User already exists" });
            } else {
                pool.query("INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?)", [name, email, hashedpassword, role], (err1, result1, fields1) => {
                    if (err1) {
                        console.log(err1);
                        console.log({name, email, hashedpassword, role});
                        return res.status(500).json({ success: false, message: "Mysql insert user error" });
                    }
                    return res.status(200).json({ success: true, message: "Registered successfully" });
                });
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        pool.query(`SELECT * FROM user WHERE email = ?`, [email], async (err, result, fields) => {
            console.log(result);
            if (err) {  
                return res.status(500).json({ success: false, message: "Mysql email search error" });
            } 
            if(result.length === 0) {
                res.status(401).json({success:false, message:"Provided email does not registered"});
            }else{
                const passwordMatch = await bcrypt.compare(password, result[0].password);
                if (passwordMatch){
                    return res.status(200).json({ success: true, message: "Logged in successfully" });
                } else {
                    return res.status(401).json({ success: false, message: "Invalid credentials" });
                } 
            } 
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
})

app.listen(port, () => console.log(`Server running on port ${port}!`))          