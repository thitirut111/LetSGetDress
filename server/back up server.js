// const express = require('express')
// const mysql = require('mysql');
// const cors = require("cors")
// const { networkInterfaces } = require('os');

// const nets = networkInterfaces();
// const results = Object.create(null); // Or just '{}', an empty object

// for (const name of Object.keys(nets)) {
//     for (const net of nets[name]) {
//         // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
//         // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
//         const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
//         if (net.family === familyV4Value && !net.internal) {
//             if (!results[name]) {
//                 results[name] = [];
//             }
//             results[name].push(net.address);
//         }
//     }
// }

// const app =  express();
// app.use(cors());
// app.use(express.json()); //แปลงเป็น object

// const jwt = require('jsonwebtoken');
// const token_obj = 'this is token'
// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 's6501012610033@email.kmutnb.ac.th',
//         pass: ''
//     }
// });

// const { error } = require('console');

// //MySQL connection
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'lets_get_dress'
// })

// connection.connect((err) =>{
//     if (err) {
//         console.log('Error connecting to MySQL database =', err)
//         return;
//     }
//     console.log('MySQL successfully connected!');
// })

// //----------------------------Test--------------------------------------//
// app.get("/test", (req, res) => {
//     console.log("REQUEST GET");
//     res.status(200).json({message: "SERVER OKAY"})
// })

// //----------------------------Sign up--------------------------------------//

// //for sign up
// app.get("/sign_up", async (req, res) => {
//     const {password, confirm} = req.body;
//     const email = req.body.email

//     try {
//         // ตรวจสอบรหัสที่สร้างว่าเหมือนกันมั้ย
//         if (password != confirm) {
//             return res.status(400).json({status:"fail", message: "Password must be the same"});
//         }

//         connection.query(
//             "SELECT * FROM account WHERE ACCOUNT_EMAIL = ?",
//             [email], //แทน ?
//             (err, results, fields) => {
//                 if (err) {
//                     console.log(err);
//                     return res.status(400).send();
//                 }
//                 if (results.map(item => item.ACCOUNT_EMAIL).toString() == email) {
//                     return res.status(400).json({status:"fail" , message: "This email already has an account"});
//                 }
//                 res.status(200).json({status:"success" , message: "You can create new account with this email"});
//             }
//         )
//     }
//     catch(err) {
//         console.log(err);
//         return res.status(500).send();
//     }
// })	

// //----------------------------Fill information--------------------------------------//

// //for fill your information
// app.post("/fill_information", async (req, res) => {
//     const {weight, height, shoulder, bust, waist, hip, email, password} = req.body

//     var figure ='none'
//     if (shoulder-hip > 3) { figure = 'inverted_tri'}
//     else if (shoulder-hip < -3) { figure = 'pear'}
//     else if (hip-waist < 0) { figure = 'apple'}
//     else if (bust-waist > 18 || hip-waist > 23) { figure = 'hourglass'}
//     else if (shoulder-hip < 3 && shoulder-hip > -3) { figure = 'rectangle'}

//     try {
//         // //ใส่ข้อมูลครบทุกอันมั้ย
//         // if (weight.toString().length != 0 && height.toString().length != 0 && bust.toString().length != 0 && waist.toString().length != 0 && hip.toString().length != 0) {
//             //ต้องกรอกแค่ตัวเลขเท่านั้น
//             // if (Number.isFinite(Number(weight)) && Number.isFinite(Number(height)) && Number.isFinite(Number(bust)) && Number.isFinite(Number(waist)) && Number.isFinite(Number(hip))) {
//         connection.query(
//             //เพิ่มข้อมูลลง db
//             "INSERT INTO account(`ACCOUNT_EMAIL`, `ACCOUNT_PASSWORD`, `WEIGHT`, `HEIGHT`, `SHOULDER`, `BUST`, `WAIST`, `HIP`, `FIGURE`) VALUES (?,?,?,?,?,?,?,?,?)", //insert ข้อมูล
//             [email, password, weight, height, shoulder, bust, waist, hip, figure],
//             (err, results, fields) => {
//                 if (err) {
//                     console.log("Error while updating an information of the database", err);
//                     return res.status(400).json({status:"fail", message: "Error while updating an information of the database"});
//                 }
//                 return res.status(200).json({status:"success", message: "Your information successfully updated"})
//             }
//         )
//         //     }
//         //     return res.status(400).json({status:"fail", message: "ํTheese information should only be numbers"})
//         // }
//         // return res.status(400).json({status:"fail", message: "You need to fill all informations"})
//     }
//     catch(err) {
//         console.log(err);
//         return res.status(500).send();
//     }
// })

