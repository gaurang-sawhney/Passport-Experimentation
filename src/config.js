const express = require("express") 
const bodyParser = require("body-parser")
const jwt = require('jsonwebtoken')
const winston = require('winston')

const passport = require("passport")
const passportJWT = require("passport-jwt")

const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = 'thisIsASecretKey'

const strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  next(null, true)
})

passport.use(strategy)

const app = express();
app.use(passport.initialize())

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json())

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.prettyPrint()
  ),
  transports: [
    new winston.transports.File({ filename: 'server.log', level: 'debug' })
  ]
});

module.exports.app = app
module.exports.passport = passport
module.exports.jwt = jwt
module.exports.jwtOptions = jwtOptions
module.exports.logger = logger
