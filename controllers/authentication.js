/**
 * node-api-starter
 * Boilerplate code for a Node.js API Server.
 *
 * @author Jasper Valero <contact@jaspervalero.com>
 * https://github.com/jaspervalero/node-api-starter
 */
const jwt = require( 'jwt-simple' );

const config = require( '../config' );
const User = require( '../models/user' );

/**
 * Returns a valid JWT token.
 * @param  {Object} user User object
 * @return {String}      Valid JWT token
 */
function tokenForUser( user ) {
	const timestamp = new Date().getTime();

	return jwt.encode({
		sub: user.id,
		iat: timestamp // Issued At Time
	}, config.secret );
}

exports.signin = function( req, res, next ) {
	// User already auth'd, return token
	res.send({ token: tokenForUser( req.user ) });
};

exports.signup = function( req, res, next ) {
	const email = req.body.email;
	const password = req.body.password;

	// Handle missing email or password
	if ( ! email || ! password ) {
		return res.status( 422 ).send({
			error: 'You must provide both an email and password.'
		});
	}

	User.findOne({ email: email}, function( err, existingUser ) {
		const user = new User({
			email: email,
			password: password
		});

		// Handle errors
		if ( err ) { return next( err ); }

		// Handle existing user error
		if ( existingUser ) {
			return res.status( 422 ).send({
				error: 'Email is already in use.'
			});
		}

		// Save user to DB
		user.save( function() {
			// Handle errors
			if ( err ) { return next( err ); }

			// Return user token indicating user was created
			res.json({
				token: tokenForUser( user )
			});
		});
	});
};