// //----------------------------Login--------------------------------------//

// //for login
// app.get("/login", async (req, res) => {
//     const email = req.body.email
//     const password = req.body.password;
//     try {
//         connection.query(
//             "SELECT * FROM account WHERE ACCOUNT_EMAIL = ? ", //ดึงข้อมูล
//             [email],
//             (err, results, fields) => {
//                 if (err) {
//                     console.log(err);
//                     return res.status(400).send();
//                 }

//                 //เช้คว่ามีอีเมลนี้ใน db มั้ย
//                 if (results.length == 0) {
//                     return res.status(400).json({status:"fail", message: "No account with this email"});
//                 }

//                 //เช้คว่า email&password ถูกมั้ย
//                 if (results[0].ACCOUNT_PASSWORD != password) {
//                     return res.status(404).send({status:"fail", message: "Email or Password is incorrect"}); 
//                 }

//                 //ส่ง OTP ไปที่ email
//                 fetch('http://192.168.1.48:3360/send_login_OTP/' + new URLSearchParams(email), {
//                     method: 'GET', 
//                 })
//                 .then(res => res.json())
//                 .then(outcome => {
//                     res.status(200).json({status:"sucess", message: "can go to Verify Email", results: results, token: outcome.token});
//                 })
//             })
//     }
//     catch(err) {
//         console.log(err);
//         return res.status(500).send();
//     }
// })

// // ปุ่ม forgot password
// app.get("/forgot_password", async (req, res) => {
//     const email = req.body.email;

//     try {
//         connection.query(
//             "SELECT * FROM account WHERE ACCOUNT_EMAIL = ?",
//             [email],
//             (err, results, fields) => {
//                 if (err) {
//                     console.log(err);
//                     return res.status(400).send();
//                 }
//                 //เช้คว่ามีอีเมลนี้ใน db มั้ย
//                 if (results.length == 0) {
//                     return res.status(400).json({status:"fail", message: "No account with this email"});
//                 }

//                 //ส่ง OTP ไปที่ email
//                 fetch('http://192.168.1.48:3360/send_password_OTP/' + new URLSearchParams(email), {
//                     method: 'GET', 
//                 })
//                 .then(res => res.json())
//                 .then(outcome => {
//                     res.status(200).json({status:"success", message: "can go to Verify reset password code overlay", token: outcome.token});
//                 })
//             }
//         )
//     }
//     catch(err) {
//         console.log(err);
//         return res.status(500).send();
//     }
// })

// //----------------------------Verify Email--------------------------------------//

// //send otp / for resend otp
// app.get("/send_login_OTP/:email", async (req, res) => {
//     const email = req.params.email.slice(0,-1)
//     try {
//         const OTP = Math.floor(Math.random() * (9999 - 1000)) + 1000
//         const token = jwt.sign({OTP : OTP}, token_obj, {expiresIn: '10m'});

//         const text_sending = {
//             from: 's6501012610033@email.kmutnb.ac.th',
//             to: email,
//             subject: 'OTP verification on Orange',
//             text:"Dear User :\n\nThank you for coming back to our app. Please use this OTP to complete your Login procedures on Orange. Do not share this OTP to anyone.\n\n" + OTP + "\n\nRegards,\nOrange Team"
//         };

//         transporter.sendMail(text_sending, (err, info) => {
//             if (err) {
//                 console.log(err);
//                 return res.status(400).send();
//             }
//         });

//         return res.status(200).json({token: token});
//     }
//     catch(err) {
//         console.log(err);
//         return res.status(500).send();
//     }
// })

