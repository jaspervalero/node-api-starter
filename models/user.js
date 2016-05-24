/**
 * node-api-starter
 * Boilerplate code for a Node.js API Server.
 *
 * @author Jasper Valero <contact@jaspervalero.com>
 * https://github.com/jaspervalero/node-api-starter
 */
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const bcrypt = require( 'bcrypt-nodejs' );

// Define User model
const userSchema = new Schema({
	email: {
		type: String,
		unique: true,
		lowercase: true
	},
	password: String
});

// On Save Hook, encrypt password
userSchema.pre( 'save', function( next ) {
	// Create alias for current user model
	const user = this;

	// Generate salt
	bcrypt.genSalt( 10, function( err, salt ) {
		// Handle errors
		if ( err ) { return next( err ); }

		// Hash password + salt
		bcrypt.hash( user.password, salt, null, function( err, hash ) {
			// Handle errors
			if ( err ) { return next( err ); }

			user.password = hash;
			next();
		});
	});
});

// Make comparePassword helper method available
userSchema.methods.comparePassword = function( candidatePassword, callback ) {
	bcrypt.compare( candidatePassword, this.password, function( err, isMatch ) {
		// Handle errors
		if ( err ) { return callback( err ); }

		callback( null, isMatch );
	});
};

// Create and export ModelClass
const ModelClass = mongoose.model( 'user', userSchema );
module.exports = ModelClass;