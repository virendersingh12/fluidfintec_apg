const debug = require('debug')('edex:main')
const config = require('config');

var path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const { ValidationError } = require('express-validation')
const { jwtStrategy } = require('./helpers/passport');
const routes = require('./routes');
require('./helpers/mongoose').connect();
const app = express();
// require('./cronJobs.js')
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

app.use(cors());

app.use(express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(routes);

app.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err)
  }

  return res.status(500).json(err)
})

const port = config.get('express.port');

const server = app.listen(port, () => console.log('Example app listening on port:', port))
const timeout = 360000;
server.setTimeout(timeout);
debug('express started on port %s', port)

const date = new Date();
console.log('date___________', date)