// //to check OTP
// app.get("/verify_OTP", async (req, res) => {
//     const {token, user_OTP} = req.body
//     try { 
//         const payloadBase64 = token.split('.')[1];
//         const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
//         const decoded = JSON.parse(decodedJson)
//         const isTokenExpired = (Date.now() >= decoded.exp * 1000)

//         //ยังไม่หมดอายุ
//         if (isTokenExpired == false) {
//             const decode = jwt.verify(token, token_obj);
//             if (decode.OTP == user_OTP) {
//                 return res.status(200).json({status:"success", message: "OTP is correct"});
//             }
//             return res.status(400).json({status:"fail", message: "OTP is incorrect"});
//         }
//         //หมดอายุแล้ว
//         res.status(400).json({status:"fail", message: "OTP is expired"});
//     }
//     catch(err) {
//         console.log(err);
//         return res.status(500).send();
//     }
// })

// //----------------------------Reset password--------------------------------------//

// //for reset password
// app.post("/reset_password", async (req, res) => {
//     const {id, password, confirm} = req.body

//     try {
//         //เช้คว่า password ตรงกันมั้ย
//         if (confirm != password) {
//             return res.status(400).json({status:"fail", message: "Password must be the same"});
//         }

//         connection.query(
//             //อัพเดตข้อมูลใน db
//             "UPDATE account SET ACCOUNT_PASSWORD = ? WHERE ACCOUNT_ID = ?",
//             [password, id], //แทน ?
//             (err, results, fields) => {
//                 if (err) {
//                     console.log("Error while inserting a user into the database", err);
//                     return res.status(400).send();
//                 }
//                 return res.status(201).json({status:"success", message: "New password successfully update!"});
//             }
//         )
//     }
//     catch(err) {
//         console.log(err);
//         return res.status(500).send();
//     }
// })	

// //----------------------------Verify reset password code--------------------------------------//

// //send otp / for resend otp
// app.get("/send_password_OTP/:email", async (req, res) => {
//     const email = req.params.email.slice(0,-1)
//     try {
//         const OTP = Math.floor(Math.random() * (9999 - 1000)) + 1000
//         const token = jwt.sign({OTP : OTP}, token_obj, {expiresIn: '10m'});

//         const text_sending = {
//             from: 's6501012610033@email.kmutnb.ac.th',
//             to: email,
//             subject: 'OTP verification to reset password on Orange',
//             text:"Dear User :\n\nA request has been received to change the password for your Orange account. Please use this OTP to reset your password. Do not share this OTP to anyone.\n\n" + OTP + "\n\nIf you did not initiate this request, please contact us immediately at our Question and concern.\n\nRegards,\nOrange Team"
//         };

//         transporter.sendMail(text_sending, (err, info) => {
//             if (err) {
//                 console.log(err);
//                 return res.status(400).send();
//             }
//         });

//         return res.status(200).json({token: token});
//     }
//     catch(err) {
//         console.log(err);
//         return res.status(500).send();
//     }
// })

// //----------------------------See New Content--------------------------------------//

// //for new content with model
// app.get("/new_content", async (req, res) => {
//     const id = req.body.id
//     try {
//         connection.query(
//             //ดึงข้อมูลของ content มา
//             "SELECT * FROM content ORDER by CONTENT_ID DESC LIMIT 20",
//             [id],
//             (err, results, fields) => {
//                 if (err) {
//                     console.log("Error while connecting to the database", err);
//                     return res.status(400).send();
//                 }
//                 if (results.length === 0)
//                 {
//                     return res.status(400).json({status:"fail", message: "No content available"});
//                 }
//                 res.status(200).json({status:"success", message: results});
//             }
//         )
//     }
//     catch(err) {
//         console.log(err);
//         return res.status(500).send();
//     }
// })

// //for new content only clothes
// app.get("/new_clothes", async (req, res) => {
//     const id = req.body.id
//     try {
//         connection.query(
//             //ดึงข้อมูลของ content มา
//             "SELECT * FROM clothes ORDER by CLOTHES_ID DESC LIMIT 10",
//             [id],
//             (err, results, fields) => {
//                 if (err) {
//                     console.log("Error while connecting to the database", err);
//                     return res.status(400).send();
//                 }
//                 if (results.length === 0)
//                 {
//                     return res.status(400).json({status:"fail", message: "No content available"});
//                 }
//                 res.status(200).json({status:"success", message: results});
//             }
//         )
//     }
//     catch(err) {
//         console.log(err);
//         return res.status(500).send();
//     }
// })

