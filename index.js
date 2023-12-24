const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require('swagger-jsdoc');
const loginController = require('./controllers/login');
const {User} = require('./model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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

/**
* @swagger
* /login:
*  post:
*    tags: 
*        - Login
*    summary: Login for admin or host
*    description: Once login authenticate a user and generate a JWT token 
*    requestBody:
*       required: true
*       content: 
*          application/json:
*              schema:
*                  type: object
*                  properties:
*                      username:
*                          type: string
*                      password:
*                          type: string
*    responses:
*      200:   
*          description: Successful login
*          schema: 
*              type: object    
*              properties:
*                  token: 
*                      type: string
*                      description: JWT token for authentication
*                  category: 
*                      type: string
*                      description: User category (host or admin)
*                  redirectLink:
*                      type: string
*                      description: Redirect link based on user category
*                  GET:
*                      type: string
*                      description: URL to be used for redirection
*                  Authorization:
*                      type: string
*                      description: JWT token for authorization
*                  Content-Type: 
*                      type: string
*                      description: Response content type
*      401:
*          description: Invalid credentials
*          schema: 
*              type: object
*              properties:
*                  error:  
*                      type: string
*                      description: Error message
*                      example: Invalid credentials
 *      500: 
*          description: Internal Server Error
*          schema: 
*              type: object
*              properties: 
*                  error:
*                      type: string
*                      description: Error message
*                      example: Internal Server Error
*              
*/

app.post('/login',async(req, res) =>{
    try {
      // Implement your login logic (e.g., validate credentials against the database)
      const { username, password } = req.body;
      const user = await User.findOne({username});
  
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Compare the provided password with the hashed password using bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
          return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ userId: user._id, category: user.category }, 'vms2', {
        expiresIn: '1h',
      });
  
      // Check the user's category and generate the appropriate link
      let redirectLink;
      if (user.category === 'host') {
          redirectLink = `/host/${user._id}`;
      } else if (user.category === 'admin') {
          redirectLink = `/admin`;
      }
  
  
      console.log("JWT:",token);
      res.json({
          token,
          category: user.category,
          redirectLink,
          "GET": `http://localhost:3000${redirectLink}`,
          Authorization: token,
          "Content-Type": "application/json",
        });
        
        
    } catch (error) {
      console.error('Error during login:', error);
        // Log additional information about the error
      console.error('Error Stack:', error.stack);
      // Handle different types of errors
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: 'Invalid input data' });
      } else {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
});

// must be placed below after all route
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})