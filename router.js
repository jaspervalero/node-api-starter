/**
 * node-api-starter
 * Boilerplate code for a Node.js API Server.
 *
 * @author Jasper Valero <contact@jaspervalero.com>
 * https://github.com/jaspervalero/node-api-starter
 */
const passport = require( 'passport' );

const Authentication = require( './controllers/authentication' );
const passportService = require( './services/passport' );

/**
 * Create auth helpers, which disable Passport's default cookie
 * based sessions in favor of JWTs.
 */
const requireAuth = passport.authenticate( 'jwt', { session: false });
const requireSignin = passport.authenticate( 'local', { session: false });

module.exports = function( app ) {

	// Index route
	app.get( '/', requireAuth, function( req, res ) {
		res.send({ success: true });
	});

	// Signup route
	app.post( '/signup', Authentication.signup );

	// Signin route
	app.post( '/signin', requireSignin, Authentication.signin );

};