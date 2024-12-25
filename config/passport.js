import {Employee} from "../models/employee.js";
import PassportJWT from "passport-jwt";
import config from "./config.js";
import passport from "passport";

const options = {
    jwtFromRequest: PassportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secretKey,
};

passport.use(
    new PassportJWT.Strategy(options, async (payload, done) => {
        try {
            const user = await Employee.findOne({ _id: payload.id });
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error);
        }
    })
);

export default passport;