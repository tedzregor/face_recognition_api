const handleProfileGet = (req, res, fcdb) => {
    const { id } = req.params;
    console.log( id );
    fcdb.select('*').from('users').where({id: id  }).then(user => {
        console.log(user);
        if(user.length) {
            res.json(user[0])
        } else {
            res.status(400).json('User Not Found')
        }
    })
    .catch(err => res.status(400).json(`error getting user ${err}`))
}

module.exports = {
    handleProfileGet : handleProfileGet
}