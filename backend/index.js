require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const nodemailer = require('nodemailer')


const app = express()
app.use(cors())
app.use(express.json())


const PORT = process.env.PORT || 4000
const DB_FILE = path.join(__dirname,'storage','emails.json')


function readDB(){
try
