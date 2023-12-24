const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require('swagger-jsdoc');

//must be on top, before all route
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/haha', (req, res) => {
    res.send('hahahahahahahahahahahaahahahaha')
  })
  

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})