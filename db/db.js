const mongoose = require('mongoose')

function db(){
    mongoose.connect('mongodb://localhost:27017/node', {useNewUrlParser: true, useUnifiedTopology: true});

    mongoose.connection.once('open' , () => {
        console.log('connected to db');
    })

}

module.exports = {db}