var express = require('express');
var passport = require('passport');
var router = express.Router();
var User = require('../models/user');
var Verify = require('./verify');

/* GET users listing. */
router.get('/', function(req, res, next) {
	//Send list of users only for admin**
	res.send('respond with a resource');
});

router.post('/register', function(req, res, next) {
	//Register user with credentials inside the Request body
	User.register(
		new User({
			username: req.body.username
		}),
		req.body.password,
		function(err, user) {
			if (err) {
				console.log(err.message);
				console.log(err);
				return res.status(400).json({
					success: false,
					message: err.message
				});
			}
			if (req.body.firstname) {
				user.firstname = req.body.firstname;
			}
			if (req.body.lastname) {
				user.lastname = req.body.lastname;
			}
			user.save(function(err, user) {
				if (err) return next(err);
				passport.authenticate('local')(req, res, function() {
					return res.status(200).json({
						success: true,
						message: 'Registration Successful!'
					});
				});
			});
		}
	);
});

router.post('/signin', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.status(401).json({
				success: false,
				message: 'Username or Password provided is invalid.'
			});
		}
		req.logIn(user, function(err) {
			if (err) {
				return res.status(500).json({
					success: false,
					message: 'Something went wrong!'
				});
			}
			var token = Verify.getToken({
				username: user.username,
				_id: user._id
			});
			//ClientServer Integration
			res.status(200).json({
				success: true,
				message: 'Login Successful!',
				data: { token }
			});
		});
	})(req, res, next);
});

router.get('/signout', function(req, res, next) {
	//Sign Out User
	req.logout();
	res.status(200).json({
		success: true,
		message: 'Logged out successfully! Please come again :)'
	});
});

router.get('/facebook', passport.authenticate('facebook'), function(
	req,
	res
) {});

router.get('/facebook/callback', function(req, res, next) {
	passport.authenticate('facebook', function(err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.status(401).json({ success: false, message: info });
		}
		req.logIn(user, function(err) {
			if (err) {
				return res
					.status(400)
					.json({ success: false, message: 'Could not login user!' });
			}
			var token = Verify.getToken({
				username: user.username,
				_id: user._id
			});
			res.status(200).json({
				success: true,
				message: 'Login Successful!',
				data: { token }
			});
		});
	})(req, res, next);
});

module.exports = router;
