const expect = require('Chai').expect
const request = require('request')
var querystring = require('querystring')


var app = require('../src/server.js')

describe('SC Node App Tests', function () {
  before(function () {
    app.server;
  })

  after(function () {
    app.server.close();
  })

  var token = ""

  describe('Positive Test cases', function () {

    it('should return Ok for public API', function (done) {
      request.get('http://localhost:3000', function (err, res, body){
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.equal('{"message":"Welcome Public API"}')
        done()
      })
    })

    it('should accept URL encoded form data for login', function (done) {
      var form = {
        username: 'usr',
        password: 'pwd',
      }
      var formData = querystring.stringify(form)

      request({
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        uri: 'http://localhost:3000/login',
        body: formData,
        method: 'POST'
      }, function (err, res, body){
        expect(res.statusCode).to.equal(200)
        var response = JSON.parse(res.body)
        token = response.token
        done()
      })
    })

    it('should be able to patch json', function (done) {
      var form = {
        json: '{"baz": "qux","foo": "bar"}',
        patch: '[{ "op": "replace", "path": "/baz", "value": "boo" },{ "op": "add", "path": "/hello", "value": ["world"] },{ "op": "remove", "path": "/foo" }]',
      }
      var formData = querystring.stringify(form)

      request({
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer ' + token
        },
        uri: 'http://localhost:3000/json',
        body: formData,
        method: 'PATCH'
      }, function (err, res, body){
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.equal('{"baz":"boo","hello":["world"]}')
        done()
      })
    })

    it('should be able to resize valid images', function (done) {

      var imageURL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSBfoUlH4VlOYTskFn0uNz60_OkLTX0QdC9wVkv4bd_LKZxVn4"
      request({
        headers: {
          'Authorization': 'Bearer ' + token
        },
        uri: "http://localhost:3000/thumbnail?url=" + imageURL,
        method: 'GET'
      }, function (err, res, body){
        expect(res.statusCode).to.equal(200)
        done()
      })
    })

  })

  describe('Negative Test cases should pass', function () {

    it('should return Unauthorized', function (done) {
      request.patch('http://localhost:3000/json', function (err, res, body){
        expect(res.statusCode).to.equal(401)
        done()
      })
    })

    it('should return NotFound for invalid method', function (done) {
      request.get('http://localhost:3000/json', function (err, res, body){
        expect(res.statusCode).to.equal(404)
        done()
      })
    })

    it('should not accept credentials in the URL', function (done) {
      request.post('http://localhost:3000/login?username=temp&password=temp', function (err, res, body){
        expect(res.statusCode).to.equal(400)
        done()
      })
    })

    it('should fail for invalid json', function (done) {
      var form = {
        json: '{"baz": "qux","foo": "bar"',
        patch: '[{ "op": "replace", "path": "/baz", "value": "boo" },{ "op": "add", "path": "/hello", "value": ["world"] },{ "op": "remove", "path": "/foo" }]',
      }
      var formData = querystring.stringify(form)

      request({
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer ' + token
        },
        uri: 'http://localhost:3000/json',
        body: formData,
        method: 'PATCH'
      }, function (err, res, body){
        expect(res.statusCode).to.equal(400)
        expect(res.body).to.equal('{"message":"Unable to parse JSON."}')
        done()
      })
    })

    it('should fail for invalid image URL', function (done) {
      this.timeout(5000);
      var imageURL = "https://nodejs.org/static/images/logos/nodejs-new-pantone-black.ai"
      request({
        headers: {
          'Authorization': 'Bearer ' + token
        },
        uri: "http://localhost:3000/thumbnail?url=" + imageURL,
        method: 'GET'
      }, function (err, res, body){
        expect(res.statusCode).to.equal(400)
        done()
      })
    })

  })
})