const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const cookieSession = require('cookie-session');
const User = require('../app/models/User');
const Role = require('../app/models/Role');
const generator = require('generate-password');
const bcrypt = require('bcrypt');

module.exports = (app) => {
    app.use(cookieSession({ secret: 'anything' }));
    // Initializes passport and passport sessions
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
        done(null, user);
    });
      
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });
    
    //Passport GG Strategy
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL,
                passReqToCallback: true,
            },
            (request, accessToken, refreshToken, profile, done) => {
                const { email: email, sub: googleId, name: fullname, picture: avatar, domain } = profile._json;                    
                if (!!domain && domain === 'student.tdtu.edu.vn') {
                    const password = bcrypt.hashSync(generator.generate({
                        length: 10,
                        numbers: true
                    }), 10);
                    Role.findOne({ name: 'student' }).lean()
                    .then(role => {
                        User.findOne({ googleId: profile.id })
                        .then((existUser) => {
                            if (existUser) {
                                return done(null, existUser);
                            }
                            else {
                                User.create({ fullname, avatar, username: email, email, password, googleId, role: role._id })
                                .then(user => {
                                    return done(null, user)
                                });
                            }
                        });
                    });
                }
                else {
                    return done(null, profile);
                }
            }
        )
    );
}