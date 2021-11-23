require('dotenv').config();
const { DB_HOST, DB_NAME, DB_USER, DB_PASS, DB_URI } = process.env;

module.exports = {
  "development": {
    "username": 'postgres',
    "password": 'postgres',
    "database": "courseapi_database_dev",
    "host": '127.0.0.1',
    "dialect": "postgres"
  },
  "test": {
    "username": DB_USER,
    "password": DB_PASS,
    "database": "courseapi_database_test",
    "host": DB_HOST,
    "dialect": "postgres"
  },
  "production": {
    "username": DB_USER,
    "password": DB_PASS,
    "database": DB_NAME,
    "host": DB_HOST,
    "uri": DB_URI,
    "dialect": "postgres",
    "protocol": "postgres",
    "dialectOptions": {
      "ssl": true
    }
  }
}
