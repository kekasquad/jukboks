const express = require('express');
const { User } = require("../models/User")
const { HttpError } = require("../error");

class UserController {
    constructor() {
        this.publicFields = {
            _id: false,
            username: true,
            name: true,
            streams: true
        }
    }

    async create(req, res) {
        const user = new User(req.body);
        await user.save();
        res.json({ created: true });
    }

    async get(req, res) {
        const persons = await User.find({}, this.publicFields);
        if (!persons) {
            return res.status(404).end();
        }
        res.json(persons);
    }

    async getByUsername(req, res, next) {
        const username = req.params.username;
        const person = await User.findOne({ username }, this.publicFields);
        if (!person) {
            // TODO: catch from async functions
            return next(new HttpError(404, "User not found"));
        }
        res.json(person);
    }
}

module.exports = { UserController };