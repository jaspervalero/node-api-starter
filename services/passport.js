/**
 * node-api-starter
 * Boilerplate code for a Node.js API Server.
 *
 * @author Jasper Valero <contact@jaspervalero.com>
 * https://github.com/jaspervalero/node-api-starter
 */
const passport = require( 'passport' );
const LocalStrategy = require( 'passport-local' );
const JwtStrategy = require( 'passport-jwt' ).Strategy;
const ExtractJwt = require( 'passport-jwt' ).ExtractJwt;

const config = require( '../config' );
const User = require( '../models/user' );

// Setup options for local strategy
const localOptions = {
	usernameField: 'email',
	passwordField: 'password'
};

// Create local strategy
const localSignin = new LocalStrategy( localOptions,
	function( email, password, done ) {
	// Verify email and password
	User.findOne({ email: email }, function( err, user ) {
		// Handle errors
		if ( err ) { return done( err ); }

		// Handle user not found by email
		if ( ! user ) {
			return done( null, false );
		}

		// Is `password' = to user.password?
		user.comparePassword( password, function( err, isMatch ) {
			// Handle errors
			if ( err ) { return done( err ); }

			// No match
			if ( ! isMatch ) {
				return done( null, false );
			}

			// Match
			return done( null, user );
		});
	});
});

// Setup options for JWT strategy
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader( 'authorization' ),
	secretOrKey: config.secret
};

// Create JWT strategy
const jwtSignin = new JwtStrategy( jwtOptions, function( payload, done ) {
	// Check DB for user ID in payload
	User.findById( payload.sub, function( err, user ) {
		// Handle errors
		if ( err ) { return done( err, false ); }

		// No user found by ID
		if ( ! user ) {
			done( null, false );
		}

		// User found
		done( null, user );
	});
});

// Make Passport use strategies
passport.use( localSignin );
passport.use( jwtSignin );