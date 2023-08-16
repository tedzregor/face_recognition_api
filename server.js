const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

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

app.get('/users', (req, res) => {
    fcdb.select('*').from('users')
    .then(users => {
        res.json(users);
    })
    .catch(err => {
        res.status(400).json('unable to get users');
    })
})

app.post('/signin', (req, res) => {
    fcdb.select('email', 'hash')
    .from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if(isValid) {
            return fcdb.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => res.status(400).json('unable to get user'))
        } else {
            res.status(400).json('wrong credentials')
        }
    })
    .catch(err => res.status(400).json('wrong credentials'))
})

app.post('/register', (req, res) => {
    const { email, name , password } = req.body;
    var hash = bcrypt.hashSync(password);
    
    // We can use the KNEX.JS TRANSACTION(TRX) to insert value to table login
    // and register.('returning' Doesnt Work on mysql and will just ignore it as documentation says. only postgresql support it)

    fcdb.insert({
        name: name,
        email: email,
        joined: new Date(),
        stamp: `Created at ${new Date()}`
    }, 'name')
    .into('users')
    .then(data => {
        fcdb.insert({
            email: email,
            hash: hash
        })
        .into('login')
        .then(response => {
            fcdb.select('*').from('users').orderBy('id', 'desc').limit(1)
            .then(user => {
                res.json(user[0]);
            })
            .catch(err => res.status(err).json(err))
        })
    })
    .catch(err => {
        res.status(400).json(err);
    })
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    fcdb.select('*').from('users').where({id: id  }).then(user => {
        if(user.length) {
            res.json(user[0])
        } else {
            res.status(400).json('User Not Found')
        }
    })
    .catch(err => res.status(400).json(`error getting user ${err}`))
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    //instead of .update({entries : entries + 1}) we will use increment to increase entries number
    fcdb('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .then(data => {
        fcdb.select('entries').from('users').where('id', '=', id).limit(1)
        .then(entries => {
            res.json(entries[0].entries)
        })
        .catch(err => res.status(400).json(err))
    })
    .catch(err => res.status(400).json(`unable to get entries ${err}`))
})

app.listen(3001, () => {
    console.log('app is running on port 3001');
})