import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { findOrCreateGoogleUser } from "../services/auth.service";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateGoogleUser(profile);
        done(null, user);
      } catch (error) {
        done(error, undefined);
      }
    }
  )
);

// We're using stateless JWT auth, so we don't strictly need serialize/deserialize 
// unless we use passport.session(), but it's good practice to have them or explicitly disable session.
// However, since we'll generate a JWT token in the callback controller, we might not need session.
// Let's just leave these out for now or implement empty if passport complains.
// Actually, standard passport integration with session requires these. 
// If we don't use session: false in the route, we need them.
// We will use session: false.

export default passport;

