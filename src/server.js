const config = require("./Config.js")
const app = config.app
const passport = config.passport
const jwt = config.jwt
const jwtOptions = config.jwtOptions
const logger = config.logger
const jimp = require("jimp")
const jsonpatch = require("jsonpatch")

app.get("/", function(req, res) {
  logger.info("Incmong request for /")
  res.json({message: "Welcome Public API"})
})

app.post("/login", function(req, res) {
  logger.info("Incmong request for /login")
  if(req.body.username && req.body.password){
    var username = req.body.username
    var password = req.body.password
    logger.info("User: %s logged in", username)
  }
  else {
    logger.warn("Bad Request for login")
    return res.status(400).json({status: "Error", message: "Please provide valid credentials"})
  }

  var payload = {id: username}
  var token = jwt.sign(payload, jwtOptions.secretOrKey)
  res.json({message: "ok", token: token})
});

app.patch("/json", passport.authenticate('jwt', { session: false }), function(req, res){
  logger.info("Incmong request for /json")
  logger.log({
      level: 'debug',
      message: "Header Information /json",
      headers: JSON.stringify(req.headers)
    })
  try {
    var json = JSON.parse(req.body.json)
    var patch = JSON.parse(req.body.patch)
  }
  catch (ex) {
    logger.log({
      level: 'error',
      message: "Invalid JSON.",
      exception: ex
    })
    return res.status(400).json({message: "Unable to parse JSON."})
  }
  var patchedObj = jsonpatch.apply_patch(json, patch)
  res.json(patchedObj)
})

app.get('/thumbnail', passport.authenticate('jwt', { session: false }), function(req, res){
  logger.info("Incmong request for /thumbnail")
  logger.log({
      level: 'debug',
      message: "Header Information /thumbnail",
      headers: JSON.stringify(req.headers)
    })
  var imgURL = req.query.url
  jimp.read(imgURL, function(err, img){
    if (err || img == undefined) {
      logger.log({
        level: 'error',
        message: "Invalid Image URL.",
        exception: err
      })
     return res.status(400).send("Oops. Something went wrong. Error : " + err)
    }

    img.resize(50, 50).getBase64(jimp.AUTO, function(e, img64){
     if(e) {
      logger.log({
        level: 'error',
        message: "Resizing Error",
        exception: err
       })
       return res.status(400).send("Oops. Something went wrong. Error : " + e)
     }
     else
      return res.send('<img src="' + img64 + '">')
    })
  })
})

var server = app.listen(3000, function() {
  logger.info("Express Running")
})

module.exports.server = server