// //----------------------------See profile--------------------------------------//

// //for see profile IS_PREMIUM ไว้บอกว่าตอนนี้บัญชีนั้นอยู่ในเวอร์ชั่นอะไร 0 = user ปกติ 1 = premium
// app.get("/profile", async (req, res) => {
//     const id = req.body.id
//     try {
//         connection.query(
//             //ดึงข้อมูลของแอคเค้ามา
//             "SELECT * FROM account WHERE ACCOUNT_ID = ?",
//             [id],
//             (err, results, fields) => {
//                 if (err) {
//                     console.log("Error while connecting to the database", err);
//                     return res.status(400).send();
//                 }
//                 if (results.length === 0)
//                 {
//                     return res.status(400).json({status:"fail", message: "Error, Can't find this id in the database"});
//                 }
//                 res.status(200).json({status:"success", message: results});
//             }
//         )
//     }
//     catch(err) {
//         console.log(err);
//         return res.status(500).send();
//     }
// })

// //upgrade to premium
// app.post("/upgrade_premium", async (req, res) => {
//     const {id,method} = req.body

//     try {
//         connection.query(
//             "SELECT * FROM account JOIN premium ON account.ACCOUNT_ID = premium.ACCOUNT_ID WHERE account.ACCOUNT_ID = ?",
//             [id],
//             (err, results, fields) => {
//                 if (err) {
//                     console.log(err);
//                     return res.status(400).send();
//                 }
//                 if (results.length === 0)
//                 {
//                     //ยังไม่เคยสมัคร premium มาก่อน
//                     connection.query(
//                         "INSERT INTO premium(ACCOUNT_ID, PAYMENT_METHOD, NEXT_BILL_DATE) VALUES(?, ?, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 28 DAY))",
//                         [id,method],
//                         (err, results, fields) => {
//                             if (err) {
//                                 console.log(err);
//                                 return res.status(400).send();
//                             }
//                         }
//                     )
//                 }
//                 else {
//                     //เคยสมัคร premium แล้ว
//                     connection.query(
//                         "UPDATE premium JOIN account SET STATUS = 1, premium.NEXT_BILL_DATE = DATE_ADD(CURRENT_DATE(), INTERVAL 28 DAY) WHERE account.ACCOUNT_ID = premium.ACCOUNT_ID AND account.ACCOUNT_ID = ?",
//                         [id],
//                         (err, results, fields) => {
//                             if (err) {
//                                 console.log(err);
//                                 return res.status(400).send();
//                             }
//                         }
//                     )
//                 }
//                 //update history
//                 connection.query(
//                     "INSERT INTO history(`ACCOUNT_ID`, `bill_date`) VALUES (?,CURRENT_DATE)",
//                     [id],
//                     (err, results, fields) => {
//                         if (err) {
//                             console.log(err);
//                             return res.status(400).send();
//                         }
//                     }
//                 )

//                 //ส่งเมลยืนยันการสมัคร premium
//                 const text_sending = {
//                     from: 's6501012610033@email.kmutnb.ac.th',
//                     to: results[0].ACCOUNT_EMAIL,
//                     subject: 'Thank you for your subscription to Orange premium',
//                     text:"Dear User :\n\nThank you for your subscription to Orange premium! We've successfully processed your payment of 199.00฿\n\nIf you've any further questions please visit our Question and concern.\n\nRegards,\nOrange Team"
//                 };

//                 transporter.sendMail(text_sending, (err, info) => {
//                     if (err) {
//                         console.log(err);
//                         return res.status(400).send();
//                     }
//                 });

//                 return res.status(200).json({status:"success", message : "Upgrade to premium successfully!"})
//             }
//         )
//     }
//     catch(err) {
//         console.log(err);
//         return res.status(500).send();
//     }
// })

// //----------------------------Edit profile--------------------------------------//

