const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");

const GOOGLE_CLIENT_ID = "78158819188-2tg3ogjuecdp3bqvvpak4q55580hmet2.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

GITHUB_CLIENT_ID = "your id";
GITHUB_CLIENT_SECRET = "your id";

FACEBOOK_APP_ID = "your id";
FACEBOOK_APP_SECRET = "your id";

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: GOOGLE_CLIENT_ID,
//       clientSecret: GOOGLE_CLIENT_SECRET,
//       callbackURL: "/auth/google/callback",
//       scope: ["profile", "email", "offline_access"],
//       // proxy:true,
//     },
//     function (accessToken, refreshToken, profile, done) {
//       console.log("accessToken",accessToken);
//       console.log("refreshToken",refreshToken);
//       console.log("profile",profile);
//       console.log("hit")
//       done(null, profile);
//     }
//   )
// );

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: GOOGLE_CLIENT_ID,
//       clientSecret: GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:5000/auth/google/callback",
//       accessType: 'offline',
//       passReqToCallback: true,
//       scope: ["profile", "email", "offline_access"],
//       // proxy:true,
//     },
//     function (accessToken, refreshToken, profile, done) {
//       console.log("accessToken",accessToken);
//       console.log("refreshToken",refreshToken);
//       console.log("profile",profile);
//       console.log("hit")
//       done(null, profile);
//     }
//   )
// );

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
      accessType: 'offline',
      passReqToCallback: true,
      scope: ["profile", "email", "offline_access"],
      // proxy:true,
    },
    function (req, accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);


passport.use(
  new GithubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
