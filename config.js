module.exports = {
	DIR: __dirname,
	SECRET_KEY: process.env.SECRET_KEY,
	facebook: {
		clientID: process.env.FB_CLIENT_ID,
		clientSecret: process.env.FB_CLIENT_SECRET,
		callbackUrl: process.env.FB_CALLBACK_URL
	}
};