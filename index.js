require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql2')
const { v4: uuidv4 } = require('uuid')
const app = express()
const port = process.env.APP_PORT

app.use(bodyParser.json())

app.listen(port, () => {
  console.log(`App is listening on port: ${port}`)
})

const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME
})
connection.connect()


app.post('/Addings',(req,res)=>{
    const{firstname,othernames,email,gender,dob} = req.body

     if (!firstname || !othernames || !email || !gender || !dob) {
        
        res.status(400).json({
            status:false,
            message: "All fields required"
        })
    }
    try {
        connection.query(
            `SELECT * FROM customers WHERE email = '${email}'`,
            (err, results, fields)=> {
              if (err) {
                console.log(`Here's The ${err}`)
                throw new Error ('An Error Occured')
              }
              if(results > 0){
                console.log(`Here For The Results:-> ${results}`)
                throw new Error ('A User With Email or Password Already Exists')
              }

              connection.query(`INSERT INTO customers (customer_id, firstname, othernames, email, gender, dob) VALUES ('${uuidv4()}','${firstname}', '${othernames}', '${email}', '${gender}', '${dob}')`),
                (error, results, fields) => { 
    
                    if (error) {
                        console.log("here2: " , error)
                        throw new Error ("Bad Requesttttt")
                    }

                    res.status(201).json( { message: 'Appointment Secured', data: results } )  
                }
            }
        )
    } catch (error) {
        console.log("i got here", error)
        res.status(400).send({
            status:false,
            message: error.message
        })   
    }
   

})