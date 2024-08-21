const express = require('express');
const mysql2 = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer  = require('multer');
const axios = require('axios');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const CryptoJS = require('crypto-js');

require('dotenv').config();
const app = express();
const port = process.env.PORT || 3001;

//multer config
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

//cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

app.use(cors({
    origin: [process.env.ORIGIN],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Custom-Header',
}));
// app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

let G_EMAIL = "a@b.com"

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

const verifyToken = (req, res, next) => {
    const token = req.cookies.token||"abcd";
    
    try{
        if (token==="abcd") {
            return res.status(401).json({ success: false, message: 'Unauthorized: Access token missing' });
        }

        const decrypted_token = CryptoJS.AES.decrypt(token, process.env.CRYPTO_SECRET).toString(CryptoJS.enc.Utf8);
        const email_temp = decrypted_token.match(new RegExp(`email=([^;]+)`));
        const token_temp = decrypted_token.match(new RegExp(`token=([^;]+)`));

        const email = email_temp[1];
        G_EMAIL = email;
        const token1 = token_temp[1];

        pool.query(`SELECT * FROM user WHERE email = ?`, [email],async  (err, result, fields) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Mysql email search error" });
            }
            if (result.length == 0) {
                res.clearCookie("token");
                res.status(401).json({ success: false, message: 'Already logged in into other device' });
                res.end();
            } else {
                if(result[0].token === token){
                    await jwt.verify(token1, process.env.JWT_SECRET, (err, decode) => {
                        if (err) {
                            return res.status(401).json({ success: false, message: 'Unauthorized: Invalid access token' });
                        }else{
                            if(Date.now()>=(decode.exp*1000)){
                                res.clearCookie("token");
                                res.status(401).json({ success: false, message: 'Unauthorized: Token expired' });
                                res.end();

                                pool.query(`UPDATE user SET token=null WHERE email = ?`, [email], (err1, result1, fields1) => {
                                    if(err1){
                                        console.log("Error fetching the data from database");
                                    }
                                    if(result1.length==0){
                                        console.log("No data found");
                                    }
                                    else{
                                        console.log("Token removed");
                                    }
                                });
                            }
                            next();
                        }
                        
                    });
                    
                }else{
                    console.log("cookie dont matched2");
                    res.clearCookie("token");
                    res.status(401).json({ success: false, message: 'Already logged in into other device' });
                    res.end();
                }
            }
        });
    }catch(error){
        console.error('Decryption error:', error);
        return res.status(401).json({ error: 'Unauthorized: Invalid access token' });
    }
}


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
                pool.query("INSERT INTO user (name, email, password, admin) VALUES (?, ?, ?, ?)", [name, email, hashedpassword, role], (err1, result1, fields1) => {
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

    let role;

    try {
        pool.query(`SELECT * FROM user WHERE email = ?`, [email], async (err, result, fields) => {
            // console.log(result);
            if (err) {  
                return res.status(500).json({ success: false, message: "Mysql email search error" });
            } 
            if(result.length === 0) {
                res.status(401).json({success:false, message:"Provided email does not registered"});
            }else{
                const passwordMatch = await bcrypt.compare(password, result[0].password);
                if (passwordMatch){

                    if(result[0].admin === 1){
                        role = "admin";
                    }else{
                        role = "user";
                    }

                    const name = result[0].name.split(' ')[0];

                    const token = jwt.sign({ email: email, role: role }, process.env.JWT_SECRET, { expiresIn: '1h' });

                    const temp_token = `token=${token};email=${email};role=${role};name=${name}`;

                    const encrypted_token = CryptoJS.AES.encrypt(temp_token, process.env.CRYPTO_SECRET).toString();

                    res.cookie("token", encrypted_token, { 
                        // httpOnly: true, 
                        // sameSite: 'none', 
                        // secure: true, 
                        maxAge: 3600000 
                    });


                    pool.query(`UPDATE user SET token = ? WHERE email = ?`, [encrypted_token, email], (err1, result1, fields1) => {
                        if (err1) {
                            return res.status(500).json({ success: false, message: "Mysql token update error" });
                        }
                        if(result1.length === 0) {
                            return res.status(500).json({ success: false, message: "No data found" });
                        }else{
                            //token added to database
                        }
                    });


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

app.post("/listup", verifyToken, upload.any("images") , (req, res) => {
    const images = req.files;
    const { headline,description,property_type,price,bathroom,bedroom,reception,postcode,town,address_line1,address_line2,address_line3,location} = req.body;
    

    try{
        if(G_EMAIL == "a@b.com")
            throw Error("Not authorized");
        pool.query("INSERT INTO properties (email,headline,description,property_type,price,bathroom,bedroom,reception,postcode,town,address_line1,address_line2,address_line3,location) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [G_EMAIL,headline,description,property_type,price,bathroom,bedroom,reception,postcode,town,address_line1,address_line2,address_line3,location], (err1, result1, fields1) => {
            if(err1){
                console.log(err1);
                return res.status(500).json({ success: false, message: "Mysql insert property error" });
            }
            console.log(result1.insertId);

            const insert_id = result1.insertId;
            
            //inserting time slots into time_slots table
            let time_slots1=[];
            if(req.body.time_slots.length>0){
                const time_slots = JSON.parse(req.body.time_slots);
                time_slots1 = time_slots.map(obj=>[insert_id,new Date(obj.start),new Date(obj.end),0]);
            }else{
                time_slots1 =[[insert_id,null,null,1]];
            }

            pool.query("INSERT INTO time_slots (property_id,start_time,end_time,anytime) VALUES ?", [time_slots1], (err2, result2, fields2) => {
                if(err2){   
                    console.log(err2);
                    return res.status(500).json({ success: false, message: "Error inserting time slots" });
                }
            })

            //uploading images to cloudinary
            images.map(async (file) => {
                let cld_upload_stream = await cloudinary.uploader.upload_stream(
                    {
                      folder: "test"
                    },
                    async(err1,result1)=>{
                        if(err1){
                            console.log(err1);
                        }
    
                        // Transform the image: auto-crop to square aspect_ratio
                        const autoCropUrl = await cloudinary.url(result1.public_id, {
                            // background:"gen_fill"
                            crop: 'auto_pad',
                            gravity: 'auto',
                            width: 1200,
                            height: 800,
                            transformation: [
                                {overlay: {font_family: "Arial", font_size: 250, text: "Milkat"}},
                                {flags: "layer_apply", gravity: "south_east", y: "0.08", x: "0.08", opacity: 30},
                            ]
                        });
                
                        pool.query("INSERT INTO images (pid,path) VALUES (?, ?)", [insert_id,autoCropUrl], (err2, result2, fields2) => {
                            if(err2){   
                                console.log(err2);
                                return res.status(500).json({ success: false, message: "Error uploading image" });
                            }
                        })
                    }
                );
                
                streamifier.createReadStream(file.buffer).pipe(cld_upload_stream);
            })

            return res.status(200).json({ success: true, message: "Property added successfully" });
        });
    }catch(error){
        return res.status(500).json({ success: false, message: "Server error" });
    }
})

app.get("/properties", (req, res) =>  {
    let {postcode} = req.query;

    const postcode1 =postcode.replace(/^(.*)(.{3})$/,'$1 $2');
    // console.log(postcode1);
    try{

        pool.query(`SELECT *, (SELECT JSON_ARRAYAGG(i.path) FROM images i WHERE i.pid = p.pid) as image_paths, (SELECT JSON_ARRAYAGG(JSON_OBJECT("start_time",t.start_time,"end_time",t.end_time,"anytime",t.anytime)) FROM time_slots t WHERE t.property_id = p.pid) AS time_slots FROM properties p where postcode="${postcode1}"`, (err1, result1, fields1) => {
            if(err1){
                console.log(err1);
                return res.status(500).json({ success: false, message: "Mysql property search error" });
            }
            if(result1.length == 0){
                return res.status(400).json({ success: true, message:"No properties found" });
            }
            // console.log(result1);
            return res.status(200).json({ success: true, properties: result1 });
        })
    }
    catch(error){
        return res.status(500).json({ success: false, message: "Server error" });
    }
})

app.get("/check",verifyToken, (req, res) => {
    return res.status(200).json({ success: true, message: "Done" });
})

// app.get("/propertie", (req, res) => {
//     const postcode = req.query.postcode;
//     pool.query(`SELECT 
//     GROUP_CONCAT(CONCAT(i.path, ' | ', t.start_time, ' | ', t.end_time, ' | ', t.anytime) SEPARATOR '; ') AS image_time_details
// FROM 
//     images i 
// JOIN 
//     time_slots t ON t.property_id = i.pid 
// WHERE 
//     i.pid = 107`, (err, result, fields) => {
//         if(err){
//             console.log(err);
//             return res.status(500).json({ success: false, message: "Mysql property search error" });
//         }
//         console.log(result);
//         return res.status(200).json({ success: true, properties: result });
//     })
// })


app.use((error, req, res, next) => {
    const message = error.message || "Internal Server Error";
    const statusCode = error.statusCode || 500;
    console.log("Message:***********************",error);
})

// function funct(){ 
//     let data ="U2FsdGVkX19EFnf1%2BlvWjMIj0U%2BQHMp1vkQhqRLy5MHcI%2Brcpvbr5atHpHSSYfuz1iSAy8F9%2BveDuCaBZNhXZEhlxuJXRWVUV7cQcujSAG7TbYXEoabzeXifyoTbxBVj5d3XsN5P8uqokdwYvtQzabXxuNJdHESSU21kykw97HzFao%2BVKPeHXAI5fHzb0HKBmAQ%2BAZLKEQN3mRsYeujuVqvPImgTnd2ZES4EoOlMeI9lr3Zk8Yx1nby10ejiAHee7eXD0cFkCJTZ6bpwvYM7n1OUuiVdKjPmwvnyeqjNECrLHrUqRO5Ia7V7RmpNaSahPLUd2SRAbDgg%2B0GlTb2F1Wb3RAL7Ehc38x4QDOgwbWI%3D";
//     const bytes = CryptoJS.AES.decrypt(decodeURIComponent(data), process.env.CRYPTO_SECRET);
//     const originalText = bytes.toString(CryptoJS.enc.Utf8);

//     console.log(originalText);
//     // return res.status(200).json({ success: true, message: "hello" });
// }

// funct();


app.post("/postcode", async (req, res) => {
    let {postcode} = req.body;

    if(postcode){
        await axios.request({
            method: "get",
            url: `https://api.getAddress.io/autocomplete/${postcode}?api-key=${process.env.GET_ADDRESS_API_KEY}`
        }).then((response) => {
            return res.status(200).json({ success: true, message: response.data });
        }).catch((error) => {
            return res.status(500).json({ success: false, message: error });
        })
    }else{
        console.log("No postcode");
    }

})

app.post("/postcode_address", async (req, res) => {
    let {url} = req.body;
   
    if(url){
        await axios.request({
            method: "get",
            url: "https://api.getAddress.io/"+url+"?api-key="+process.env.GET_ADDRESS_API_KEY
        }).then((response) => {
            return res.status(200).json({ success: true, message: response.data });
        }).catch((error) => {   
            return res.status(500).json({ success: false, message: error });
        })
    }else{  
        console.log("No url");
    }
})

app.listen(port, () => console.log(`Server running on port ${port}!`))          



 // console.log(url);

    // const response ={
    //     "postcode": "LE5 3SA",
    //     "latitude": 52.6384,
    //     "longitude": -1.10326,
    //     "formatted_address": [
    //         "Little Mumins Daycare Ltd",
    //         "89 Rolleston Street",
    //         "",
    //         "Leicester",
    //         "Leicestershire"
    //     ],
    //     "thoroughfare": "Rolleston Street",
    //     "building_name": "",
    //     "sub_building_name": "",
    //     "sub_building_number": "",
    //     "building_number": "89",
    //     "line_1": "Little Mumins Daycare Ltd",
    //     "line_2": "89 Rolleston Street",
    //     "line_3": "",
    //     "line_4": "",
    //     "locality": "",
    //     "town_or_city": "Leicester",
    //     "county": "Leicestershire",
    //     "district": "Leicester",
    //     "country": "England",
    //     "residential": false
    // };
