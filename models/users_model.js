const mongoose = require('mongoose');

const usersSc = mongoose.Schema({
    role: {type: String, default:'publisher', enum: ['admin' , 'publisher']},
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    phone: {type: String, required: true},
    category: {type: String, required: true},
    address: {type: String, default: ''}
})

const User = mongoose.model('users', usersSc);

module.exports = {User}