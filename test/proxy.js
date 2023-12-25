import dotenv from 'dotenv';
import pgp from 'pg-promise';

// Load environment variables from .env file
dotenv.config();
const DATABASE_URL = "postgres://mctmmxhhrtynxt:3ce70061e5c2ef467833d096acbf247f0999914703c7bd415bd7ec6b6e2b27c5@ec2-3-212-70-5.compute-1.amazonaws.com:5432/d4hp2tol0nsaoo";


// Connect to the database
const db = pgp(DATABASE_URL);

// Test the connection
db.one('SELECT 1')
  .then(result => {
    console.log('Connected to the database:', result);
  })
  .catch(error => {
    console.error('Error connecting to the database:', error);
  })
  .finally(() => {
    // Close the database connection
    pgp.end();
  });