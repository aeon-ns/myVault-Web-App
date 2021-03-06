var express = require('express');
var bodyParser = require('body-parser');
var Verify = require('./verify');
var Notes = require('../models/note');

var NoteRouter = express.Router();
NoteRouter.use(bodyParser.json());

NoteRouter.route('/')
	.get(Verify.verifyOrdinaryUser, function(req, res, next) {
		req.query.forUser = req.decoded._id;
		Notes.find(req.query, function(err, notes) {
			if (err) return next(err);
			res.json({
				success: true,
				message: 'Notes retrieved successfully.',
				data: notes
			});
		});
	})
	.post(Verify.verifyOrdinaryUser, function(req, res, next) {
		req.body.forUser = req.decoded._id;
		Notes.create(req.body, function(err, note) {
			if (err) return next(err);
			res.json({
				success: true,
				message: 'Note saved successfully.',
				data: note
			});
		});
	})
	.delete(Verify.verifyOrdinaryUser, function(req, res, next) {
		Notes.remove({ forUser: req.decoded._id }, function(err, status) {
			if (err) return next(err);
			res.json({
				success: true,
				message: 'Removed notes succesfully.',
				data: status
			});
		});
	});

NoteRouter.route('/:id')
	.put(Verify.verifyOrdinaryUser, function(req, res, next) {
		if (!req.params || req.params && !req.params.id) {
			let err = new Error('Bad Request.');
			err.status = 400;
			return next(err);
		}
		Notes.findById(req.params.id, function(err, note) {
			if (err) return next(err);
			if (note.forUser != req.decoded._id) {
				err.message = 'Unauthorized Access!';
				err.status = 401;
				return next(err);
			}
			if (req.body.title) {
				note.title = req.body.title;
				note.note = req.body.note;
				note.account = req.body.account;
			}
			note.pinned = req.body.pinned;
			note.save(function(err, new_note) {
				if (err) return next(err);
				res.json({
					success: true,
					message: 'Note successfully updated.',
					data: new_note
				});
			});
		});
	})
	.delete(Verify.verifyOrdinaryUser, function(req, res, next) {
		Notes.findByIdAndRemove(req.params.id, function(err, status) {
			if (err) return next(err);
			res.json({
				success: true,
				message: 'Removed note succesfully.',
				data: status
			});
		});
	});
module.exports = NoteRouter;
