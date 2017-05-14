var express = require('express');
var bodyParser = require('body-parser');

var Verify = require('./verify');
var GridCards = require('../models/grid');

var GridCardRouter = express.Router();
GridCardRouter.use(bodyParser.json());

GridCardRouter.route('/')

    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        req.query.forUser = req.decoded._id;
        GridCards.find(req.query, function (err, grid) {
            if (err) return next(err);
            res.json(grid);
        });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        req.body.forUser = req.decoded._id;
        GridCards.create(req.body, function (err, grid) {
            if (err) return next(err);
            res.json({ status: true });
        });
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        GridCards.remove({ forUser: req.decoded._id }, function (err, status) {
            if (err) return next(err);
            res.json(status);
        });
    });

GridCardRouter.route('/:id')

    .put(Verify.verifyOrdinaryUser, function (req, res, next) {
        GridCards.findOne({ forUser: req.decoded._id, _id: req.params.id }, function (err, grid) {
            if (err) return next(err);
            grid = req.body;
            grid.save(function (err, new_card) {
                if (err) return next(err);
                res.json(new_card);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        GridCards.findOneAndRemove({ forUser: req.decoded._id, _id: req.params.id }, function (err, status) {
            if (err) return next(err);
            res.json(status);
        });
    });

module.exports = GridCardRouter;

