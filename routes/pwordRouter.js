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
	return CryptoJS.AES.decrypt(hashValue, config.SECRET_KEY)
		.toString(CryptoJS.enc.Utf8);
}
function _encryptPword(pword) {
	pword.password = _encrypt(pword.password);
	if (pword.customFields && pword.customFields.length) {
		pword.customFields.forEach(customField => customField.value = _encrypt(customField.value));
	}
	return pword;
}
function _decryptPword(pword) {
	pword.password = _decrypt(pword.password);
	if (pword.customFields && pword.customFields.length) {
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
				data: _decryptPword(pword)
			});
		}
		catch (err) {
			return next(err);
		}
	})

	.delete(Verify.verifyOrdinaryUser, async function (req, res, next) {
		try {
			await Pwords.remove({ forUser: req.decoded._id });
			res.status(200).json({
				success: true,
				message: 'Passwords removed successfully.'
			});
		}
		catch (err) {
			return next(err);
		}
	});

PwordRouter.route('/:id')

	.put(Verify.verifyOrdinaryUser, async function (req, res, next) {
		try {
			if (!req.params.id) {
				return res.status(400).json({
					success: false,
					message: 'Bad Request. Id is required.'
				});
			}
			if (!req.body) {
				return res.status(400).json({
					success: false,
					message: 'Bad Request. Body is required.'
				});
			}
			await _encryptPword(req.body);
			let pword = await Pwords.findOneAndUpdate({
				forUser: req.decoded._id,
				_id: req.params.id
			}, req.body, { new: true });
			res.status(200).json({
				success: true,
				message: 'Password updated successfully.',
				data: _decryptPword(pword)
			});
		}
		catch (err) {
			return next(err);
		}
	})

	.delete(Verify.verifyOrdinaryUser, async function (req, res, next) {
		try {
			if (!req.params || req.params && !req.params.id) {
				return res.status(400).json({
					success: false,
					message: 'Bad Request. Id is required'
				});
			}
			await Pwords.findByIdAndRemove(req.params.id);
			res.status(200).json({
				success: true,
				message: 'Password removed successfully.'
			});
		}
		catch (err) {
			return next(err);
		}
	});

module.exports = PwordRouter;
