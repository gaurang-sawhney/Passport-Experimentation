# SC Node Applicatiomn

This is a very small node application which tends to make use of passport.js for authentication purpose.
The idea behind this application is to understand how we can make use of Passport.js to prevent unauthenticated access to an endpoint.

# New Features!

  - It supports authentication.
  - It supports JSON patching.
  - It supports creation of thumbnails of an image.
  - Also implements the Dockerized file for easy execution.
 
## Supported Endpoints

| Endpoint | Description | Method | Required Params | Params Description | Authenticated |
| ------ | ------ | ------ | ------ | ------ | ------ |
| / | Public Endpoint for test purpose. | GET | N/A | N/A | No |
| /login | Enpoint to enable login. | POST | username, password | Username and passoword of the user. | No |
| /json | Endpoint to apply patch to the JSON. | PATCH | json, patch | JSON to be patched and it's patch | Yes | 
| /thumbnail | Endpoint to get a thumbnail of image. | GET | url | Public URL of the image. | Yes |

## How to Run
You can run the application in two ways:-
### Node Based Execution
- Go to the root directory and run the command `npm install`. This will install all the third party libraries.
- Now run the command `npm start`. This will host the application on `http://localhost:3000`
### Docker Based Execution
- Go to the root directory and where the `Dockerfile` is present.
- Run the command `docker build -t SC_Node_App`. This command will build the docker image for you.
- Now run the command `docker run -p 49160:3000 -d SC_Node_App`. This command starts the execution of the built image.

### Usage
- You can test the application by sending a `GET` request to `localhost:3000/`. The server will respond back with `Welcome Public API`.
- In order to get the JWT token, send a `POST` request to `localhost:3000/login` with content type `application/x-www-form-urlencoded` and content `username` and `password` using POSTMAN. This will return you an JWT Bearer token. Please copy the bearer token as it will be used for all further requests.
- In order to test the JSON patch functionality, send a `PATCH` request to `localhost:3000/json` with content type `application/x-www-form-urlencoded` and content `json` and `patch` which corresponds to the JSON to be patched and it's corresponding patch. Before executing the request, please add the a `Header` with key `Authorization` and value `Bearer <token>`. Upon executing the request you will get the patched JSON.
- In order to test the thumbnail functionality. send a `GET` request to `localhost:3000/thumbnail?url=<image_url>`. Again before executing the request, please add the a `Header` with key `Authorization` and value `Bearer <token>`. Upon executing the request you will get the image thumbnail.

## Test
You can run the test cases using the command `npm test`. This command will execute all the test cases and at the end will also display the total test coverage. [Mocha](https://mochajs.org/) and [Istanbul](https://istanbul.js.org/) helped us achieve this in a vert convenient manner. 

## Logging
For the purpose of logging, we have made use of [Winston](https://github.com/winstonjs/winston) which creates the log in `server.log` file in the root directory. 

# Third Party Dependencies
| Dependency | Version |
| ------- | -------- |
| [Express.js](https://expressjs.com/) | 4.16.3 |
| [Body-Parser](https://www.npmjs.com/package/body-parser) | 1.18.3 |
| [Jimp](https://github.com/oliver-moran/jimp) | 0.2.28 |
| [JSON Patch](http://jsonpatch.com/) | 3.0.1 |
| [JSON Web Token](https://www.npmjs.com/package/jsonwebtoken) | 8.3.0 |
| [Passport.js](http://www.passportjs.org/) | 0.4.0 |
| [Passport JWT](https://www.npmjs.com/package/passport-jwt) | 4.0.0 |
| [Winston](https://www.npmjs.com/package/winston) | 3.0.0 |
| [Chai](www.chaijs.com/) | 4.1.2 |
| [Istanbul](https://istanbul.js.org/) | 0.4.5 |
| [Mocha](https://mochajs.org/) | 5.2.0 |
| [NYC](https://github.com/istanbuljs/nyc) | 12.0.2 |
| [Querystring](https://nodejs.org/api/querystring.html) | 0.2.0 |
| [Request](https://www.npmjs.com/package/request) | 2.87.0 |


