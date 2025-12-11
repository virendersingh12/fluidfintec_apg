const mongoose = require('mongoose');
const config = require('config');

// set mongoose Promise to Bluebird
mongoose.Promise = Promise;

// Exit application on error
mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */
exports.connect = () => {
  mongoose
    .connect(
      config.get('mongo.uri'),
      {
        useCreateIndex: true,
        keepAlive: 1,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
      (err) => {
        if (!err) {
          console.log('mongoDB connected...');
        } else {
          console.log(`MongoDB connection error: ${err}`);
        }
      });

  return mongoose.connection;
};
