// const mysql = require('mysql2');
// require('dotenv').config();

// const pool = mysql.createPool({
//   host: process.env.DB_HOST || 'localhost',
//   user: Number(process.env.DB_USER) || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'herbarium_db',
//   port: process.env.DB_PORT || 4000, // <--- Add this line
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//   ssl: {
//     rejectUnauthorized: true

//   }
// });

// module.exports = pool.promise(); // Using promises makes code cleaner

const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOSTNAME,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,

    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    },

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;