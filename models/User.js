require('dotenv').config()
const mongoose = require('mongoose')
const { Schema, model } = mongoose
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'You must supply a user name'],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'You supply an email address'],
        trim: true,
        unique: [true, 'Email address is already being used']
    },
    password: {
        type: String,
        required: [true, 'You must set a password']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
      }
})

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)
})

UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
};

UserSchema.methods.matchPassword = async function (pw) {
    return await bcrypt.compare(pw, this.password);
};

const User = model('User', UserSchema)

module.exports = User