// //for edit profile รวมทั้ง premium และปกติ email = เดิม newemail = email ใหม่
// app.patch("/edit_profile", async (req, res) => {
//     const {weight, height,shoulder, bust, waist, hip, newemail, password, id} = req.body

//     var figure ='none'
//     if (shoulder-hip > 3) { figure = 'inverted_tri'}
//     else if (shoulder-hip < -3) { figure = 'pear'}
//     else if (hip-waist < 0) { figure = 'apple'}
//     else if (bust-waist > 18 || hip-waist > 23) { figure = 'hourglass'}
//     else if (shoulder-hip < 3 && shoulder-hip > -3) { figure = 'rectangle'}

//     try {
//         //ส่งข้อมูลมาครบถ้วนมั้ย
//         if (weight.toString().length != 0 && height.toString().length != 0 && bust.toString().length != 0 && waist.toString().length != 0 && hip.toString().length != 0 && newemail.length != 0 && password.length != 0) {
//             //ต้องกรอกแค่ตัวเลขเท่านั้น
//             if (Number.isFinite(Number(weight)) && Number.isFinite(Number(height)) && Number.isFinite(Number(bust)) && Number.isFinite(Number(waist)) && Number.isFinite(Number(hip))) {
//                 connection.query(
//                     "UPDATE account SET ACCOUNT_EMAIL = ?, ACCOUNT_PASSWORD = ?, WEIGHT = ?, HEIGHT = ?, SHOULDER = ?, BUST = ?, WAIST = ?, HIP = ?, FIGURE = ? WHERE ACCOUNT_ID = ?",
//                     [newemail, password, weight, height, shoulder, bust, waist, hip, figure, id],
//                     (err, results, fields) => {
//                         if (err) {
//                             console.log(err);
//                             return res.status(400).send();
//                         }
//                     })
//                     return res.status(200).json({status:"success", message : "Profile updated successfully!"})
//             }
//             return res.status(400).json({status:"fail", message : "ํTheese information should only be numbers"})
//         }
//         res.status(400).json({status:"fail", message : "You need to fill all informations"})
//     }
//     catch(err) {
//         console.log(err);
//         return res.status(500).send();
//     }
// })

// //----------------------------Payment Detail--------------------------------------//

// //for payment detail payment method, next bill date
// app.get("/payment_detail", async (req, res) => {
//     const id = req.body.id

//     try {
//         connection.query(
//             "SELECT premium.PAYMENT_METHOD, DATE_FORMAT(premium.NEXT_BILL_DATE, '%d %M %Y') AS NEXT_BILL_DATE FROM account JOIN premium WHERE account.ACCOUNT_ID = premium.ACCOUNT_ID AND account.ACCOUNT_ID = ?",
//             [id],
//             (err, results, fields) => {
//                 if (err) {
//                     console.log(err);
//                     return res.status(400).send();
//                 }
//                 if (results.length === 0)
//                 {
//                     return res.status(400).json({status:"fail", message: "Error, Can't find this id in the database"});
//                 }
//                 return res.status(200).json({status:"success", message : "Get information successfully!", results: results})
//             }
//         )
//     }
//     catch(err) {
//         console.log(err);
//         return res.status(500).send();
//     }
// })

// //for payment detail history
// app.get("/payment_history", async (req, res) => {
//     const id = req.body.id

//     try {
//         connection.query(
//             "SELECT DATE_FORMAT(history.bill_date, '%d %M %Y') AS BILL_DATE FROM account JOIN premium ON account.ACCOUNT_ID = premium.ACCOUNT_ID JOIN history ON account.ACCOUNT_ID = history.ACCOUNT_ID AND account.ACCOUNT_ID = ? ORDER BY HISTORY_ID DESC LIMIT 5",
//             [id],
//             (err, results, fields) => {
//                 if (err) {
//                     console.log(err);
//                     return res.status(400).send();
//                 }
//                 if (results.length === 0)
//                 {
//                     return res.status(400).json({status:"fail", message: "Error, Can't find this id in the database"});
//                 }
//                 return res.status(200).json({status:"success", message : "Get information successfully!", results: results})
//             }
//         )
//     }
//     catch(err) {
//         console.log(err);
//         return res.status(500).send();
//     }
// })

