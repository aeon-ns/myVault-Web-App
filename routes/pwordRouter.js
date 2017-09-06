var express = require('express');
var bodyParser = require('body-parser');

var Verify = require('./verify');
var Pwords = require('../models/pword');

var config = require('../config.js');

var CryptoJS = require('crypto-js');

var PwordRouter = express.Router();
PwordRouter.use(bodyParser.json());

PwordRouter.route('/')

    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        req.query.forUser = req.decoded._id;
        Pwords.find(req.query, function (err, pwords) {
            if (err) return next(err);
            //Decrypt
            for (var i = 0; i < pwords.length; i++) {
                var bytes = CryptoJS.AES.decrypt(pwords[i].password, config.SECRET_KEY);
                pwords[i].password = bytes.toString(CryptoJS.enc.Utf8);
                if (pwords[i].hasCustom) {
                    for (var j = 0; j < pwords[i].customFields.length; j++) {
                        var bytes = CryptoJS.AES.decrypt(pwords[i].customFields[j].value, config.SECRET_KEY);
                        pwords[i].customFields[j].value = bytes.toString(CryptoJS.enc.Utf8);
                    }
                }
            }
            //Send Decrypted Data to client
            res.json(pwords);
        });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        req.body.forUser = req.decoded._id;

        //Encrypt
        var hash = CryptoJS.AES.encrypt(req.body.password, config.SECRET_KEY);
        req.body.password = hash.toString();

        if (req.body.hasCustom) {
            for (var j = 0; j < req.body.customFields.length; j++) {
                hash = CryptoJS.AES.encrypt(req.body.customFields[j].value, config.SECRET_KEY);
                req.body.customFields[j].value = hash.toString();
            }
        }
        //Save
        Pwords.create(req.body, function (err, pword) {
            if (err) return next(err);
            res.json({ status: true });
        });
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Pwords.remove({ forUser: req.decoded._id }, function (err, status) {
            if (err) return next(err);
            res.json(status);
        });
    });

PwordRouter.route('/:id')

    .put(Verify.verifyOrdinaryUser, function (req, res, next) {
        Pwords.findById(req.params.id, function (err, pword) {
            if (err) return next(err);
            if (pword.forUser != req.decoded._id) {
                err.message = "Unauthorized Access!";
                err.status = 401;
                return next(err);
            }
            if (req.body.title) {
                pword.title = req.body.title;
                pword.username = req.body.username;
                pword.account = req.body.account;
                pword.hasCustom = req.body.hasCustom;
                //Encrypt
                var hash = CryptoJS.AES.encrypt(req.body.password, config.SECRET_KEY);
                req.body.password = hash.toString();

                if (req.body.hasCustom) {
                    for (var j = 0; j < req.body.customFields.length; j++) {
                        hash = CryptoJS.AES.encrypt(req.body.customFields[j].value, config.SECRET_KEY);
                        req.body.customFields[j].value = hash.toString();
                    }
                }
                pword.password = req.body.password;
                pword.customFields = req.body.customFields;
            }
            pword.pinned = req.body.pinned;
            pword.save(function (err, new_pword) {
                if (err) return next(err);
                res.json(new_pword);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Pwords.findByIdAndRemove(req.params.id, function (err, status) {
            if (err) return next(err);
            res.json(status);
        });
    });

module.exports = PwordRouter;

