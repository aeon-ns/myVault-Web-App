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
        Pwords.findOne({ forUser: req.decoded._id, _id: req.params.id }, function (err, pword) {
            if (err) return next(err);
            pword = req.body;
            pword.save(function (err, new_pword) {
                if (err) return next(err);
                res.json(new_pword);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Pwords.findOneAndRemove({ forUser: req.decoded._id, _id: req.params.id }, function (err, status) {
            if (err) return next(err);
            res.json(status);
        });
    });

module.exports = PwordRouter;