// //เปลี่ยนเลขบัตร
// app.patch("/change_method", async (req, res) => {
//     const {method,id} = req.body

//     try {
//         connection.query(
//             "UPDATE account JOIN premium SET premium.PAYMENT_METHOD = ? WHERE account.ACCOUNT_ID = premium.ACCOUNT_ID AND account.ACCOUNT_ID = ?",
//             [method,id],
//             (err, results, fields) => {
//                 if (err) {
//                     console.log(err);
//                     return res.status(400).send();
//                 }
//             }
//         )
//         return res.status(200).json({status:"success", message : "Change credit card number successfully!"})
//     }
//     catch(err) {
//         console.log(err);
//         return res.status(500).send();
//     }
// })

// //----------------------------Cancel Premium--------------------------------------//

// //for cancel premium overlay confirm = คำตอบของ Are you sure to cancel Premium? yes/no
// app.patch("/cancel_premium", async (req, res) => {
//     const {confirm,id} = req.body

//     try {
//         if (confirm == "yes") {
//             connection.query(
//                 "UPDATE premium JOIN account SET STATUS = 0 WHERE account.ACCOUNT_ID = premium.ACCOUNT_ID AND account.ACCOUNT_ID = ?",
//                 [id],
//                 (err, results, fields) => {
//                     if (err) {
//                         console.log(err);
//                         return res.status(400).send();
//                     }

//                     //ส่งเมลแจ้งว่ายกเลิกการสมัคร premium แล้ว
//                     connection.query(
//                         "SELECT ACCOUNT_EMAIL FROM account WHERE ACCOUNT_ID = ?",
//                         [id],
//                         (err, results, fields) => {
//                             if (err) {
//                                 console.log(err);
//                                 return res.status(400).send();
//                             }

//                         const text_sending = {
//                             from: 's6501012610033@email.kmutnb.ac.th',
//                             to: results[0].ACCOUNT_EMAIL,
//                             subject: 'Cancelation of Orange premium',
//                             text:"Dear User :\n\nSorry to see you've cancelled your Orange premium.\n\nIf you're having second thoughts, we'll welcome you back any time.\n\nRegards,\nOrange Team"
//                         };

//                         transporter.sendMail(text_sending, (err, info) => {
//                             if (err) {
//                                 console.log(err);
//                                 return res.status(400).send();
//                             }
//                         });
//                     })
//                 }
//             )
//             return res.status(200).json({status:"success", message : "Cancel premium successfully!"})
//         }
//         res.status(400).json({status:"fail", message : "Doesn't cancel premium yet"})
//     }
//     catch(err) {
//         console.log(err);
//         return res.status(500).send();
//     }
// })

// //----------------------------Outfit Recommendation--------------------------------------//

// // if ( place == "Work") {}
// // else if ( place == "Date night") {}
// // else if ( place == "Holiday Vacation") {}
// // else if ( place == "Beach") {}
// // else if ( place == "Picnic") {}
// //----------------------------See recommendation--------------------------------------//

// //for Outfit Recommendation
// app.get("/recommend", async (req, res) => {
//     const {id, theme, place} = req.body

//     try {
//         connection.query(
//             "SELECT * FROM account WHERE ACCOUNT_ID = ?",
//             [id],
//             (err, results, fields) => {
//                 if (err) {
//                     console.log(err);
//                     return res.status(400).send();
//                 }
//                 if (results.length === 0)
//                 {
//                     return res.status(400).json({status:"fail", message: "Error, Can't find this id in the database"});
//                 }
//                 const figure = results[0].FIGURE
//             }
//         )

//         connection.query(
//             "SELECT * FROM clothes",
//             [id],
//             (err, results, fields) => {
//                 if (err) {
//                     console.log(err);
//                     return res.status(400).send();
//                 }
//                 if (results.length === 0)
//                 {
//                     return res.status(400).json({status:"fail", message: "Error, Can't find any recommendation"});
//                 }

//                 var tag = 'none'
//                 if ( place == "Work") {}
//                 else if ( place == "Date night") {}
//                 else if ( place == "Holiday Vacation") {}
//                 else if ( place == "Beach") {}
//                 else if ( place == "Picnic") {}

