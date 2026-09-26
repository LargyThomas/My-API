const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { pool } = require('../db/pool');

// Called once Google has confirmed the user's identity: 
// retrieves or creates the corresponding account in the database
async function handleGoogleUser(accessToken, refreshToken, profile, done) {
	try {
		const googleId = profile.id;
		const email = profile.emails[0].value;
		const displayName = profile.displayName;

		const existing = await pool.query(
			'SELECT id, email FROM users WHERE google_id = $1',
			[googleId]
		);

		if (existing.rows.length > 0) {
			return done(null, existing.rows[0]);
		}

		const created = await pool.query(
			`INSERT INTO users (email, google_id, display_name, created_at)
			 VALUES ($1, $2, $3, NOW())
			 RETURNING id, email`,
			[email, googleId, displayName]
		);

		return done(null, created.rows[0]);
	} catch (error) {
		return done(error);
	}
}

// Register the Google strategy with Passport using your app credentials
passport.use(new GoogleStrategy(
	{
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: process.env.GOOGLE_CALLBACK_URL
	},
	handleGoogleUser
));

module.exports = passport;