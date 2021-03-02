const express = require('express');
const { User } = require("../models/User")

class UserController {

    create(req, res, next) {
        const user = new User(req.body);
        user.save(function (err, user) {
            if (err) return cres.send(err);
            res.send("saved " + user.name);
        })
        // res.send("KK")
    }

    show(req, res, next) {
        User.find(function (err, users) {
            if (err) return res.send(err);
            res.send(users);
        })
    }
}

module.exports = { UserController };