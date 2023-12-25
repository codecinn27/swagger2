const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require('swagger-jsdoc');
const {User} = require('./model/user');

//must be on top, before all route
app.use(express.json());

mongoose.connect('mongodb+srv://codecinnpro:9qLtJIAG9k8G1Pe8@cluster0.egrjwh1.mongodb.net/vms_2?retryWrites=true&w=majority')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open",()=>{
    console.log("Database connected");
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/haha', (req, res) => {
    res.send('hahahahahahahahahahahaahahahaha')
  })

const options = {
    definition:{
        openapi: "3.0.3",
        info:{
            title: "Visitor Management System BERR G6",
            version: "0.1",
            description:"Visitor Management System with admin, host, visitors. A system to issue visitors pass and store the record into the cloud database, Mongodb Atlas.",
            contact:{
                name: "Hee Yee Cinn",
                url:"cinn.com",
                email:"b022110115@student.utem.edu.my"
            },

        },
        tags:[
            {name:'Login', description:"Default endpoints"},
            {name: 'Admin', description:"Admin operation"},
            {name: 'Host', description:"Host operation"},
        ],
        components:{
            securitySchemes:{
                Authorization:{
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    value: "Bearer <JWT token here>",
                    description: "This is for authentication, you must logout to change the JWT token"
                }
            }
        },
        servers: [
            {
                url:"http://localhost:3000/"
                // url:"https://swaggerg6.azurewebsites.net/"
            }
        ],
    },
    //all the route.js file store inside the route file 
    apis:["./index.js"],
};

const spacs = swaggerJSDoc(options);
app.use("/g6", swaggerUi.serve, swaggerUi.setup(spacs));

/**
* @swagger
* components:
*   schemas:
*     Visit:
*       type: object
*       required:
*         - purposeOfVisit
*         - phoneNumber
*       properties:
*         purposeOfVisit:
*           type: string
*           description: The purpose of the visit
*         phoneNumber:
*           type: number
*           description: The phone number of the visitor
*         visitTime:
*           type: string
*           format: date-time
*           description: The time of the visit
*       example:
*         purposeOfVisit: Meeting
*         phoneNumber: 1234567890
*
*     Visitor:
*       type: object
*       required:
*         - name
*       properties:
*         name:
*           type: string
*           description: The name of the visitor
*         visits:
*           type: array
*           items:
*             $ref: '#/components/schemas/Visit'
*       example:
*         name: John Doe
*         visits:
*           - purposeOfVisit: Meeting
*             phoneNumber: 1234567890
*             visitTime: '2023-01-01T12:00:00Z'
*
*     User:
*       type: object
*       required:
*         - username
*         - password
*         - email
*         - phoneNumber
*         - category
*       properties:
*         username:
*           type: string
*           description: The username of the user
*         password:
*           type: string
*           description: The password of the user
*         email:
*           type: string
*           format: email
*           description: The email address of the user
*         phoneNumber:
*           type: number
*           description: The phone number of the user
*         category:
*           type: string
*           enum:
*             - host
*             - admin
*           description: The category of the user (host or admin)
*         visitors:
*           type: array
*           items:
*             $ref: '#/components/schemas/Visitor'
*       example:
*         username: user123
*         password: password123
*         email: user@exa\mple.com
*         phoneNumber: 1234567890
*         category: host
*         visitors:
*           - name: John Doe
*             visits:
*               - purposeOfVisit: Meeting
*                 phoneNumber: 1234567890
*                 visitTime: '2023-01-01T12:00:00Z'
*/


// must be placed below after all route
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});