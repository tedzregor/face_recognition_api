const handleGetAllUser = (req, res, fcdb) =>  {
    fcdb.select('*').from('users')
    .then(users => {
        res.json(users);
    })
    .catch(err => {
        res.status(400).json('unable to get users');
    })
}

module.exports = {
    handleGetAllUser : handleGetAllUser
}