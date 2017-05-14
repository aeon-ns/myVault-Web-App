var express = require('express');
var bodyParser = require('body-parser');

var Verify = require('./verify');
var Notes = require('../models/note');

var NoteRouter = express.Router();
NoteRouter.use(bodyParser.json());

NoteRouter.route('/')

    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        req.query.forUser = req.decoded._id;
        Notes.find(req.query, function (err, notes) {
            if (err) return next(err);
            res.json(notes);
        });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        req.body.forUser = req.decoded._id;
        Notes.create(req.body, function (err, note) {
            if (err) return next(err);
            res.json({status: true});
        });
    })

    .delete(Verify.verifyOrdinaryUser, function(req, res, next) {
        Notes.remove({ forUser: req.decoded._id}, function(err, status){
            if(err) return next(err);
            res.json(status);
        });
    });

NoteRouter.route('/:id')

    .put(Verify.verifyOrdinaryUser, function(req, res, next){
        Notes.findOne({forUser: req.decoded._id, _id: req.params.id}, function(err, note){
            if(err) return next(err);
            note = req.body;
            note.save(function(err, new_note){
                if (err) return next(err);
                res.json(new_note);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, function(req, res, next){
        Notes.findOneAndRemove({forUser: req.decoded._id, _id: req.params.id}, function(err, status){
            if (err) return next(err);
            res.json(status);
        });
    });

module.exports = NoteRouter;