//                 return res.status(200).json({status:"success", message : "Get information successfully!", results: results})
//             }
//         )
        
//     }
//     catch(err) {
//         console.log(err);
//         return res.status(500).send();
//     }
// })


// //----------------------------Ask Question and concern--------------------------------------//

// //for question and concern
// app.post("/concern", async (req, res) => {
//     const {text, id} = req.body

//     try {
//         //เก็บข้อความไว้ในฐานข้อมูล
//         connection.query(
//             "INSERT INTO concern(`ACCOUNT_ID`, `TEXT`) VALUES (?,?)",
//             [id,text],
//             (err, results, fields) => {
//                 if (err) {
//                     console.log(err);
//                     return res.status(400).send();
//                 }
//                 //ส่งอีเมลตอบกลับว่าได้รับข้อความแล้ว
//                 connection.query(
//                     "SELECT ACCOUNT_EMAIL FROM account WHERE ACCOUNT_ID = ?",
//                     [id],
//                     (err, results, fields) => {
//                         if (err) {
//                             console.log(err);
//                             return res.status(400).send();
//                         }

//                         const text_sending = {
//                             from: 's6501012610033@email.kmutnb.ac.th',
//                             to: results[0].ACCOUNT_EMAIL,
//                             subject: 'Thank you for your feedback to Orange',
//                             text:"Dear User :\n\nThank you for taking time to contact Orange to explain the issues you have encountered recently. We regret any inconvenience you have experienced, and we assure you that we are anxious to retain you as a satisfied customer.\n\nOur Customer Satisfaction Team is reviewing the information you sent us and conducting a full investigation in order to resolve this matter fairly.\n\nSincerely,\nOrange Team"
//                         };

//                         transporter.sendMail(text_sending, (err, info) => {
//                             if (err) {
//                                 console.log(err);
//                                 return res.status(400).send();
//                             }
//                             return res.status(200).json({status:"success", message : "Question and concern received successfully!"})
//                         });
//                     }
//                 )
//             }
//         )
        
//     }
//     catch(err) {
//         console.log(err);
//         return res.status(500).send();
//     }
// })

// //----------------------------ข้างล่างไม่ใช้มั้ง--------------------------------------//

// //ดึงข้อมูล account ทั้งหมด
// app.get("/read_account", async (req, res) =>{
//     try {
//         connection.query(
//             "SELECT * FROM account", //ดึงข้อมูล
//             (err, results, fields) => {
//                 if (err) {
//                     console.log(err);
//                     return res.status(400).send();
//                 }
//                 res.status(200).json(results)
//             })
//     }
//     catch(err) {
//         console.log(err);
//         return res.status(500).send();
//     }
// })

// //read single ดึงแค่ข้อมูล account ที่ต้องการ
// app.get("/read_account/single/:email", async (req, res) =>{
//     const email = req.params.email; //รับตัวแปร email
//     try {
//         connection.query(
//             "SELECT * FROM account WHERE ACCOUNT_EMAIL = ?", //ดึงข้อมูล
//             [email],
//             (err, results, fields) => {
//                 if (err) {
//                     console.log(err);
//                     return res.status(400).send();
//                 }
//                 res.status(200).json(results)
//             })
//     }
//     catch(err) {
//         console.log(err);
//         return res.status(500).send();
//     }
// })

// //DELETE ลบ account
// app.delete("/delete_account/:email", async (req, res) => {
//     const email = req.params.email;
//     try {
//         connection.query(
//             "DELETE FROM account WHERE ACCOUNT_EMAIL = ?", //ดึงข้อมูล
//             [email],
//             (err, results, fields) => {
//                 if (err) {
//                     console.log(err);
//                     return res.status(400).send();
//                 }
//                 if (results.affectedRow === 0) {
//                     return res.status(404).json({ message: "No account with that email"})
//                 }
//                 res.status(200).json({ message: "account deleted successfully!"})
//             })
//     }
//     catch(err) {
//         console.log(err);
//         return res.status(500).send();
//     }

// })

