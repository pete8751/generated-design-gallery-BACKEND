import knex from 'knex'

console.log('Connecting to database:', 'postgres://mctmmxhhrtynxt:3ce70061e5c2ef467833d096acbf247f0999914703c7bd415bd7ec6b6e2b27c5@ec2-3-212-70-5.compute-1.amazonaws.com:5432/d4hp2tol0nsaoo');

const db = knex({
  client: 'pg',
  connection: {
    connectionString: 'postgres://mctmmxhhrtynxt:3ce70061e5c2ef467833d096acbf247f0999914703c7bd415bd7ec6b6e2b27c5@ec2-3-212-70-5.compute-1.amazonaws.com:5432/d4hp2tol0nsaoo',
    searchPath: ['public'], // Optional: set the default schema
    ssl: { rejectUnauthorized: false }, // Enable SSL
  },
});

const HOSTNAME = 'ec2-3-212-70-5.compute-1.amazonaws.com';
const USER = 'mctmmxhhrtynxt';
const PASSWORD = '3ce70061e5c2ef467833d096acbf247f0999914703c7bd415bd7ec6b6e2b27c5';
const DATABASE_NAME = 'd4hp2tol0nsaoo';
const URL = "postgres://mctmmxhhrtynxt:3ce70061e5c2ef467833d096acbf247f0999914703c7bd415bd7ec6b6e2b27c5@ec2-3-212-70-5.compute-1.amazonaws.com:5432/d4hp2tol0nsaoo";


// Test the connection
db.raw('SELECT 1')
  .then(result => {
    console.log('Connected to the database:', result.rows[0]);
  })
  .catch(error => {
    console.error('Error connecting to the database:', error);
  })
  .finally(() => {
    // Destroy the connection pool
    db.destroy();
  });