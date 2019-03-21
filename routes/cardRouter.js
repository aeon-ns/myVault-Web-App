var express = require('express');
var bodyParser = require('body-parser');

var Verify = require('./verify');
var Cards = require('../models/card');

var CardRouter = express.Router();
CardRouter.use(bodyParser.json());

CardRouter.route('/')

	.get(Verify.verifyOrdinaryUser, function(req, res, next) {
		req.query.forUser = req.decoded._id;
		Cards.find(req.query, function(err, cards) {
			if (err) return next(err);
			res.json({
				success: true,
				message: 'Cards retrieved successfully.',
				data: cards
			});
		});
	})

	.post(Verify.verifyOrdinaryUser, function(req, res, next) {
		req.body.forUser = req.decoded._id;
		Cards.create(req.body, function(err, card) {
			if (err) return next(err);
			res.json({
				success: true,
				message: 'Card saved successfully.',
				data: card
			});
		});
	})

	.delete(Verify.verifyOrdinaryUser, function(req, res, next) {
		Cards.remove({ forUser: req.decoded._id }, function(err, status) {
			if (err) return next(err);
			res.json({
				success: true,
				message: 'Cards removed successfully.',
				data: status
			});
		});
	});

CardRouter.route('/:id')

	.put(Verify.verifyOrdinaryUser, function(req, res, next) {
		Cards.findById(req.params.id, function(err, card) {
			if (err) return next(err);
			if (card.forUser != req.decoded._id) {
				err.message = 'Unauthorized Access!';
				err.status = 401;
				return next(err);
			}
			if (req.body.title) {
				(card.title = req.body.title),
					(card.cardNo = req.body.cardNo),
					(card.exp = req.body.exp),
					(card.cvv = req.body.cvv),
					(card.account = req.body.account),
					(card.hasCustom = req.body.hasCustom),
					(card.customFields = req.body.customFields);
			}
			card.pinned = req.body.pinned;
			card.save(function(err, new_card) {
				if (err) return next(err);
				res.json({
					success: true,
					message: 'Card updated successfully.',
					data: new_card
				});
			});
		});
	})

	.delete(Verify.verifyOrdinaryUser, function(req, res, next) {
		Cards.findByIdAndRemove(req.params.id, function(err, status) {
			if (err) return next(err);
			res.json({
				success: true,
				message: 'Card removed successfully.',
				data: status
			});
		});
	});

module.exports = CardRouter;