// //filter premium กรองเฉพาะแอคที่ใช้ premium อยู่
// app.get("/premium_account/:IS_PREMIUM", async (req, res) =>{
//     const IS_PREMIUM = req.params.IS_PREMIUM;
//     try {
//         connection.query(
//             "SELECT * FROM account WHERE IS_PREMIUM = ?", //ดึงข้อมูล
//             [IS_PREMIUM],
//             (err, results, fields) => {
//                 if (err) {
//                     console.log(err);
//                     return res.status(400).send();
//                 }
//                 res.status(200).json(results)
//             })
//     }
//     catch(err) {
//         console.log(err);
//         return res.status(500).send();
//     }
// })

// //join account and premium table กรองเฉพาะแอคที่สมัคร premium หรือเคยสมัคร
// app.get("/join_premium_account", async (req, res) =>{
//     try {
//         connection.query(
//             "SELECT * FROM account JOIN premium WHERE account.ACCOUNT_ID = premium.ACCOUNT_ID", //ดึงข้อมูล
//             (err, results, fields) => {
//                 if (err) {
//                     console.log(err);
//                     return res.status(400).send();
//                 }
//                 res.status(200).json(results)
//             })
//     }
//     catch(err) {
//         console.log(err);
//         return res.status(500).send();
//     }
// })

// //format next bill date ตั้งเวลา next bill date เป็น 28 วันถัดไปจากปัจจุบัน
// app.patch("/format_date", async (req, res) => {
//     try {
//         connection.query(
//             "UPDATE premium SET NEXT_BILL_DATE = DATE_ADD(CURRENT_DATE(), INTERVAL 28 DAY)", //ดึงข้อมูล
//             (err, results, fields) => {
//                 if (err) {
//                     console.log(err);
//                     return res.status(400).send();
//                 }
//                 res.status(200).json({message : "Account updated password successfully!"})
//             })
//     }
//     catch(err) {
//         console.log(err);
//         return res.status(500).send();
//     }

// })

// //มี account อยู่รึเปล่า
// app.get("/is_have_account/:email", async (req, res) =>{
//     const email = req.params.email; //รับตัวแปร email
//     try {
//         connection.query(
//             "SELECT * FROM account WHERE ACCOUNT_EMAIL = " + mysql.escape(email), //ดึงข้อมูลแบบระวังแฮคมั้ง
//             (err, results, fields) => {
//                 if (err) {
//                     console.log(err);
//                     return res.status(400).send();
//                 }
//                 if (results == '') {
//                         return res.status(404).json({message: "No account with this email"})
//                     }
//                 res.status(200).json(results)
//             })
//     }
//     catch(err) {
//         console.log(err);
//         return res.status(500).send();
//     }
// })

// //UPDATE data เปลี่ยน password
// app.patch("/update_account/:email", async (req, res) => {
//     const email = req.params.email
//     const newPassword = req.body.newPassword;
//     try {
//         connection.query(
//             "UPDATE account SET ACCOUNT_PASSWORD = ? WHERE ACCOUNT_EMAIL = ?", //ดึงข้อมูล
//             [newPassword, email],
//             (err, results, fields) => {
//                 if (err) {
//                     console.log(err);
//                     return res.status(400).send();
//                 }
//                 res.status(200).json({message : "Account updated password successfully!"})
//             })
//     }
//     catch(err) {
//         console.log(err);
//         return res.status(500).send();
//     }

// })

// //เพิ่ม account ใหม่
// app.post("/create_account", async (req, res) => {
//     const {email, password} = req.body

//     try {
//         connection.query(
//             "INSERT INTO account(ACCOUNT_EMAIL, ACCOUNT_PASSWORD) VALUES(?, ?)", //insert ข้อมูล
//             [email, password], //แทน ?
//             (err, results, fields) => {
//                 if (err) {
//                     console.log("Error while inserting a user into the database", err);
//                     return res.status(400).send();
//                 }
//                 return res.status(201).json({message: "New user successfully created!"});
//             }
//         )
//     }
//     catch(err) {
//         console.log(err);
//         return res.status(500).send();
//     }
// })	

// app.listen(3360, results['Wi-Fi'][0], () => console.log('Server is running on port', results['Wi-Fi'][0],':3360'));