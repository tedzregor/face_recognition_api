const handleRegister = (req, res, fcdb, bcrypt) => {
    const { email, name , password } = req.body;
    if(!email || !name || !password) { //Validation for empty field
        return res.status(400).json('incorrect form submission');
    }
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
}

module.exports = {
    handleRegister: handleRegister
}