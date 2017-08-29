var express = require('express');
var bodyParser = require('body-parser');

var Verify = require('./verify');
var Pwords = require('../models/pword');

var PwordRouter = express.Router();
PwordRouter.use(bodyParser.json());

PwordRouter.route('/')

    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        req.query.forUser = req.decoded._id;
        Pwords.find(req.query, function (err, pwords) {
            if (err) return next(err);
            res.json(pwords);
        });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        req.body.forUser = req.decoded._id;
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
            if (pword.forUser!= req.decoded._id) {
                err.message = "Unauthorized Access!";
                err.status = 401;
                return next(err);
            }
            if(req.body.title){
                pword.title = req.body.title;
                pword.username = req.body.username;
                pword.password = req.body.password;
                pword.account = req.body.account;
                pword.hasCustom = req.body.hasCustom;
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

