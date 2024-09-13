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
const nodemailer = require("nodemailer");

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

//set cors so that frontend can access backend
app.use(cors({
    origin: [process.env.ORIGIN],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Custom-Header',
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

//used to store email id of logged in user
let G_EMAIL="a@b.com"

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "milkatproperties@gmail.com",
      pass: process.env.EMAIL_PASS,
    },
});

const days = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
};

const hashPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

//middleware to handle errors
app.use((error, req, res, next) => {
    const message = error.message || "Internal Server Error";
    const statusCode = error.statusCode || 500;
    console.log("Message:",error);
})

//middleware to verify token and check whether the user exists in the database or not before accessing any route otherwise cookies will be deleted and user will be logged out
const verifyToken = (req, res, next) => {
    const token = req.cookies.token||"abcd";
    // console.log(token)
    
    try{
        if (token==="abcd") {
            return res.status(401).json({ success: false, message: 'Unauthorized: Token missing' });
        }

        const decryptedToken = CryptoJS.AES.decrypt(token, process.env.CRYPTO_SECRET).toString(CryptoJS.enc.Utf8);
        const emailTemp = decryptedToken.match(new RegExp(`email=([^;]+)`));
        const tokenTemp = decryptedToken.match(new RegExp(`token=([^;]+)`));

        const email = emailTemp[1];
        G_EMAIL = email;
        const token1 = tokenTemp[1];

        pool.query(`SELECT * FROM user WHERE email = ?`, [email],async  (err, result, fields) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Something went wrong" });
            }
            if (result.length == 0) {
                res.clearCookie("token");
                res.status(401).json({ success: false, message: 'Already logged in into other device' });
                res.end();
            } else {
                //check whether token stored in database matches token in cookie
                if(result[0].token === token){
                    await jwt.verify(token1, process.env.JWT_SECRET, (err, decode) => {
                        if (err) {
                            return res.status(401).json({ success: false, message: 'Unauthorized: Invalid access' });
                        }else{
                            if(Date.now()>=(decode.exp*1000)){
                                res.clearCookie("token");
                                res.status(401).json({ success: false, message: 'Unauthorized: Token expired' });
                                res.end();

                                //remove token from database if token is expired
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
                    res.clearCookie("token");
                    res.status(401).json({ success: false, message: 'Already logged in into other device' });
                    res.end();
                }
            }
        });
    }catch(error){
        return res.status(401).json({ error: 'Unauthorized: Invalid access' });
    }
}


app.post("/register", async (req, res) => {
    const { name, email, password, role } = req.body;

    let hashedPassword = await hashPassword(password);

    try {
        //check if user already exists
        pool.query(`SELECT * FROM user WHERE email = ?`, [email], (err, result, fields) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Something went wrong" });
            }
            if (result.length > 0) {
                return res.status(409).json({ success: false, message: "User already exists" });
            } else {
                //insert user
                pool.query("INSERT INTO user (name, email, password, admin) VALUES (?, ?, ?, ?)", [name, email, hashedPassword, role], (err1, result1, fields1) => {
                    if (err1) {
                        console.log(err1);
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
        //check user's email and password match
        pool.query(`SELECT * FROM user WHERE email = ?`, [email], async (err, result, fields) => {
            if (err) {  
                return res.status(500).json({ success: false, message: "Something went wrong" });
            } 
            if(result.length === 0) {
                return res.status(401).json({success:false, message:"Provided email does not registered"});
            }else{
                const passwordMatch = await bcrypt.compare(password, result[0].password);
                if (passwordMatch){

                    if(result[0].admin === 1){
                        role = "admin";
                    }else{
                        role = "user";
                    }

                    const name = result[0].name;

                    const token = jwt.sign({ email: email, role: role }, process.env.JWT_SECRET, { expiresIn: '1h' });

                    const tempToken = `token=${token};email=${email};role=${role};name=${name}`;

                    const encryptedToken = CryptoJS.AES.encrypt(tempToken, process.env.CRYPTO_SECRET).toString();

                    res.cookie("token", encryptedToken, { 
                        // httpOnly: true, 
                        // sameSite: 'none', 
                        // secure: true, 
                        maxAge: 3600000 
                    });

                    //add token to database
                    pool.query(`UPDATE user SET token = ? WHERE email = ?`, [encryptedToken, email], (err1, result1, fields1) => {
                        if (err1) {
                            return res.status(500).json({ success: false, message: "Something went wrong" });
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

app.get("/logout", verifyToken, (req, res) => {
    res.clearCookie("token");
    try{
        //remove token from database
        pool.query(`UPDATE user SET token = NULL WHERE email = ?`, [G_EMAIL], (err, result, fields) => {
            if(err){
                console.log(err);
                return res.status(500).json({ success: false, message: "Something went wrong" });
            }
            return res.status(200).json({ success: true, message: "Logged out successfully" });
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
})

app.post("/listup", verifyToken, upload.any("images") , (req, res) => {
    const images = req.files;
    const { headline,description,propertyType,saleRent,price,bathroom,bedroom,reception,postcode,town,address_line1,address_line2,address_line3,location} = req.body;
    
    //change postcode format (e.g. LE1 2FT)
    const postcode1 = postcode.replace(/^(.*\S)(\S{3})$/, '$1 $2').toUpperCase();

    let sale=0;
    if(saleRent == "sale"){
        sale=1;
    }

    try{
        if(G_EMAIL == "a@b.com")
            throw Error("Not authorized");

        //check if user is admin
        pool.query(`SELECT admin From user where email=?`, [G_EMAIL], (err, result, fields) => {
            if(err){
                console.log(err);
                return res.status(500).json({ success: false, message: "Something went wrong" });
            }
            if(result.length == 0){
                return res.status(400).json({ success: true, message:"No user found" });
            }
            //only admin can add properties
            if(result[0].admin == 1){
                pool.query("INSERT INTO properties (email,headline,description,property_type,sale,price,bathroom,bedroom,reception,postcode,town,address_line1,address_line2,address_line3,location) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [G_EMAIL,headline,description,propertyType,sale,price,bathroom,bedroom,reception,postcode1,town,address_line1,address_line2,address_line3,location], (err1, result1, fields1) => {
                    if(err1){
                        console.log(err1);
                        return res.status(500).json({ success: false, message: "Something went wrong" });
                    }
        
                    //id of inserted property
                    const insertId = result1.insertId;
                    
                    //inserting time slots into time_slots table
                    let timeSlots1=[];
                    if(req.body.time_slots &&req.body.time_slots.length>0){
                        const timeSlots = JSON.parse(req.body.time_slots);
                        timeSlots1 = timeSlots.map(obj=>[insertId,new Date(obj.start),new Date(obj.end),0]);
                    }else{
                        timeSlots1 =[[insertId,null,null,1]];
                    }
        
                    pool.query("INSERT INTO time_slots (property_id,start_time,end_time,anytime) VALUES ?", [timeSlots1], (err2, result2, fields2) => {
                        if(err2){   
                            console.log(err2);
                            return res.status(500).json({ success: false, message: "Error inserting time slots" });
                        }
                    })
        
                    //Uploading an image to cloudinary, using that image for watermark using picnie 
                    images.map(async (file) => {
                        let cloudUploadStream = await cloudinary.uploader.upload_stream(
                            {
                              folder: "test"
                            },
                            async(err1,result1)=>{
                                if(err1){
                                    console.log(err1);
                                }
                
                                // Transform the image: auto-pad to square aspect_ratio
                                const autoCropUrl = await cloudinary.url(result1.public_id, {
                                    crop: 'auto_pad',
                                    gravity: 'auto',
                                    width: 1200,
                                    height: 800,
                                    
                                });
                        
                                const data ={
                                    "project_id": 1630,
                                    "background_image_url":`${autoCropUrl}`,
                                    "front_image_url":"https://res.cloudinary.com/dedjlhhmj/image/upload/v1724254464/test/kjizq7xvdpustn9zyrpa.png",
                                    "position":"bc",
                                    "image_max_width":"1200",
                                    "image_max_height":"800"
                                }
                            
                                await axios.post("https://picnie.com/api/v1/add-watermark-image",data,{ headers: {"Authorization" : process.env.PICNIE_WATERMARK_API_KEY} }).then((response) => {
                                    //inserting image into images table for corresponding property
                                    pool.query("INSERT INTO images (pid,path) VALUES (?, ?)", [insertId,response.data.url], (err3, result3, fields3) => {
                                        if(err3){   
                                            console.log(err3);
                                            return res.status(500).json({ success: false, message: "Error uploading image" });
                                            return true;
                                        }
                                    })
                                })
                            }
                        );
                        
                        streamifier.createReadStream(file.buffer).pipe(cloudUploadStream);
                    });
        
                    return res.status(200).json({ success: true, message: "Property added successfully" });
                });
            }else{
                return res.status(400).json({ success: true, message:"You are not authorized to perform this action" });
            }
        })

        
    }catch(error){
        return res.status(500).json({ success: false, message: "Server error" });
    }
})

app.get("/deleteProperty", verifyToken, (req, res) => {
    let {pid} = req.query;
    
    try{
        pool.query(`DELETE FROM properties WHERE pid = ?`, [pid], (err, result, fields) => {
            if(err){
                console.log(err);
                return res.status(500).json({ success: false, message: "Something went wrong" });
            }
            return res.status(200).json({ success: true, message: "Property deleted successfully" });
        })
    }
    catch(error){
        return res.status(500).json({ success: false, message: "Server error" });
    }
})

//add time slots for a particular property by admin
app.post("/timeslot",verifyToken, (req, res) => {
    const {timeslots,pid}=req.body;

    //value holds in the format [{pid,start_time,end_time,anytime}]
    let timeslots1 = timeslots.map(obj=>[pid,new Date(obj.start),new Date(obj.end),0]);

    try{
        //fetch anytime from time_slots table
        pool.query("SELECT anytime FROM time_slots WHERE property_id = ? ",[pid],(err,result,fields)=>{
            if(err){
                console.log(err);
                return res.status(500).json({ success: false, message: "Something went wrong" });
            }
            if(result.length==0){
                res.status(400).json({ success: true, message: "No such property exists" });
            }
            //delete the entry from time_slots table if the property has anytime checked and then insert the new time slots with anytime = 0
            if(result[0].anytime){
                pool.query("DELETE FROM time_slots WHERE property_id = ? AND anytime = 1",[pid],(err1,result1,fields1)=>{
                    if(err1){
                        console.log(err1);
                        return res.status(500).json({ success: false, message: "Something went wrong" });
                    }
                    pool.query("INSERT INTO time_slots (property_id,start_time,end_time,anytime) VALUES ?", [timeslots1], (err2, result2, fields2) => {
                        if(err2){   
                            console.log(err2);
                            return res.status(500).json({ success: false, message: "Error inserting time slots" });
                        }
                        res.status(200).json({ success: true, message: "Time slots added successfully" });
                    })
                })
            }else{
                pool.query("INSERT INTO time_slots (property_id,start_time,end_time,anytime) VALUES ?", [timeslots1], (err2, result2, fields2) => {
                    if(err2){   
                        console.log(err2);
                        return res.status(500).json({ success: false, message: "Error inserting time slots" });
                    }
                    res.status(200).json({ success: true, message: "Time slots added successfully" });
                })
            }
        })
    }
    catch(error){
        return res.status(500).json({ success: false, message: "Server error" });
    }
})

app.get("/rating",verifyToken, (req, res) => {
    let {pid,rating} = req.query;
    
    try{
        pool.query("SELECT rating FROM rating WHERE uid = (SELECT uid FROM user WHERE email = ?) AND pid = ? ",[G_EMAIL ,pid],(err,result,fields)=>{
            if(err){
                console.log(err);
                return res.status(500).json({ success: false, message: "Something went wrong" });
            }
            if(result.length!=0 && result[0].rating){
                res.status(400).json({ success: true, message: "Already rated" });
            }else{
                //fetch old rating and old rating count for a corresponding property
                pool.query("SELECT rating,rating_count FROM properties WHERE pid = ? ",[pid],(err1,result1,fields1)=>{
                    if(err1){
                        console.log(err1);
                        return res.status(500).json({ success: false, message: "Something went wrong" });
                    }
                    if(result1.length==0){
                        res.status(400).json({ success: true, message: "No such property exists" });
                    }
                    const oldRating = result1[0].rating;
                    const oldRatingCount = result1[0].rating_count;
                    const newRatingCount = oldRatingCount+1;

                    //calculate new rating and round it to 1 decimal
                    const newRating = parseFloat(((parseFloat(oldRating)*parseFloat(oldRatingCount))+parseFloat(rating))/parseFloat(newRatingCount)).toFixed(1);
                    
                    pool.query("UPDATE properties SET rating = ?, rating_count = ? WHERE pid = ? ",[newRating,newRatingCount,pid],(err2,result2,fields2)=>{
                        if(err2){
                            console.log(err2);
                            return res.status(500).json({ success: false, message: "Something went wrong" });
                        }
                        //update the rating table for corresponding user and property (as user can only rate a property once)
                        pool.query("INSERT INTO rating (uid,pid,rating) VALUES ((SELECT uid FROM user WHERE email = ?),?,?)",[G_EMAIL,pid,1],(err3,result3,fields3)=>{
                            if(err3){
                                console.log(err3);
                                return res.status(500).json({ success: false, message: "Something went wrong" });
                            }
                            res.status(200).json({ success: true, message: "Rating added successfully" });
                        })
                    })
                })
            }
        })
    }
    catch(error){
        return res.status(500).json({ success: false, message: "Server error" });
    }
})


//used to fetch nearby details for a property
app.post("/nearby", (req, res) => {
    let {latitude, longitude} = req.body;
    
    //external api to fetch nearby details
    axios.get(`https://api.geoapify.com/v2/places?categories=commercial.supermarket,leisure.park,catering.restaurant,public_transport.bus,service.vehicle.fuel,education.school&filter=circle:${longitude},${latitude},1700&bias=proximity:${longitude},${latitude}&apiKey=${process.env.GEOAPIFY_API_KEY}`)
    .then((response) => {
        
        let bus = response.data.features.filter((data)=>data.properties.categories.includes("public_transport.bus")).length;
        let school = response.data.features.filter((data)=>data.properties.categories.includes("education.school")).length;
        let fuel = response.data.features.filter((data)=>data.properties.categories.includes("service.vehicle.fuel")).length;
        let supermarket = response.data.features.filter((data)=>data.properties.categories.includes("commercial.supermarket")).length;
        let restaurant = response.data.features.filter((data)=>data.properties.categories.includes("catering.restaurant")).length;

        axios.get(`https://api.geoapify.com/v2/places?categories=public_transport.train&filter=circle:${longitude},${latitude},1700&bias=proximity:${longitude},${latitude}&apiKey=${process.env.GEOAPIFY_API_KEY}`)
        .then((response) => {
            let train = response.data.features.filter((data)=>data.properties.categories.includes("public_transport.train")).length;

            //stores number of nearby facilities for a particular property
            let temp = {
                "bus": bus,
                "school": school,
                "fuel": fuel,
                "supermarket": supermarket,
                "restaurant": restaurant,
                "train": train
            }
            return res.status(200).json({ success: true, message: temp });
        })
        .catch((error) => {
            return res.status(500).json({ success: false, message: "Something went wrong" });
        })
    })
    .catch((error) => {
        return res.status(500).json({ success: false, message: "Server error" });
    })
})

//used to fetch properties based on postcode
app.get("/properties", (req, res) =>  {
    let {postcode,page} = req.query;

    if(page==undefined){
        page=1;
    }

    //number of items per page
    const limit = 6;
    //total number of pages
    let count=1;
    const offset=(page-1)*limit;
    
    if(postcode.length < 3){
        return res.status(400).json({ success: false, message: "Enter more than 3 characters" });
    }

    //change postcode format (e.g. LE1 2FT)
    const postcode1 = postcode.replace(/^(.*\S)(\S{3})$/, '$1 $2').toUpperCase();

    try{
        //get total number of properties for pagination
        pool.query(`SELECT count(*) as count FROM properties where postcode like "${postcode1}%"`, (err, result, fields) => {
            if(err){
                console.log(err);
                return res.status(500).json({ success: false, message: "Something went wrong" });
            }
            count = Math.floor(result[0].count/limit+0.9999);
            
        })

        //get list of properties along with image paths and store in an array
        pool.query(`SELECT *, (SELECT JSON_ARRAYAGG(i.path) FROM images i WHERE i.pid = p.pid) as image_paths FROM properties p where postcode like "${postcode1}%" limit ${limit} offset ${offset}`, (err1, result1, fields1) => {
            if(err1){
                console.log(err1);
                return res.status(500).json({ success: false, message: "Something went wrong" });
            }
            if(result1.length == 0){
                return res.status(400).json({ success: true, message:"No properties found" });
            }
            return res.status(200).json({ success: true, properties: result1, count: count });
        })
    }
    catch(error){
        return res.status(500).json({ success: false, message: "Server error" });
    }
})

//get property details based on property id
app.get("/property/:id", (req, res) => {
    let {id} = req.params;

    try{
        //delete expired time slots
        pool.query(`SELECT * FROM time_slots where property_id="${id}"`, (err, result, fields) => {
            if(err){
                console.log(err);
            }
            if(result.length == 0){
                //no time slots
            }
            const today = new Date().getTime();
            result.map((item) => {
                const startTime = new Date(item.start_time).getTime();
                if(today>=startTime){
                    pool.query(`DELETE FROM time_slots where time_slot_id="${item.time_slot_id}" AND anytime!=1`, (err1, result1, fields1) => {
                        if(err1){
                            console.log(err1);
                        }
                    })
                }
            })
        })

        //get property details along with image paths and store in an array
        pool.query(`SELECT *, (SELECT JSON_ARRAYAGG(i.path) FROM images i WHERE i.pid = p.pid) as image_paths, (SELECT JSON_ARRAYAGG(JSON_OBJECT("tid",t.time_slot_id,"start_time",t.start_time,"end_time",t.end_time,"anytime",t.anytime)) FROM time_slots t WHERE t.property_id = p.pid AND t.used=0) AS time_slots FROM properties p where pid="${id}"`, (err1, result1, fields1) => {
            if(err1){
                console.log(err1);
                return res.status(500).json({ success: false, message: "Something went wrong" });
            }
            if(result1.length == 0){
                return res.status(400).json({ success: true, message:"No property found" });
            }
            //add empty time slots if no time slots are available
            if(!result1.time_slots){
                result1.time_slots = [{}];
            }
            
            return res.status(200).json({ success: true, property: result1 });
        });
    }
    catch(error){
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

//check whether property is bookmarked or not
app.post("/saved",verifyToken, (req, res) => {
    let {pid} = req.body;
    
    pool.query(`SELECT * from user_saved_properties WHERE uid=(SELECT uid FROM user WHERE email="${G_EMAIL}") AND pid="${pid}"`, (err1, result1, fields1) => {
        if(err1){
            console.log(err1);
            return res.status(500).json({ success: false, message: "Something went wrong" });
        }
        if(result1.length == 0){
            return res.status(400).json({ success: true, message:"Property not saved" });
        }
        return res.status(200).json({ success: true, message: true });
    })
})

//Bookmark property
app.post("/save",verifyToken, (req, res) => {
    let {pid} = req.body;

    pool.query(`INSERT INTO user_saved_properties (pid, uid) VALUES ("${pid}", (SELECT uid FROM user WHERE email="${G_EMAIL}"))`, (err1, result1, fields1) => {
        if(err1){
            console.log(err1);
            return res.status(500).json({ success: false, message: "Something went wrong" });
        }
        return res.status(200).json({ success: true, message: "Property saved" });
    })
})

//Unbookmark property
app.post("/unsave",verifyToken, (req, res) => {
    let {pid} = req.body;

    pool.query(`DELETE FROM user_saved_properties WHERE pid="${pid}" AND uid=(SELECT uid FROM user WHERE email="${G_EMAIL}")`, (err1, result1, fields1) => {
        if(err1){
            console.log(err1);
            return res.status(500).json({ success: false, message: "Something went wrong" });
        }
        return res.status(200).json({ success: true, message: "Property unsaved" });
    })
})

//Book time slot for property and send email to both owner and user
app.post("/booking", verifyToken, (req, res) => {
    let {tid, pid, email, timeslots, streetName, postcode} = req.body;

    try{
        if(G_EMAIL == email){
            return res.status(400).json({ success: false, message: "You cannot book time slot for your own property" });
        }

        //check whether booking already exists
        pool.query(`SELECT * FROM booking WHERE uid=(SELECT uid FROM user WHERE email=?) AND pid=?`, [G_EMAIL, pid, tid],async (err1, result1, fields1) => {
            if(err1){
                console.log(err1);
                return res.status(500).json({ success: false, message: "Something went wrong" });
            }
            if(result1.length != 0){
                return res.status(400).json({ success: false, message: "You have already booked time slot for this property" });
            }
            
            //send email to user
            await transporter.sendMail({
                from: `"Milkat Properties" <milkatproperties@gmail.com>`,
                to: G_EMAIL,
                subject: "Booking for the property veiwing slot ⏲",
                text: `Time Slots: ${timeslots[0].start_time} to ${timeslots[0].end_time}`,
                html: `<i>Booking confirmed for the property veiwing as per given time below</i><br/><br/><b> Time Slot: ${new Date(timeslots[0].start_time).toLocaleDateString() + " " + days[new Date(timeslots[0].start_time).getDay()] + " : " + new Date(timeslots[0].start_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }) + " to " + new Date(timeslots[0].end_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })}</b><br/><br/><b>Address: ${streetName}, ${postcode}</b><br/><br/>Contact the property owner for more details during this time.<br/><br/>Regards,<br/>Milkat Properties`, 
            });

            //send email to owner
            await transporter.sendMail({
                from: `"Milkat Properties" <milkatproperties@gmail.com>`,
                to: email,
                subject: "Booking for the property veiwing slot ⏲",
                text: `Time Slots: ${timeslots[0].start_time} to ${timeslots[0].end_time}`,
                html: `<i>This is to inform you that a booking has been confirmed for the property veiwing as per given time below with the client</i><br/><br/><b> Time Slot: ${new Date(timeslots[0].start_time).toLocaleDateString() + " " + days[new Date(timeslots[0].start_time).getDay()] + " : " + new Date(timeslots[0].start_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }) + " to " + new Date(timeslots[0].end_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })}</b><br/><br/><b>Address: ${streetName}, ${postcode}</b><br/><br/> Contact the client for more details during this time.<br/><br/>Regards,<br/>Milkat Properties`, 
            });

            //update database to change time slot is used
            pool.query(`UPDATE time_slots SET used = 1 WHERE time_slot_id = ${tid}`, (err2, result2, fields2) => {
                if(err2){
                    console.log(err);
                }
                //insert booking of user for particular property
                pool.query(`INSERT INTO booking (uid,pid,tid) VALUES ((SELECT uid FROM user WHERE email = ?),?,?)`, [G_EMAIL, pid, tid], (err3, result3, fields3) => {
                    if(err3){
                        console.log(err1);
                    }
                })
                
            });

            return res.status(200).json({ success: true, message: "Booking confirmed" });
        })


    }catch(error){
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

//get booked properties of corresponding user
app.post("/userDashboard", verifyToken, (req, res) => {
    const {page} = req.body;
    const limit = 6;
    const offset=(parseInt(page)-1)*limit;
    let count=1;
    
    try{
        //count number of pages
        pool.query(`SELECT count(*) as count FROM user_saved_properties WHERE uid = (SELECT uid FROM user WHERE email = "${G_EMAIL}")`, (err, result, fields) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: "Something went wrong" });
            }
            count = Math.floor(result[0].count/limit+0.9999);
        })

        //get bookmarked properties of corresponding user
        pool.query(`SELECT *, (SELECT JSON_ARRAYAGG(i.path) FROM images i WHERE i.pid = p.pid) as image_paths FROM properties p where p.pid IN(SELECT pid FROM user_saved_properties WHERE uid = (SELECT uid FROM user WHERE email = "${G_EMAIL}")) limit ${limit} offset ${offset}`, (err1, result1, fields1) => {
            if (err1) {
                console.log(err1);
                return res.status(500).json({ success: false, message: "Something went wrong" });
            }
            return res.status(200).json({ success: true, properties: result1 , count: count});
        })
    } catch(error){
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
})

//get listed of properties of corresponding user
app.post("/adminDashboard", verifyToken, (req, res) => {
    const {page} = req.body;
    const limit = 6;
    const offset=(parseInt(page)-1)*limit;
    let count=1;

    try{
        //count number of pages
        pool.query(`SELECT count(*) as count FROM properties WHERE email = "${G_EMAIL}"`, (err, result, fields) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: "Something went wrong" });
            }
            count = Math.floor(result[0].count/limit+0.9999);
        })

        //get listed properties of corresponding user
        pool.query(`SELECT *, (SELECT JSON_ARRAYAGG(i.path) FROM images i WHERE i.pid = p.pid) as image_paths FROM properties p where p.email = "${G_EMAIL}" limit ${limit} offset ${offset}`, (err1, result1, fields1) => {
            if (err1) {
                console.log(err1);
                return res.status(500).json({ success: false, message: "Something went wrong" });
            }
            return res.status(200).json({ success: true, properties: result1, count: count });
        })
    } catch(error){
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
})

//insert chat message for corresponding user
app.post("/chat", verifyToken, (req, res) => {
    const {postcode,comments} = req.body;
    const postcode1= postcode.replace(/^(.*\S)(\S{3})$/, '$1 $2').toUpperCase();
    
    pool.query(`SELECT uid FROM user WHERE email = ?`, [G_EMAIL], (err1, result1) => {
        if (err1) {
            console.log(err2);
            return res.status(500).json({ success: false, message: "MySQL user lookup error" });
        }

        if (result1.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const uid = result1[0].uid;

        // insert the chat message
        pool.query(
            `INSERT INTO chats (postcode, comment, uid) VALUES (?, ?, ?)`,
            [postcode1, comments, uid],
            (err2, result2) => {
                if (err2) {
                    console.log(err2);
                    return res.status(500).json({ success: false, message: "MySQL chat error" });
                }
                return res.status(200).json({ success: true, message: "Chat sent" });
            }
        );
    });

})

//get all chat messages
app.get("/chatLookup", verifyToken, (req, res) => {
    pool.query(`SELECT *, (SELECT name FROM user WHERE user.uid = chats.uid) AS name FROM chats`, (err, result, fields) => {
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, message: "Mysql chat lookup error" });
        }
        return res.status(200).json({ success: true, message: result });
    });
})

//get list of addresses based on postcode
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

//get full address based on selected address
app.post("/postcodeAddress", async (req, res) => {
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

//get average house price from year 2000 to 2019 from database
app.get("/propertiesPrice", async (req, res) => {
    try{
        pool.query("SELECT * FROM average_house_price", (err, result, fields) => {
            if(err){
                console.log(err);
                return res.status(500).json({ success: false, message: "Something went wrong" });
            }
            if(result.length == 0){
                return res.status(200).json({ success: true, prices: [] });
            }
            return res.status(200).json({ success: true, prices: result });
        })
    } catch(error){
        console.log(error);
    }
})

app.listen(port, () => console.log(`Server running on port ${port}!`))          

module.exports = app