// Passport configuration for Google OAuth2 (stateless, no sessions)
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { pool } = require('../db/pool');

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleCallbackUrl = process.env.GOOGLE_CALLBACK_URL;

if (googleClientId && googleClientSecret) {
    passport.use(new GoogleStrategy(
        { clientID: googleClientId, clientSecret: googleClientSecret, callbackURL: googleCallbackUrl },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const googleId = profile.id;
                const email = (profile.emails && profile.emails[0] && profile.emails[0].value) || null;
                const displayName = profile.displayName || null;

                // Look for an existing user by google_id or by email (in case they registered locally first)
                const existing = await pool.query(
                    `SELECT id, email, google_id, display_name FROM users WHERE google_id = $1 OR email = $2`,
                    [googleId, email]
                );

                if (existing.rows.length > 0) {
                    const user = existing.rows[0];
                    // Link the Google account if it wasn't linked yet
                    if (!user.google_id) {
                        await pool.query('UPDATE users SET google_id = $1, display_name = $2 WHERE id = $3', [googleId, displayName, user.id]);
                    }
                    return done(null, user);
                }

                // Brand new user, created directly from their Google profile
                const inserted = await pool.query(
                    `INSERT INTO users (email, google_id, display_name, created_at)
                     VALUES ($1, $2, $3, NOW())
                     RETURNING id, email, google_id, display_name`,
                    [email, googleId, displayName]
                );

                return done(null, inserted.rows[0]);
            } catch (err) {
                return done(err);
            }
        }
    ));
}

module.exports = passport;