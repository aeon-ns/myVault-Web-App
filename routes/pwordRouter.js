const express = require('express');
const bodyParser = require('body-parser');
const Verify = require('./verify');
const Pwords = require('../models/pword');
const config = require('../config.js');
const CryptoJS = require('crypto-js');

/* INTERNAL FUNCTIONS */
function _encrypt(string) {
	return CryptoJS.AES.encrypt(string, config.SECRET_KEY)
		.toString();
}
function _decrypt(hashValue) {
	return CryptoJS.AES.decrypt(
		hashValue,
		config.SECRET_KEY
	).toString(
		CryptoJS.enc.Utf8
	);
}
function _encryptPword(pword) {
	pword.password = _encrypt(pword.password);
	if (pword.hasCustom) {
		pword.customFields.forEach(customField => customField.value = _encrypt(customField.value));
	}
	return pword;
}
function _decryptPword(pword) {
	pword.password = _decrypt(pword.password);
	if (pword.hasCustom) {
		pword.customFields.forEach(customField => customField.value = _decrypt(customField.value));
	}
	return pword;
}

/* ROUTES */
const PwordRouter = express.Router();
PwordRouter.use(bodyParser.json());

PwordRouter.route('/')

	.get(Verify.verifyOrdinaryUser, async function (req, res, next) {
		try {
			req.query.forUser = req.decoded._id;
			let pwords = await Pwords.find(req.query);
			await pwords.forEach(pword => _decryptPword(pword));
			return res.status(200).json({
				success: true,
				message: 'Passwords retrieved successfully.',
				data: pwords
			});
		}
		catch (err) {
			return next(err);
		}
	})

	.post(Verify.verifyOrdinaryUser, async function (req, res, next) {
		try {
			if (!req.body.password) {
				return res.status(400).json({
					success: false,
					message: 'Bad Request. Password is required.'
				});
			}
			req.body.forUser = req.decoded._id;
			req.body = await _encryptPword(req.body);
			let pword = await Pwords.create(req.body);
			return res.status(200).json({
				success: true,
				message: 'Password saved successfully.',
				data: pword
			});
		}
		catch (err) {
			return next(err);
		}
	})

	.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
		Pwords.remove({ forUser: req.decoded._id }, function (err, status) {
			if (err) return next(err);
			res.json({
				success: true,
				message: 'Passwords removed successfully.',
				data: status
			});
		});
	});

PwordRouter.route('/:id')

	.put(Verify.verifyOrdinaryUser, function (req, res, next) {
		if (!req.params.id) {
			return res.status(400).json({
				success: false,
				message: 'Bad Request. Id is required.'
			});
		}
		Pwords.findById(req.params.id, function (err, pword) {
			if (err) return next(err);
			if (pword.forUser != req.decoded._id) {
				err.message = 'Unauthorized Access!';
				err.status = 401;
				return next(err);
			}
			if (req.body.title) {
				pword.title = req.body.title;
				pword.username = req.body.username;
				pword.account = req.body.account;
				pword.hasCustom = req.body.hasCustom;
				//Encrypt
				var hash = CryptoJS.AES.encrypt(
					req.body.password,
					config.SECRET_KEY
				);
				req.body.password = hash.toString();

				if (req.body.hasCustom) {
					for (var j = 0; j < req.body.customFields.length; j++) {
						hash = CryptoJS.AES.encrypt(
							req.body.customFields[j].value,
							config.SECRET_KEY
						);
						req.body.customFields[j].value = hash.toString();
					}
				}
				pword.password = req.body.password;
				pword.customFields = req.body.customFields;
			}
			pword.pinned = req.body.pinned;
			pword.save(function (err, new_pword) {
				if (err) return next(err);
				res.status(200).json({
					success: true,
					message: 'Password updated successfully.',
					data: new_pword
				});
			});
		});
	})

	.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
		Pwords.findByIdAndRemove(req.params.id, function (err, status) {
			if (err) return next(err);
			res.json({
				success: true,
				message: 'Password removed successfully.',
				data: status
			});
		});
	});

module.exports = PwordRouter;
