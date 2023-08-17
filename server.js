const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const users = require('./controllers/users');

const fcdb = knex ({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      port : 3306,
      user : 'ted',
      password : '061281Tedz!',
      database : 'face_recognition'
    }
});

const app = express();

app.use(bodyParser.json()); //middleware
app.use(cors());

app.get('/', (req, res) => {
    res.send('Server is up.');
})
                                                        // dependency injection
app.post('/signin', (req, res) => { signin.handleSignin(req, res, fcdb, bcrypt) })
app.post('/register', (req, res) => { register.handleRegister(req, res, fcdb, bcrypt)}) 
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, fcdb)})
app.put('/image', (req, res) => {image.handleImage(req, res, fcdb)})
app.post('/image/ClarifaiCall', (req, res) => {image.handleClarifaiCall(req, res)})
app.get('/users', (req, res) => { users.handleGetAllUser(req, res, fcdb) })

app.listen(3001, () => {
    console.log('app is running on port 3001');
})