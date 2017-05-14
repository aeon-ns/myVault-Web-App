var express = require('express');
var bodyParser = require('body-parser');

var Verify = require('./verify');
var Cards = require('../models/card');

var CardRouter = express.Router();
CardRouter.use(bodyParser.json());

CardRouter.route('/')

    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        req.query.forUser = req.decoded._id;
        Cards.find(req.query, function (err, card) {
            if (err) return next(err);
            res.json(card);
        });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        req.body.forUser = req.decoded._id;
        Cards.create(req.body, function (err, card) {
            if (err) return next(err);
            res.json({ status: true });
        });
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Cards.remove({ forUser: req.decoded._id }, function (err, status) {
            if (err) return next(err);
            res.json(status);
        });
    });

CardRouter.route('/:id')

    .put(Verify.verifyOrdinaryUser, function (req, res, next) {
        Cards.findOne({ forUser: req.decoded._id, _id: req.params.id }, function (err, card) {
            if (err) return next(err);
            card = req.body;
            card.save(function (err, new_card) {
                if (err) return next(err);
                res.json(new_card);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Cards.findOneAndRemove({ forUser: req.decoded._id, _id: req.params.id }, function (err, status) {
            if (err) return next(err);
            res.json(status);
        });
    });

module.exports = CardRouter;

