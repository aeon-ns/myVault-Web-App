const jwt = require('jsonwebtoken');
const config = require('../config');

exports.getToken = function(user) {
	return jwt.sign(user, config.SECRET_KEY, { expiresIn: 3600 });
};

exports.verifyOrdinaryUser = function(req, res, next) {
	// check header or url parameters or post parameters for token
	var token =
		req.body.token || req.query.token || req.headers['x-access-token'];

	if (!token) {
		// if there is no token
		// return an error
		var err = new Error('Unauthorized access. Please login to proceed.');
		err.status = 401;
		return next(err);
	}
	//decode token
	//verifies secret and checks exp
	jwt.verify(token, config.SECRET_KEY, function(err, decoded) {
		if (err) {
			if (err.name === 'TokenExpiredError') {
				err.message = 'Your session has expired. Please login again.';
			} else {
				err.message = 'Unauthorized access. Please login to proceed.';
			}
			err.status = 401;
			return next(err);
		}
		// if everything is good, save to request for use in other routes
		req.decoded = decoded;
		next();
	});
};
