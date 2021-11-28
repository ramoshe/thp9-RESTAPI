require('dotenv').config();
const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_URI } = process.env;

module.exports = {
  "development": {
    "username": DB_USERNAME,
    "password": DB_PASSWORD,
    "database": "courseapi_database_dev",
    "host": DB_HOST,
    "dialect": "postgres"
  },
  "test": {
    "username": DB_USERNAME,
    "password": DB_PASSWORD,
    "database": "courseapi_database_test",
    "host": DB_HOST,
    "dialect": "postgres"
  },
  "production": {
    "username": DB_USERNAME,
    "password": DB_PASSWORD,
    "database": "d7o1kg98ers0fu",
    "host": DB_HOST,
    "uri": DB_URI,
    "dialect": "postgres",
    "protocol": "postgres",
    "dialectOptions": {
      "ssl": true
    }
  }
}
